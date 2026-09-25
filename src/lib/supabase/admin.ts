import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// Admin client menggunakan SERVICE_ROLE_KEY — BYPASS RLS
// ⚠️ HANYA untuk Server Actions & API Routes — JANGAN dipakai di Client Components!
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}