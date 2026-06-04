export interface User {
  uid: string;
  email: string;
}

export const auth = {
  currentUser: null as User | null,
};

export const db = {};

export const collection = (db: any, path: string) => {
  return { path };
};

export const doc = (...args: any[]) => {
  let path = '';
  let id = '';
  
  if (args.length === 2 && typeof args[0] === 'object' && args[0].path) {
    // doc(collectionRef, id)
    path = args[0].path;
    id = args[1] || Math.random().toString(36).substring(7);
  } else if (args.length >= 2 && typeof args[1] === 'string') {
    // doc(db, path, id?)
    path = args[1];
    id = args[2] || Math.random().toString(36).substring(7);
  } else if (args.length === 1 && typeof args[0] === 'object') {
     // doc(collectionRef) just generate random id
     path = args[0].path;
     id = Math.random().toString(36).substring(7);
  }
  
  return { path, id: id || Math.random().toString(36).substring(7) };
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

import { categories } from './data/products';
import { blogPosts } from './data/blogPosts';
import { faqs } from './data/faqs';
import { testimonials as sheetTestimonials } from './data/testimonials';

const seedData: any = {
  products: categories,
  blogPosts: blogPosts,
  faqs: faqs,
  testimonials: sheetTestimonials,
  admins: [{ id: '1', email: 'sonnt.credit@gmail.com' }]
};

export const getDocs = async (collectionRef: any) => {
  await delay(300);
  try {
    const res = await fetch(`/api/db/${collectionRef.path}`);
    let data: any[] = [];
    if (res.ok) {
        data = await res.json();
    }
    
    // Fallback to seed data if API returns empty and we have seed data
    if (data.length === 0 && seedData[collectionRef.path]) {
      data = seedData[collectionRef.path];
      // Init API with seed data
      for (const item of data) {
         await setDoc(doc({ path: collectionRef.path }, item.id), item);
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
  await delay(300);
  try {
      const res = await fetch(`/api/db/${docRef.path}/${docRef.id}`);
      if (!res.ok) {
          // If not found, try to look up in seedData
          if (seedData[docRef.path]) {
             const item = seedData[docRef.path].find((i: any) => i.id === docRef.id);
             if (item) {
                 await setDoc(docRef, item);
                 return { id: docRef.id, exists: () => true, data: () => item };
             }
          }
          return { id: docRef.id, exists: () => false, data: () => null };
      }
      const item = await res.json();
      return {
        id: docRef.id,
        exists: () => !!item,
        data: () => item
      };
  } catch (e) {
      return { id: docRef.id, exists: () => false, data: () => null };
  }
};

export const setDoc = async (docRef: any, data: any, options?: any) => {
  await delay(300);
  try {
      let url = `/api/db/${docRef.path}/${docRef.id}`;
      if (options && options.merge) {
         url += '?merge=true';
      }
      await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
      });
  } catch (e) {
      console.error(e);
  }
};

export const deleteDoc = async (docRef: any) => {
  await delay(300);
  try {
      await fetch(`/api/db/${docRef.path}/${docRef.id}`, { method: 'DELETE' });
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
      await delay(300);
      for (const op of operations) {
        await op();
      }
    }
  };
};
