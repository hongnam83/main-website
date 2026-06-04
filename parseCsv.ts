import fs from 'fs';

const fetchCsv = async () => {
    const res = await fetch("https://docs.google.com/spreadsheets/d/15wJEwSOPtLZUcS0dcS_hsVLvBSflixIW9BUHhgX9gbM/export?format=csv&gid=0");
    const text = await res.text();
    
    // Simple CSV parser
    const rows = text.split('\n');
    const data = [];
    let currentId = 1;
    
    // Skip header (i=0)
    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (!row.trim()) continue;
        
        // Parse CSV robustly taking quotes into account
        const columns = [];
        let inQuotes = false;
        let currentString = '';
        for (let j = 0; j < row.length; j++) {
            const char = row[j];
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                columns.push(currentString);
                currentString = '';
            } else {
                currentString += char;
            }
        }
        columns.push(currentString);
        
        const stt = columns[0];
        const content = columns[1]?.replace(/\\n/g, ' ').trim();
        const stars = columns[2];
        const product = columns[3];
        
        if (stt && parseInt(stt) > 0 && stars && stars.includes('★')) {
            data.push({
                id: parseInt(stt),
                name: `Khách hàng ${stt}`,
                role: 'Đã mua hàng',
                content: content,
                product: product,
                stars: 5,
                image: `/images/testimonials/${stt}.jpg`
            });
        }
    }
    
    fs.writeFileSync('src/data/testimonials.ts', `export const testimonials = ${JSON.stringify(data, null, 2)};`);
    console.log("Wrote to src/data/testimonials.ts");
}

fetchCsv();
