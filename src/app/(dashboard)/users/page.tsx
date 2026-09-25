import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ msg?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()
  const { data: users } = await supabase
    .from('profiles')
    .select('*, roles(nama_role)')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">👥 Kelola User</h2>
          <p className="text-gray-500 text-sm mt-1">Kelola akun pengguna, role, dan status aktif</p>
        </div>
        <Link
          href="/users/create"
          className="bg-[#0e7490] hover:bg-[#155e75] text-white px-4 py-2 rounded-md font-semibold text-sm"
        >
          + Tambah User
        </Link>
      </div>

      {params.msg === 'created' && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm">
          ✅ User berhasil ditambahkan dan sudah bisa login.
        </div>
      )}
      {params.msg === 'deleted' && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm">
          ✅ User berhasil dihapus.
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm p-5">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b text-gray-500 text-xs uppercase">
                <th className="py-3 px-3">Nama</th>
                <th className="py-3 px-3">Username</th>
                <th className="py-3 px-3">Email</th>
                <th className="py-3 px-3">Role</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Last Login</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((u: any) => (
                <tr key={u.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-3 font-medium">{u.nama}</td>
                  <td className="py-3 px-3 font-mono text-xs">{u.username}</td>
                  <td className="py-3 px-3">{u.email}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        u.roles?.nama_role === 'superadmin'
                          ? 'bg-purple-100 text-purple-700'
                          : u.roles?.nama_role === 'admin'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-cyan-100 text-cyan-700'
                      }`}
                    >
                      {u.roles?.nama_role || '-'}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        u.status === 'aktif' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-xs text-gray-500">
                    {u.last_login ? new Date(u.last_login).toLocaleString('id-ID') : 'Belum pernah'}
                  </td>
                </tr>
              ))}
              {(!users || users.length === 0) && (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-gray-500">
                    Belum ada user. Klik "+ Tambah User" untuk membuat.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}