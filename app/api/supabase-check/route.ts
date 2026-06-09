import { NextResponse } from 'next/server';

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ 
      success: false, 
      message: 'Missing Supabase environment variables. Please check the Settings menu.'
    });
  }

  // Basic validation that it looks like a Supabase URL
  const isValidUrl = supabaseUrl.includes('supabase.co');

  return NextResponse.json({ 
    success: isValidUrl, 
    message: isValidUrl ? 'Supabase credentials found and appear to be valid!' : 'Credentials found, but URL might be incorrect.' 
  });
}
