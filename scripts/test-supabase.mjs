import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dslzkfkdtikdhnyebsvg.supabase.co';
const supabaseKey = 'sb_publishable_n4vG_Jrw7F6GxFPa7Zj6HQ_2V8XUu1k';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  const { data, count, error } = await supabase.from('jobs').select('id, title, clinic_name', { count: 'exact' });
  if (error) {
    console.error('Error:', error.message);
  } else {
    console.log('Total jobs count in Supabase:', count);
    console.log('Sample jobs:', data);
  }
}

testConnection();
