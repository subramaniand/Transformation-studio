import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  console.warn('⚠️  Supabase credentials not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local');
}

export const supabase = createClient(
  supabaseUrl || 'https://YOUR_PROJECT.supabase.co',
  supabaseAnonKey || 'YOUR_ANON_KEY_HERE'
);

// Test connection
export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase.from('users').select('count()', { count: 'exact' }).limit(1);
    if (error) throw error;
    console.log('✓ Supabase connected successfully');
    return true;
  } catch (e) {
    console.error('✗ Supabase connection failed:', e.message);
    return false;
  }
}
