'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'linear-gradient(135deg, #0f2936 0%, #0e7490 100%)' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-5 py-3 rounded-2xl border border-white/20">
            <div className="bg-blue-600 text-white font-bold px-3 py-2 rounded-lg">IP</div>
            <div className="text-left">
              <h1 className="text-white font-bold text-lg">IP GUARD</h1>
              <p className="text-cyan-200 text-xs">PLN IP UBP Cilegon</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">Masuk ke Sistem</h2>
          <p className="text-gray-500 text-sm mb-6">Silakan login untuk melanjutkan</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                required placeholder="email@example.com"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                required placeholder="••••••••"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
            </div>
            <div className="flex justify-end text-sm">
              <Link href="/forgot-password" className="text-cyan-600 hover:text-cyan-800 font-semibold">
                Lupa password?
              </Link>
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-[#0e7490] hover:bg-[#155e75] disabled:opacity-50 text-white font-semibold py-3 rounded-lg">
              {loading ? 'Memproses...' : '🔐 Masuk'}
            </button>
          </form>

          <div className="text-center mt-6 text-sm text-gray-600">
            Belum punya akun?{' '}
            <Link href="/register" className="text-cyan-600 hover:text-cyan-800 font-semibold">
              Daftar Sekarang
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}