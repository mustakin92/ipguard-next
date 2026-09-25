import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function PatroliPage() {
  const supabase = await createClient()
  const { data: putaranList } = await supabase.from('patroli').select('*').order('id')
  const { data: checkpoints } = await supabase.from('patroli_checkpoint').select('*')

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Patroli QR & GPS</h2>
          <p className="text-gray-500 text-sm mt-1">Log titik tiap checkpoint</p>
        </div>
        <div className="flex gap-2">
          <Link href="/scan" className="bg-white border border-cyan-600 text-cyan-700 px-4 py-2 rounded-md font-semibold text-sm">
            📍 Scan Titik
          </Link>
          <Link href="/master-titik" className="bg-white border border-gray-400 px-4 py-2 rounded-md font-semibold text-sm">
            ⚙️ Master Titik
          </Link>
        </div>
      </div>

      {putaranList?.map((p) => {
        const cps = checkpoints?.filter(c => c.patroli_id === p.id).sort((a, b) => a.nomor_titik - b.nomor_titik) || []
        return (
          <div key={p.id} className="bg-white rounded-xl shadow-sm p-5 mb-4">
            <div className="flex justify-between mb-3">
              <div>
                <div className="font-bold text-cyan-700">
                  {p.putaran} <span className="text-gray-800">{p.jam_mulai} - {p.jam_selesai}</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">Petugas: {p.petugas}</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{Math.round(p.persentase)}%</div>
                <div className="text-xs text-gray-500">{p.jumlah_discan}/{p.total_titik} discan</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {cps.map((cp) => {
                let color = 'bg-gray-200 text-gray-600'
                let label: any = cp.nomor_titik
                if (cp.status === 'valid') { color = 'bg-green-100 text-green-700'; label = '✓' }
                else if (cp.status === 'berlangsung') color = 'bg-cyan-600 text-white'
                else if (cp.status === 'anomali') color = 'bg-red-100 text-red-600'
                return (
                  <div key={cp.id} className={`w-9 h-9 rounded-md ${color} flex items-center justify-center font-bold text-sm border`}>
                    {label}
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}

      {(!putaranList || putaranList.length === 0) && (
        <div className="bg-white rounded-xl p-12 text-center text-gray-500">
          Belum ada data patroli.
        </div>
      )}
    </div>
  )
}