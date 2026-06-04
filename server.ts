import express from 'express';
import path from 'path';
import cors from 'cors';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json({ limit: '50mb' }));

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  app.post('/api/translate', async (req, res) => {
    try {
      const { text, targetLanguage = 'English' } = req.body;
      if (!text) return res.status(400).json({ error: 'No text provided' });
      
      const { GoogleGenAI } = await import('@google/genai');
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Translate the following Markdown/HTML text into ${targetLanguage}. Maintain all formatting, line breaks, and elements exactly as they are. Keep technical terms if they correspond properly. Here is the text:\n\n${text}`
      });

      res.json({ translatedText: response.text });
    } catch (err: any) {
      console.error("Translation Error:", err);
      res.status(500).json({ error: err.message || 'Translation failed' });
    }
  });

  const DB_FILE = path.join(process.cwd(), 'local_db.json');
  
  // Seed data from the front-end if available, but since we are server side, we can just start empty 
  // and let the front-end populate if needed or we can read from standard json.
  // Actually, let's just make it a dumb key-value store per collection.
  
  const readDB = () => {
    if (!fs.existsSync(DB_FILE)) return {};
    try { return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8')); } catch { return {}; }
  };
  const writeDB = (data: any) => fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));

  app.get('/api/db/:collection', (req, res) => {
    const db = readDB();
    const collection = db[req.params.collection] || [];
    res.json(collection);
  });

  app.get('/api/db/:collection/:id', (req, res) => {
    const db = readDB();
    const collection = db[req.params.collection] || [];
    const item = collection.find((i: any) => i.id === req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  });

  app.post('/api/db/:collection/:id', (req, res) => {
    const db = readDB();
    if (!db[req.params.collection]) db[req.params.collection] = [];
    const collection = db[req.params.collection];
    const index = collection.findIndex((i: any) => String(i.id) === String(req.params.id));
    
    // Check if req.body has a merge flag (sent via headers or query)
    const merge = req.query.merge === 'true';
    
    if (index >= 0) {
      if (merge) {
         collection[index] = { ...collection[index], ...req.body, id: req.params.id };
      } else {
         collection[index] = { ...req.body, id: req.params.id };
      }
    } else {
      collection.push({ ...req.body, id: req.params.id });
    }
    
    writeDB(db);
    res.json({ success: true });
  });

  app.delete('/api/db/:collection/:id', (req, res) => {
    const db = readDB();
    if (!db[req.params.collection]) return res.json({ success: true });
    db[req.params.collection] = db[req.params.collection].filter((i: any) => i.id !== req.params.id);
    writeDB(db);
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
