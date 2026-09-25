'use client'
import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(''); setMsg('')
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) setError(error.message)
    else setMsg('Link reset password telah dikirim ke email Anda.')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'linear-gradient(135deg, #0f2936 0%, #0e7490 100%)' }}>
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-6">
          <div className="text-5xl mb-2">🔑</div>
          <h2 className="text-2xl font-bold text-gray-800">Lupa Password?</h2>
          <p className="text-gray-500 text-sm">Masukkan email untuk reset</p>
        </div>
        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">⚠️ {error}</div>}
        {msg && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm">✅ {msg}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input required type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="email@example.com"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-cyan-500" />
          <button type="submit" className="w-full bg-[#0e7490] hover:bg-[#155e75] text-white font-semibold py-3 rounded-lg">
            📩 Kirim Link Reset
          </button>
        </form>
        <div className="text-center mt-6 text-sm">
          <Link href="/login" className="text-cyan-600 hover:text-cyan-800 font-semibold">← Kembali ke Login</Link>
        </div>
      </div>
    </div>
  )
}