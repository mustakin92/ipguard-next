import { createClient } from '@/lib/supabase/server'

export default async function MasterTitikPage() {
  const supabase = await createClient()
  const { data: titik } = await supabase.from('master_titik').select('*').order('id')

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Master Titik Patroli</h2>
        <p className="text-gray-500 text-sm mt-1">Kelola titik, koordinat GPS, dan radius validasi</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-5">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b text-gray-500 text-xs uppercase">
              <th className="py-3 px-3">Kode QR</th>
              <th className="py-3 px-3">Nama Titik</th>
              <th className="py-3 px-3">Lokasi</th>
              <th className="py-3 px-3">Latitude</th>
              <th className="py-3 px-3">Longitude</th>
              <th className="py-3 px-3">Radius</th>
            </tr>
          </thead>
          <tbody>
            {titik?.map((t) => (
              <tr key={t.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-3 font-mono font-bold text-cyan-700">{t.kode_qr}</td>
                <td className="py-3 px-3">{t.nama_titik}</td>
                <td className="py-3 px-3">{t.lokasi}</td>
                <td className="py-3 px-3 font-mono text-xs">{t.latitude}</td>
                <td className="py-3 px-3 font-mono text-xs">{t.longitude}</td>
                <td className="py-3 px-3">{t.radius_meter} m</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}