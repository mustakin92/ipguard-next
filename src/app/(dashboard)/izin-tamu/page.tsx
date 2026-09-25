import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

async function updateStatus(id: number, aksi: string) {
  'use server'
  const supabase = await createClient()
  const today = new Date().toISOString()
  const now = new Date().toTimeString().split(' ')[0]

  const updates: any = {}
  if (aksi === 'approve') updates.status = 'Disetujui'
  else if (aksi === 'reject') updates.status = 'Ditolak'
  else if (aksi === 'checkin') { updates.status = 'Sedang di Area'; updates.jam_masuk = now }
  else if (aksi === 'checkout') { updates.status = 'Selesai'; updates.jam_keluar = now }

  await supabase.from('izin_tamu').update(updates).eq('id', id)
  revalidatePath('/izin-tamu')
}

export default async function IzinTamuPage() {
  const supabase = await createClient()
  const today = new Date().toISOString().split('T')[0]

  const { data: izinList } = await supabase
    .from('izin_tamu')
    .select('*')
    .order('created_at', { ascending: false })

  const { count: tamuHariIni } = await supabase.from('izin_tamu')
    .select('*', { count: 'exact', head: true }).eq('tanggal_kunjungan', today)
  const { count: menunggu } = await supabase.from('izin_tamu')
    .select('*', { count: 'exact', head: true }).eq('status', 'Menunggu Approval')
  const { count: diArea } = await supabase.from('izin_tamu')
    .select('*', { count: 'exact', head: true }).eq('status', 'Sedang di Area')
  const { count: selesai } = await supabase.from('izin_tamu')
    .select('*', { count: 'exact', head: true }).eq('status', 'Selesai').eq('tanggal_kunjungan', today)

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Izin Tamu Masuk</h2>
          <p className="text-gray-500 text-sm mt-1">Email notifikasi otomatis ke Admin saat diajukan → Approval TL Keamanan → Check-in/out oleh Satpam</p>
        </div>
        <Link href="/izin-tamu/create"
          className="bg-[#0e7490] hover:bg-[#155e75] text-white px-4 py-2 rounded-md font-semibold text-sm">
          + Ajukan Izin Tamu
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Tamu Hari Ini', value: tamuHariIni ?? 0, icon: '👤', color: 'cyan' },
          { label: 'Menunggu Approval', value: menunggu ?? 0, icon: '⏳', color: 'yellow' },
          { label: 'Sedang di Area', value: diArea ?? 0, icon: '🚪', color: 'blue' },
          { label: 'Selesai Hari Ini', value: selesai ?? 0, icon: '✓', color: 'green' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl bg-${s.color}-100 text-${s.color}-600`}>
              {s.icon}
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{s.value}</div>
              <div className="text-[10px] font-bold text-gray-500 uppercase">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {izinList && izinList.length > 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 text-xs uppercase">
                  <th className="py-3 px-3">Nomor</th>
                  <th className="py-3 px-3">Nama Tamu</th>
                  <th className="py-3 px-3">Tujuan</th>
                  <th className="py-3 px-3">Kunjungan</th>
                  <th className="py-3 px-3">Jam (In/Out)</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 text-sm">
                {izinList.map((row) => (
                  <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-3 font-mono text-xs">{row.nomor_izin}</td>
                    <td className="py-3 px-3">
                      <div className="font-semibold">{row.nama_tamu}</div>
                      <div className="text-xs text-gray-500">{row.no_hp} · {row.jumlah_orang} orang</div>
                    </td>
                    <td className="py-3 px-3 text-xs max-w-xs truncate">{row.tujuan_kunjungan}</td>
                    <td className="py-3 px-3 text-xs">{row.tanggal_kunjungan}</td>
                    <td className="py-3 px-3 text-xs">
                      <div>🟢 {row.jam_masuk || '-'}</div>
                      <div>🔴 {row.jam_keluar || '-'}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        row.status === 'Menunggu Approval' ? 'bg-yellow-100 text-yellow-700' :
                        row.status === 'Disetujui' ? 'bg-cyan-100 text-cyan-700' :
                        row.status === 'Sedang di Area' ? 'bg-blue-100 text-blue-700' :
                        row.status === 'Selesai' ? 'bg-green-100 text-green-700' :
                        'bg-red-100 text-red-700'
                      }`}>{row.status}</span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <div className="flex justify-center gap-1 flex-wrap">
                        {row.status === 'Menunggu Approval' && (
                          <>
                            <form action={updateStatus.bind(null, row.id, 'approve')}>
                              <button className="text-green-600 bg-green-50 px-2 py-1 rounded text-xs" title="Approve">✓ Setuju</button>
                            </form>
                            <form action={updateStatus.bind(null, row.id, 'reject')}>
                              <button className="text-red-600 bg-red-50 px-2 py-1 rounded text-xs" title="Reject">✕ Tolak</button>
                            </form>
                          </>
                        )}
                        {row.status === 'Disetujui' && (
                          <form action={updateStatus.bind(null, row.id, 'checkin')}>
                            <button className="text-blue-600 bg-blue-50 px-2 py-1 rounded text-xs">🚪 IN</button>
                          </form>
                        )}
                        {row.status === 'Sedang di Area' && (
                          <form action={updateStatus.bind(null, row.id, 'checkout')}>
                            <button className="text-orange-600 bg-orange-50 px-2 py-1 rounded text-xs">🏁 OUT</button>
                          </form>
                        )}
                        <Link href={`/izin-tamu/${row.id}/edit`}
                          className="text-cyan-600 bg-cyan-50 px-2 py-1 rounded text-xs">✏️</Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-16 text-center">
          <div className="text-6xl mb-4">🚗</div>
          <div className="text-gray-500 text-lg">Belum ada data.</div>
        </div>
      )}
    </div>
  )
}