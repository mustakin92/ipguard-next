import { createClient } from '@/lib/supabase/server'

export default async function ChecklistPage() {
  const supabase = await createClient()
  const { data: items } = await supabase.from('checklist_sarpras').select('*').order('id')

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Checklist Sarana & Prasarana</h2>
        <p className="text-gray-500 text-sm mt-1">Item diambil otomatis dari Master Data</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-5">
        <h3 className="font-bold text-gray-800 mb-4">📦 Kondisi Sarpras Terkini</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b text-gray-500 text-xs uppercase">
                <th className="py-3 px-3">Nama Sarpras</th>
                <th className="py-3 px-3">Lokasi</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-center">Jml Baik</th>
                <th className="py-3 px-3 text-center">Jml Rusak</th>
                <th className="py-3 px-3">Terakhir Diperiksa</th>
                <th className="py-3 px-3">Keterangan</th>
              </tr>
            </thead>
            <tbody>
              {items?.map((row) => (
                <tr key={row.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-3 font-medium">{row.nama_sarpras}</td>
                  <td className="py-3 px-3">{row.lokasi}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      row.status === 'Baik' ? 'bg-green-100 text-green-700' :
                      row.status === 'Rusak' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>{row.status}</span>
                  </td>
                  <td className="py-3 px-3 text-center">{row.jml_baik}</td>
                  <td className="py-3 px-3 text-center">{row.jml_rusak}</td>
                  <td className="py-3 px-3 text-xs">{new Date(row.terakhir_diperiksa).toLocaleString('id-ID')}</td>
                  <td className="py-3 px-3 text-gray-500">{row.keterangan || '-'}</td>
                </tr>
              ))}
              {(!items || items.length === 0) && (
                <tr><td colSpan={7} className="text-center py-6 text-gray-500">Belum ada data checklist.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}