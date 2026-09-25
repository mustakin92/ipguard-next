import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function Sidebar({ currentPath }: { currentPath: string }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*, roles(nama_role)')
    .eq('id', user?.id)
    .single()

  const roleName = (profile as any)?.roles?.nama_role
  const roleId = profile?.role_id

  // Ambil menu: superadmin bypass
  let menus: any[] = []
  if (roleName === 'superadmin') {
    const { data } = await supabase.from('menu').select('*').eq('is_active', true).order('urutan')
    menus = data || []
  } else {
    const { data } = await supabase
      .from('role_menu')
      .select('menu:menu_id(*)')
      .eq('role_id', roleId)
    menus = (data || []).map((r: any) => r.menu).filter((m: any) => m?.is_active).sort((a: any, b: any) => a.urutan - b.urutan)
  }

  // Group by kategori
  const grouped: Record<string, any[]> = {}
  menus.forEach((m: any) => {
    if (!grouped[m.kategori]) grouped[m.kategori] = []
    grouped[m.kategori].push(m)
  })

  return (
    <aside className="w-64 text-gray-300 flex flex-col sidebar-bg overflow-y-auto shrink-0">
      <div className="p-5 flex items-center gap-2 border-b border-gray-700">
        <div className="bg-blue-600 text-white font-bold p-1 rounded">IP</div>
        <div>
          <h1 className="text-white font-bold tracking-wide">
            IP GUARD <span className="bg-yellow-500 text-black text-[10px] px-1 rounded ml-1">V3</span>
          </h1>
          <p className="text-[10px] text-gray-400">PLN IP UBP Cilegon</p>
        </div>
      </div>

      <nav className="mt-4 px-2 space-y-1 flex-1">
        {Object.entries(grouped).map(([kategori, items]) => (
          <div key={kategori}>
            <div className="pt-4 pb-2 px-3 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
              {kategori}
            </div>
            {items.map((m) => {
              const active = currentPath === m.url || (m.url !== '/' && currentPath.startsWith(m.url))
              return (
                <Link key={m.id} href={m.url}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md transition ${active ? 'bg-[#164e63] text-white' : 'hover:bg-gray-800'}`}>
                  <span>{m.icon}</span> {m.nama_menu}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>
    </aside>
  )
}