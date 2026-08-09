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

const isSupabaseConfigured = isValidSupabaseUrl(supabaseUrl)
  && !supabaseUrl.includes('your_supabase')
  && !!supabaseAnonKey
  && !supabaseAnonKey.includes('your_supabase');

const createMockError = () => new Error('Supabase not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');

const createMockQueryBuilder = () => {
  const builder = {
    select: () => builder,
    eq: () => builder,
    order: () => builder,
    limit: () => builder,
    single: async () => ({ data: null, error: null }),
    maybeSingle: async () => ({ data: null, error: null }),
    insert: () => builder,
    update: () => builder,
    delete: () => builder,
    then: (resolve) => Promise.resolve({ data: null, error: null }).then(resolve)
  };

  return builder;
};

// Keep app mount stable when env vars are missing in deployed environments.
const createMockClient = () => ({
  auth: {
    getUser: async () => ({ data: { user: null }, error: null }),
    getSession: async () => ({ data: { session: null }, error: null }),
    onAuthStateChange: (callback) => {
      if (typeof callback === 'function') {
        queueMicrotask(() => callback('SIGNED_OUT', null));
      }

      return {
        data: {
          subscription: {
            unsubscribe: () => {}
          }
        }
      };
    },
    signInWithPassword: async () => ({ data: null, error: createMockError() }),
    signUp: async () => ({ data: null, error: createMockError() }),
    signOut: async () => ({ error: null })
  },
  from: () => createMockQueryBuilder()
});

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createMockClient();

export { isSupabaseConfigured };
