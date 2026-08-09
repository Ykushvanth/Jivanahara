import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const isValidSupabaseUrl = (value) => {
  if (!value) {
    return false;
  }

  try {
    const parsedUrl = new URL(value);
    return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
  } catch {
    return false;
  }
};

const isSupabaseConfigured = isValidSupabaseUrl(supabaseUrl) && !supabaseUrl.includes('your_supabase') && !!supabaseAnonKey && !supabaseAnonKey.includes('your_supabase');

// Create a mock client if env vars are not set
const createMockClient = () => ({
  auth: {
    signUp: async () => ({ data: null, error: new Error('Supabase not configured. Please add credentials to .env file.') })
  },
  from: () => ({
    insert: async () => ({ data: null, error: new Error('Supabase not configured') })
  })
});

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createMockClient();

export { isSupabaseConfigured };
