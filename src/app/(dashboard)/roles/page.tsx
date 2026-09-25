import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

async function saveRoleMenu(formData: FormData) {
  'use server'
  const roleId = Number(formData.get('role_id'))
  const menuIds = formData.getAll('menu_ids').map(Number)
  const supabase = await createClient()

  await supabase.from('role_menu').delete().eq('role_id', roleId)
  if (menuIds.length > 0) {
    await supabase.from('role_menu').insert(menuIds.map(mid => ({ role_id: roleId, menu_id: mid })))
  }
  revalidatePath('/roles')
}

export default async function RolesPage({ searchParams }: { searchParams: Promise<{ edit?: string }> }) {
  const params = await searchParams
  const editId = params.edit ? Number(params.edit) : null

  const supabase = await createClient()
  const { data: roles } = await supabase.from('roles').select('*').order('id')
  const { data: menus } = await supabase.from('menu').select('*').eq('is_active', true).order('urutan')
  const { data: roleMenus } = editId
    ? await supabase.from('role_menu').select('menu_id').eq('role_id', editId)
    : { data: [] }

  const activeMenuIds = roleMenus?.map((r: any) => r.menu_id) || []
  const grouped: Record<string, any[]> = {}
  menus?.forEach((m: any) => {
    if (!grouped[m.kategori]) grouped[m.kategori] = []
    grouped[m.kategori].push(m)
  })

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">🔐 Kelola Role & Hak Akses</h2>
        <p className="text-gray-500 text-sm mt-1">Atur role pengguna dan menu yang dapat diakses</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-xl shadow-sm p-5">
            <h3 className="font-bold text-gray-800 mb-3">📋 Daftar Role</h3>
            <div className="space-y-2">
              {roles?.map((r) => (
                <a key={r.id} href={`/roles?edit=${r.id}`}
                  className={`block p-3 rounded-lg border-2 transition ${
                    editId === r.id ? 'bg-cyan-50 border-cyan-400' : 'bg-gray-50 border-transparent hover:bg-gray-100'
                  }`}>
                  <div className="font-bold text-sm">{r.nama_role}</div>
                  <div className="text-xs text-gray-500">{r.deskripsi}</div>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          {editId ? (
            <div className="bg-white rounded-xl shadow-sm p-5">
              <h3 className="font-bold text-gray-800 mb-4">
                🔑 Hak Akses: {roles?.find(r => r.id === editId)?.nama_role}
              </h3>
              <form action={saveRoleMenu}>
                <input type="hidden" name="role_id" value={editId} />
                {Object.entries(grouped).map(([kategori, items]) => (
                  <div key={kategori} className="mb-4">
                    <div className="text-xs font-bold text-gray-500 uppercase mb-2 border-b pb-1">{kategori}</div>
                    <div className="grid grid-cols-2 gap-2">
                      {items.map((m) => (
                        <label key={m.id} className="flex items-center gap-3 p-2.5 rounded-lg border hover:bg-gray-50 cursor-pointer">
                          <input type="checkbox" name="menu_ids" value={m.id}
                            defaultChecked={activeMenuIds.includes(m.id)}
                            className="w-4 h-4 rounded text-cyan-600" />
                          <span>{m.icon}</span>
                          <span className="text-sm">{m.nama_menu}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
                <button type="submit" className="bg-[#0e7490] hover:bg-[#155e75] text-white px-6 py-2 rounded-md font-semibold text-sm mt-4">
                  💾 Simpan Hak Akses
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <div className="text-5xl mb-3">⚙️</div>
              <h3 className="font-bold text-gray-700 mb-1">Pilih Role untuk Mengatur Hak Akses</h3>
              <p className="text-gray-500 text-sm">Klik role di sebelah kiri.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}