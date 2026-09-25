'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [konfirmasi, setKonfirmasi] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (password.length < 6) return setError('Password minimal 6 karakter')
    if (password !== konfirmasi) return setError('Konfirmasi tidak cocok')

    const { error } = await supabase.auth.updateUser({ password })
    if (error) setError(error.message)
    else {
      alert('Password berhasil direset!')
      router.push('/login')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'linear-gradient(135deg, #0f2936 0%, #0e7490 100%)' }}>
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">🔒 Reset Password</h2>
        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">⚠️ {error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input required type="password" value={password} onChange={e => setPassword(e.target.value)}
            placeholder="Password Baru"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-cyan-500" />
          <input required type="password" value={konfirmasi} onChange={e => setKonfirmasi(e.target.value)}
            placeholder="Konfirmasi Password"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-cyan-500" />
          <button type="submit" className="w-full bg-[#0e7490] hover:bg-[#155e75] text-white font-semibold py-3 rounded-lg">
            💾 Simpan Password
          </button>
        </form>
      </div>
    </div>
  )
}