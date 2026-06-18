export interface User {
  uid: string;
  email: string;
}

export const auth = {
  currentUser: null as User | null,
};

import { supabase } from './lib/supabase';
import { blogPosts as defaultBlogPosts } from './data/blogPosts';
import { faqs as defaultFaqs } from './data/faqs';
import { categories as defaultCategories } from './data/products';
import { testimonials as defaultTestimonials } from './data/testimonials';

const DEFAULTS_MAP: Record<string, any[]> = {
  blogPosts: defaultBlogPosts,
  faqs: defaultFaqs,
  products: defaultCategories,
  testimonials: defaultTestimonials,
};

// Set up cross-tab synchronization for local events
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === 'localDB_updated_event') {
      window.dispatchEvent(new Event('localDB_updated'));
    }
  });
}

// Set up Supabase Realtime for automatic data updates
if (typeof window !== 'undefined') {
  try {
    supabase
      .channel('public-tables')
      .on('postgres_changes', { event: '*', schema: 'public' }, (payload) => {
        window.dispatchEvent(new Event('localDB_updated'));
      })
      .subscribe();
  } catch (e) {
    console.warn("Could not subscribe to Supabase Realtime", e);
  }
}

export const db = {};

export const collection = (db: any, path: string) => {
  return { path };
};

export const doc = (...args: any[]) => {
  let path = '';
  let id = '';
  
  if (args.length === 2 && typeof args[0] === 'object' && args[0].path) {
    path = args[0].path;
    id = args[1] || Math.random().toString(36).substring(7);
  } else if (args.length >= 2 && typeof args[1] === 'string') {
    path = args[1];
    id = args[2] || Math.random().toString(36).substring(7);
  } else if (args.length === 1 && typeof args[0] === 'object') {
     path = args[0].path;
     id = Math.random().toString(36).substring(7);
  }
  
  return { path, id: id || Math.random().toString(36).substring(7) };
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const HAS_SUPABASE = !!process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co';

const getMemData = (path: string) => {
  if (typeof window !== 'undefined') {
    const raw = localStorage.getItem('localDB_data_' + path);
    if (raw) return JSON.parse(raw);
  }
  return DEFAULTS_MAP[path] || [];
};

const setMemData = (path: string, data: any[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('localDB_data_' + path, JSON.stringify(data));
  }
};

export const getDocs = async (collectionRef: any) => {
  let data: any[] = [];
  if (HAS_SUPABASE) {
    try {
      const { data: errorData, error } = await supabase
        .from(collectionRef.path)
        .select('*');
      data = errorData || [];
      if (error) console.error("Supabase Error fetch:", error);
    } catch (e) {
      console.error(e);
    }
    // Do not override with local fallback if Supabase is being used to prevent stale data
    // local docs should only be used if HAS_SUPABASE is false.
    // If you need migration, you can write a one-time migration script.
    // Here we just use the data from Supabase directly.
  } else {
    data = getMemData(collectionRef.path);
  }

  // Merge with defaults
  const defaults = DEFAULTS_MAP[collectionRef.path] || [];
  const dbIds = new Set(data.map(d => d.id));
  const deletedIds = new Set(data.filter(d => d._deleted).map(d => d.id));
  
  const mergedData = [
    ...data.filter(d => !d._deleted),
    ...defaults.filter(d => !dbIds.has(d.id) && !deletedIds.has(d.id))
  ];

  return {
    docs: mergedData.map((item: any) => ({
      id: item.id,
      data: () => item
    }))
  };
};

export const getDoc = async (docRef: any) => {
  let data = null;
  if (HAS_SUPABASE) {
    try {
        const { data: resData, error } = await supabase
           .from(docRef.path)
           .select('*')
           .eq('id', docRef.id)
           .single();
        if (!error && resData) {
            data = resData;
        }
        
        // We do not merge local memory data because it can contain stale state 
        // from before Supabase was connected.
    } catch (e) {}
  } else {
    const localDocs = getMemData(docRef.path);
    data = localDocs.find((d: any) => d.id === docRef.id) || null;
  }

  // Fallback to defaults
  if (!data || data._deleted) {
      const defaults = DEFAULTS_MAP[docRef.path] || [];
      const defaultItem = defaults.find((d: any) => d.id === docRef.id);
      if (defaultItem && (!data || !data._deleted)) {
          data = defaultItem;
      } else {
          data = null;
      }
  }

  return {
    id: docRef.id,
    exists: () => !!data,
    data: () => data
  };
};

export const setDoc = async (docRef: any, data: any, options?: any) => {
  if (!HAS_SUPABASE) {
      let list = getMemData(docRef.path);
      const existing = list.findIndex((item:any) => item.id === docRef.id);
      const payload = { ...data, id: docRef.id };
      if (existing !== -1) {
          list[existing] = { ...list[existing], ...payload };
      } else {
          list.push(payload);
      }
      setMemData(docRef.path, list);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('localDB_updated'));
        localStorage.setItem('localDB_updated_event', Date.now().toString());
      }
      return;
  }
  
  let payload = { ...data, id: docRef.id };

  const { error } = await supabase
    .from(docRef.path)
    .upsert(payload);
    
  if (error) {
     console.error(`Supabase upsert failed for ${docRef.path}:`, error);
     const err = new Error(error.message);
     (err as any).details = error.details;
     (err as any).hint = error.hint;
     (err as any).code = error.code;
     throw err;
  }
  
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('localDB_updated'));
    localStorage.setItem('localDB_updated_event', Date.now().toString());
  }
};

