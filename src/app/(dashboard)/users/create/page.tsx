'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function CreateUserPage() {
  const [form, setForm] = useState({
    nama: '',
    username: '',
    email: '',
    password: '',
    role_id: '',
    status: 'aktif',
  })
  const [roles, setRoles] = useState<any[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Ambil daftar roles dari Supabase
  useEffect(() => {
    async function fetchRoles() {
      const supabase = createClient()
      const { data } = await supabase.from('roles').select('*').order('id')
      if (data) {
        setRoles(data)
        if (data.length > 0) setForm(f => ({ ...f, role_id: String(data[0].id) }))
      }
    }
    fetchRoles()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/admin/create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Gagal menambahkan user')
        setLoading(false)
        return
      }

      router.push('/users?msg=created')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan')
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">👥 Tambah User Baru</h2>
        <p className="text-gray-500 text-sm mt-1">
          User akan langsung dibuat di Supabase Auth dan bisa login setelah disimpan.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 max-w-2xl">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-1 text-sm">Nama Lengkap *</label>
              <input
                type="text"
                required
                value={form.nama}
                onChange={e => setForm({ ...form, nama: e.target.value })}
                className="w-full border rounded-md px-3 py-2 focus:ring-1 focus:ring-cyan-600"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1 text-sm">Username *</label>
              <input
                type="text"
                required
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value.toLowerCase() })}
                className="w-full border rounded-md px-3 py-2 focus:ring-1 focus:ring-cyan-600"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1 text-sm">Email *</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value.toLowerCase() })}
                className="w-full border rounded-md px-3 py-2 focus:ring-1 focus:ring-cyan-600"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1 text-sm">Password *</label>
              <input
                type="password"
                required
                minLength={6}
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className="w-full border rounded-md px-3 py-2 focus:ring-1 focus:ring-cyan-600"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1 text-sm">Role *</label>
              <select
                required
                value={form.role_id}
                onChange={e => setForm({ ...form, role_id: e.target.value })}
                className="w-full border rounded-md px-3 py-2 focus:ring-1 focus:ring-cyan-600"
              >
                {roles.length === 0 && <option value="">Loading roles...</option>}
                {roles.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.nama_role} — {r.deskripsi}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1 text-sm">Status</label>
              <select
                value={form.status}
                onChange={e => setForm({ ...form, status: e.target.value })}
                className="w-full border rounded-md px-3 py-2 focus:ring-1 focus:ring-cyan-600"
              >
                <option value="aktif">Aktif</option>
                <option value="nonaktif">Nonaktif</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex gap-3 border-t">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#0e7490] hover:bg-[#155e75] disabled:opacity-50 text-white px-6 py-2 rounded-md font-semibold"
            >
              {loading ? 'Menyimpan...' : '💾 Simpan User'}
            </button>
            <Link href="/users" className="bg-gray-200 hover:bg-gray-300 px-6 py-2 rounded-md font-semibold">
              Batal
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}