export interface User {
  uid: string;
  email: string;
}

export const auth = {
  currentUser: null as User | null,
};

import { supabase } from './lib/supabase';
import { categories } from './data/products';
import { blogPosts } from './data/blogPosts';
import { faqs } from './data/faqs';
import { testimonials as sheetTestimonials } from './data/testimonials';

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

const seedData: any = {
  products: categories,
  blogPosts: blogPosts,
  faqs: faqs,
  testimonials: sheetTestimonials,
};

export const getDocs = async (collectionRef: any) => {
  try {
    const { data: errorData, error } = await supabase
      .from(collectionRef.path)
      .select('*');
      
    let data = errorData || [];
    
    if (error) {
       console.error("Supabase Error fetch:", error);
    }
    
    if (data.length === 0 && seedData[collectionRef.path]) {
      data = seedData[collectionRef.path];
      
      // Auto-init seed data via upsert in the background if empty, so the user doesn't have to manually seed
      if (typeof window !== 'undefined') {
         setTimeout(async () => {
             for (const item of data) {
                await supabase.from(collectionRef.path).upsert({ ...item, id: item.id });
             }
         }, 1000);
      }
    }
    
    return {
      docs: data.map((item: any) => ({
        id: item.id,
        data: () => item
      }))
    };
  } catch (e) {
      console.error(e);
      return { docs: [] };
  }
};

export const getDoc = async (docRef: any) => {
  try {
      const { data, error } = await supabase
         .from(docRef.path)
         .select('*')
         .eq('id', docRef.id)
         .single();
         
      if (error || !data) {
          if (seedData[docRef.path]) {
             const item = seedData[docRef.path].find((i: any) => i.id === docRef.id);
             if (item) {
                 return { id: docRef.id, exists: () => true, data: () => item };
             }
          }
          return { id: docRef.id, exists: () => false, data: () => null };
      }
      return {
        id: docRef.id,
        exists: () => !!data,
        data: () => data
      };
  } catch (e) {
      return { id: docRef.id, exists: () => false, data: () => null };
  }
};

export const setDoc = async (docRef: any, data: any, options?: any) => {
  try {
      const payload = { ...data, id: docRef.id };
      
      const { error } = await supabase
        .from(docRef.path)
        .upsert(payload);
        
      if (error) {
         console.warn(`Supabase upsert failed: ${error.message}. Falling back to local memory.`);
         if (seedData[docRef.path]) {
             const index = seedData[docRef.path].findIndex((i: any) => i.id === docRef.id);
             if (index >= 0) seedData[docRef.path][index] = payload;
             else seedData[docRef.path].push(payload);
         }
      }
      
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('localDB_updated'));
      }
  } catch (e) {
      console.error(e);
  }
};

export const deleteDoc = async (docRef: any) => {
  try {
      const { error } = await supabase
        .from(docRef.path)
        .delete()
        .eq('id', docRef.id);
        
      if (error) {
        console.warn(`Supabase delete failed: ${error.message}. Falling back to local memory.`);
        if (seedData[docRef.path]) {
            seedData[docRef.path] = seedData[docRef.path].filter((i: any) => i.id !== docRef.id);
        }
      }
      
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('localDB_updated'));
      }
  } catch (e) {
      console.error(e);
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
      }
    }
  };
};
