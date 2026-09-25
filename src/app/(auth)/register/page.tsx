'use client'
import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function RegisterPage() {
  const [form, setForm] = useState({ nama: '', username: '', email: '', password: '', konfirmasi: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (form.password.length < 6) return setError('Password minimal 6 karakter')
    if (form.password !== form.konfirmasi) return setError('Konfirmasi password tidak cocok')

    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { nama: form.nama, username: form.username.toLowerCase() }
      }
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess(true)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'linear-gradient(135deg, #0f2936 0%, #0e7490 100%)' }}>
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Daftar Akun Baru</h2>
        <p className="text-gray-500 text-sm mb-6">Isi data diri Anda untuk mendaftar</p>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">⚠️ {error}</div>}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm">
            ✅ Registrasi berhasil! Akun menunggu persetujuan admin.
            <div className="mt-2"><Link href="/login" className="font-semibold underline">Kembali ke Login</Link></div>
          </div>
        )}

        {!success && (
          <form onSubmit={handleRegister} className="space-y-4">
            <input required placeholder="Nama Lengkap" value={form.nama}
              onChange={e => setForm({ ...form, nama: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-cyan-500" />
            <input required placeholder="Username" value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-cyan-500" />
            <input required type="email" placeholder="Email" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-cyan-500" />
            <input required type="password" placeholder="Password (min 6)" value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-cyan-500" />
            <input required type="password" placeholder="Konfirmasi Password" value={form.konfirmasi}
              onChange={e => setForm({ ...form, konfirmasi: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-cyan-500" />
            <button type="submit" disabled={loading}
              className="w-full bg-[#0e7490] hover:bg-[#155e75] disabled:opacity-50 text-white font-semibold py-3 rounded-lg">
              {loading ? 'Memproses...' : '📝 Daftar Sekarang'}
            </button>
          </form>
        )}

        <div className="text-center mt-6 text-sm text-gray-600">
          Sudah punya akun? <Link href="/login" className="text-cyan-600 hover:text-cyan-800 font-semibold">Masuk di sini</Link>
        </div>
      </div>
    </div>
  )
}