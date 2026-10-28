import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  import.meta.env?.VITE_SUPABASE_URL ||
  'https://jxtmvfamgyrmnlzfgfwq.supabase.co';

const supabaseKey =
  import.meta.env?.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env?.VITE_SUPABASE_ANON_KEY ||
  'sb_publishable_4-sM0agOoz1UH8I5zUKBGw_LTTn-9Qy';

let client = null;
try {
  if (supabaseUrl && supabaseKey) {
    client = createClient(supabaseUrl, supabaseKey);
  }
} catch (err) {
  console.warn('Supabase client failed to initialize, using safe fallback:', err);
}

export const supabase = client || {
  from: () => ({
    select: () => Promise.resolve({ data: [], error: null }),
    insert: () => Promise.resolve({ data: null, error: new Error('Supabase client not configured') }),
    update: () => Promise.resolve({ data: null, error: new Error('Supabase client not configured') }),
    delete: () => Promise.resolve({ data: null, error: new Error('Supabase client not configured') }),
  }),
  auth: {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
  }
};