export const deleteDoc = async (docRef: any) => {
  if (!HAS_SUPABASE) {
      let list = getMemData(docRef.path);
      const existing = list.findIndex((item:any) => item.id === docRef.id);
      if (existing !== -1) {
          list[existing]._deleted = true;
          setMemData(docRef.path, list);
      }
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('localDB_updated'));
        localStorage.setItem('localDB_updated_event', Date.now().toString());
      }
      return;
  }

  const { error } = await supabase
    .from(docRef.path)
    .delete()
    .eq('id', docRef.id);
    
  if (error) {
    console.error(`Supabase delete failed for ${docRef.path}:`, error);
    throw new Error(`Lỗi Supabase (xóa): ${error.message}`);
  }
  
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('localDB_updated'));
    localStorage.setItem('localDB_updated_event', Date.now().toString());
  }
};

export const signInWithEmailAndPassword = async (authObj: any, email: string, password: string) => {
  if (email === 'sonnt.credit@gmail.com' && password === '12345678') {
    const user = { uid: '1', email };
    auth.currentUser = user;
    localStorage.setItem('auth_user', JSON.stringify(user));
    fireAuthStateChanged(user);
    return { user };
  }
  throw new Error("Invalid credentials");
};

export const signOut = async (authObj: any) => {
  auth.currentUser = null;
  localStorage.removeItem('auth_user');
  fireAuthStateChanged(null);
};

let authStateListeners: any[] = [];
export const onAuthStateChanged = (authObj: any, callback: any) => {
  authStateListeners.push(callback);
  const stored = localStorage.getItem('auth_user');
  if (stored) {
    try {
      const user = JSON.parse(stored);
      auth.currentUser = user;
      callback(user);
    } catch(e) {
      callback(null);
    }
  } else {
    callback(null);
  }
  return () => {
    authStateListeners = authStateListeners.filter(l => l !== callback);
  };
};

const fireAuthStateChanged = (user: any) => {
  authStateListeners.forEach(l => l(user));
};

export const createUserWithEmailAndPassword = async (authObj: any, email: string, password: string) => {
  return { user: { uid: Math.random().toString(36).substring(7), email } };
};

export const sendPasswordResetEmail = async (authObj: any, email: string) => {
  return true;
};

export const writeBatch = (db: any) => {
  const operations: any[] = [];
  return {
    set: (docRef: any, data: any, options: any) => {
      operations.push(() => setDoc(docRef, data, options));
    },
    delete: (docRef: any) => {
      operations.push(() => deleteDoc(docRef));
    },
    commit: async () => {
      for (const op of operations) {
        await op();
      }
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('localDB_updated'));
        localStorage.setItem('localDB_updated_event', Date.now().toString());
      }
    }
  };
};
