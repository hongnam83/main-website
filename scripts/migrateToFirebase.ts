import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, writeBatch } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json' assert { type: "json" };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const DATA_DIR = path.join(__dirname, '../data_store');

async function migrate() {
  const collections = ['products', 'blogPosts', 'faqs'];
  
  for (const collection of collections) {
    const filePath = path.join(DATA_DIR, `${collection}.json`);
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      console.log(`Migrating ${collection}... found ${data.length} items`);
      const MAX_BATCH_SIZE = 100;
      for (let i = 0; i < data.length; i += MAX_BATCH_SIZE) {
        const batch = writeBatch(db);
        const chunk = data.slice(i, i + MAX_BATCH_SIZE);
        for (const item of chunk) {
          if (!item.id) {
             item.id = Date.now().toString() + Math.random().toString(36).substring(2, 7);
          }
          item.id = String(item.id);
          batch.set(doc(db, collection, item.id), item);
        }
        await batch.commit();
        console.log(`Committed batch of ${chunk.length} items for ${collection}`);
      }
      console.log(`Finished migrating ${collection}`);
    } else {
      console.log(`No data found for ${collection}`);
    }
  }
  
  console.log("Migration completed!");
  process.exit(0);
}

migrate();
