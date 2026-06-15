async function run() {
    try {
        const res = await fetch('http://localhost:3000/api/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: 'Xin chào' })
        });
        const text = await res.text();
        console.log("Status:", res.status, "Body:", text);
    } catch (e) {
        console.error(e);
    }
}
run();
