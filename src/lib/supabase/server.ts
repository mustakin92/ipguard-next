import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (list) => {
          try {
            list.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, {
                ...options,
                // ⚠️ KUNCI UTAMA: paksa secure=false di development
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                httpOnly: true,
              })
            })
          } catch {
            // Ignore: terjadi saat middleware set cookie
          }
        },
      },
    }
  )
}