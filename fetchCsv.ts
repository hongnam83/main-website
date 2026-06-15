const fetchCsv = async () => {
    const res = await fetch("https://docs.google.com/spreadsheets/d/15wJEwSOPtLZUcS0dcS_hsVLvBSflixIW9BUHhgX9gbM/export?format=csv&gid=0");
    const text = await res.text();
    console.log(text);
}
fetchCsv();
