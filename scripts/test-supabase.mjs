import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dslzkfkdtikdhnyebsvg.supabase.co';
const supabaseKey = 'sb_publishable_n4vG_Jrw7F6GxFPa7Zj6HQ_2V8XUu1k';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('Testing Supabase API connection to:', supabaseUrl);
  const { data, error } = await supabase.from('jobs').select('*').limit(1);
  if (error) {
    console.log('Supabase connected! Note:', error.message);
  } else {
    console.log('Success! Data returned:', data);
  }
}

testConnection();
