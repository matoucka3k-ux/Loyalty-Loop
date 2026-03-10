import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      detectSessionInUrl: false,
      storageKey: 'loyalty-loop-auth',
      storage: {
        getItem: (key) => {
          try { return window.sessionStorage.getItem(key) } catch { return null }
        },
        setItem: (key, value) => {
          try { window.sessionStorage.setItem(key, value) } catch {}
        },
        removeItem: (key) => {
          try { window.sessionStorage.removeItem(key) } catch {}
        },
      }
    }
  }
)
