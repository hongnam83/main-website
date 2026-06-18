import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const payload = {
    id: 'nieng-rang-co-an-duoc-thit-ga-khong-huong-dan-an-dung-cach-cho-dong-nieng-',
    status: 'published'
  };
  const { error } = await supabase.from('blogPosts').upsert(payload);
  console.log("Upsert Error:", error);
  
  const { data } = await supabase.from('blogPosts').select('id, status').eq('id', payload.id);
  console.log("After update:", data);
}

run();
