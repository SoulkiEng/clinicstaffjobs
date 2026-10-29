import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dslzkfkdtikdhnyebsvg.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_n4vG_Jrw7F6GxFPa7Zj6HQ_2V8XUu1k';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
