import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: {
        // ⚠️ Secure HANYA di production (HTTPS).
        // Di development (HTTP LAN) harus false, kalau tidak cookie ditolak.
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        // Jangan set domain agar otomatis ikut host
      },
    }
  )
}