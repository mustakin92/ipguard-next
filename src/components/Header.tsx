import { createClient } from '@/lib/supabase/server'
import { logout } from '@/app/actions/auth'

export default async function Header() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase
    .from('profiles')
    .select('*, roles(nama_role)')
    .eq('id', user?.id)
    .single()

  const roleName = (profile as any)?.roles?.nama_role || 'user'
  const initial = (profile?.nama || 'U').charAt(0).toUpperCase()

  const now = new Date()
  const timeStr = `${String(now.getHours()).padStart(2, '0')}.${String(now.getMinutes()).padStart(2, '0')}.${String(now.getSeconds()).padStart(2, '0')}`

  return (
    <header className="header-bg text-white px-6 py-3 flex justify-between items-center shadow-md z-10 shrink-0">
      <div className="relative w-96">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-300">🔍</span>
        <input type="text" placeholder="Cari mutasi, SOP, regulasi..."
          className="w-full bg-[#155e75]/70 text-white placeholder-gray-200 text-sm rounded-md pl-10 pr-4 py-2 border border-[#0891b2]/50 focus:outline-none" />
      </div>

      <div className="flex items-center gap-5">
        <div className="font-semibold text-sm">{timeStr} WIB</div>
        <div className="flex items-center gap-3 border-l border-cyan-300/40 pl-4">
          <button className="text-xl">🔔</button>
          <div className="flex items-center gap-2">
            <div className="bg-yellow-400 text-yellow-900 w-8 h-8 rounded-full flex items-center justify-center font-bold">
              {initial}
            </div>
            <div className="text-xs leading-tight">
              <div className="font-bold">{profile?.nama}</div>
              <div className="text-cyan-100 capitalize">{roleName}</div>
            </div>
          </div>
          <form action={logout}>
            <button type="submit" className="text-xl ml-2 hover:text-red-300" title="Logout">🚪</button>
          </form>
        </div>
      </div>
    </header>
  )
}