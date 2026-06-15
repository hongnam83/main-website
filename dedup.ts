import fs from 'fs';

const dbPath = 'local_db.json';
if (fs.existsSync(dbPath)) {
  const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  for (const key in db) {
    const uniq = [];
    const seen = new Set();
    for (const item of db[key]) {
      if (!seen.has(String(item.id))) {
        seen.add(String(item.id));
        uniq.push(item);
      }
    }
    db[key] = uniq;
  }
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  console.log('Deduplicated local_db.json');
}
