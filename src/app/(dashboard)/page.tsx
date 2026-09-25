import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = await createClient()
  const today = new Date().toISOString().split('T')[0]

  const [tamuHariIni, menunggu, diArea, selesai] = await Promise.all([
    supabase.from('izin_tamu').select('*', { count: 'exact', head: true }).eq('tanggal_kunjungan', today),
    supabase.from('izin_tamu').select('*', { count: 'exact', head: true }).eq('status', 'Menunggu Approval'),
    supabase.from('izin_tamu').select('*', { count: 'exact', head: true }).eq('status', 'Sedang di Area'),
    supabase.from('izin_tamu').select('*', { count: 'exact', head: true }).eq('status', 'Selesai').eq('tanggal_kunjungan', today),
  ])

  const stats = [
    { title: 'INCIDENT BULAN INI', value: '0', icon: '⚠️', color: 'red' },
    { title: 'TAMU HARI INI', value: tamuHariIni.count ?? 0, icon: '👤', color: 'yellow' },
    { title: 'MENUNGGU APPROVAL', value: menunggu.count ?? 0, icon: '⏳', color: 'blue' },
    { title: 'STATUS KEAMANAN', value: 'Aman', icon: '🛡️', color: 'green' },
  ]

  const posts = [
    { name: 'Pos I', status: '3/4 checkpoint', active: 3, total: 4 },
    { name: 'Pos II', status: '0/4 checkpoint', active: 0, total: 4 },
    { name: 'Pos III', status: '0/4 checkpoint', active: 0, total: 4 },
    { name: 'Pos IV', status: '0/4 checkpoint', active: 0, total: 4 },
    { name: 'Pos V', status: '0/4 checkpoint', active: 0, total: 4 },
    { name: 'Pos Utama', status: '0/4 checkpoint', active: 0, total: 4 },
  ]

  const patrols = [
    { time: 'PUTARAN 1 • 06.00-07.00', percent: '15%', desc: '3/20 titik discan', width: '15%' },
    { time: 'PUTARAN 2 • 08.00-09.00', percent: '10%', desc: '2/20 titik discan', width: '10%' },
  ]

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard Operasional Pengamanan</h2>
        <p className="text-gray-500 text-sm mt-1">PT PLN Indonesia Power UBP Cilegon — Real-time Monitoring</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${
              stat.color === 'red' ? 'bg-red-100 text-red-600' :
              stat.color === 'yellow' ? 'bg-yellow-100 text-yellow-600' :
              stat.color === 'blue' ? 'bg-cyan-100 text-cyan-600' :
              'bg-green-100 text-green-600'
            }`}>{stat.icon}</div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
              <div className="text-[10px] font-bold text-gray-500 uppercase">{stat.title}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
        <h3 className="font-bold text-gray-800 mb-4">📍 Status Pengisian Jurnal Pos Hari Ini</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {posts.map((p, i) => (
            <div key={i} className="border rounded-lg p-3 text-center">
              <div className={`text-xl mb-1 ${p.active > 0 ? 'text-yellow-500' : 'text-red-500'}`}>
                {p.active > 0 ? '⚠️' : '❌'}
              </div>
              <div className="font-bold text-gray-800 text-sm">{p.name}</div>
              <div className="text-[10px] text-gray-500 mb-2">{p.status}</div>
              <div className="flex gap-1 justify-center">
                {Array.from({ length: p.total }).map((_, j) => (
                  <div key={j} className={`w-2 h-2 rounded-full ${j < p.active ? 'bg-green-500' : 'bg-gray-300'}`} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-5">
        <h3 className="font-bold text-gray-800 mb-4">🛡️ Kepatuhan Patroli Hari Ini</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {patrols.map((p, i) => (
            <div key={i} className="border rounded-lg p-4">
              <div className="text-[10px] font-bold text-gray-500 uppercase mb-2">{p.time}</div>
              <div className="text-2xl font-bold text-gray-800 mb-2">{p.percent}</div>
              <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
                <div className="bg-yellow-400 h-1.5 rounded-full" style={{ width: p.width }} />
              </div>
              <div className="text-[10px] text-gray-500">{p.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}