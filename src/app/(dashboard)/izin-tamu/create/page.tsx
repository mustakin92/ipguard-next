import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

async function createIzin(formData: FormData) {
  'use server'
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const today = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  const { count } = await supabase.from('izin_tamu').select('*', { count: 'exact', head: true })
  const nomor = `TMU/${today}/${String((count ?? 0) + 1).padStart(4, '0')}`

  const { error } = await supabase.from('izin_tamu').insert({
    nomor_izin: nomor,
    nama_tamu: formData.get('nama_tamu') as string,
    no_identitas: formData.get('no_identitas') as string,
    jenis_identitas: formData.get('jenis_identitas') as string,
    instansi: formData.get('instansi') as string || null,
    no_hp: formData.get('no_hp') as string || null,
    email: formData.get('email') as string || null,
    jumlah_orang: Number(formData.get('jumlah_orang') || 1),
    tujuan_kunjungan: formData.get('tujuan_kunjungan') as string,
    nama_penerima: formData.get('nama_penerima') as string,
    departemen: formData.get('departemen') as string || null,
    tanggal_kunjungan: formData.get('tanggal_kunjungan') as string,
    jenis_kendaraan: formData.get('jenis_kendaraan') as string || null,
    no_kendaraan: formData.get('no_kendaraan') as string || null,
    catatan: formData.get('catatan') as string || null,
    status: 'Menunggu Approval',
    created_by: user?.id,
  })

  if (error) throw new Error(error.message)
  redirect('/izin-tamu')
}

export default function CreateIzinTamu() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Ajukan Izin Tamu</h2>
        <p className="text-gray-500 text-sm mt-1">Isi formulir untuk mengajukan izin kunjungan tamu.</p>
      </div>

      <form action={createIzin} className="bg-white rounded-xl shadow-sm p-6 max-w-4xl space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Lengkap Tamu *</label>
            <input name="nama_tamu" required className="w-full border rounded-md px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Instansi</label>
            <input name="instansi" className="w-full border rounded-md px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Jenis Identitas</label>
            <select name="jenis_identitas" className="w-full border rounded-md px-3 py-2 text-sm">
              <option>KTP</option><option>SIM</option><option>Paspor</option><option>Lainnya</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">No. Identitas *</label>
            <input name="no_identitas" required className="w-full border rounded-md px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">No. HP</label>
            <input name="no_hp" className="w-full border rounded-md px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
            <input type="email" name="email" className="w-full border rounded-md px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Jumlah Orang *</label>
            <input type="number" name="jumlah_orang" defaultValue="1" min="1" required className="w-full border rounded-md px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Tanggal Kunjungan *</label>
            <input type="date" name="tanggal_kunjungan" defaultValue={new Date().toISOString().split('T')[0]} required className="w-full border rounded-md px-3 py-2 text-sm" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Tujuan / Keperluan *</label>
            <textarea name="tujuan_kunjungan" required rows={3} className="w-full border rounded-md px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Penerima *</label>
            <input name="nama_penerima" required className="w-full border rounded-md px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Departemen</label>
            <input name="departemen" className="w-full border rounded-md px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Jenis Kendaraan</label>
            <select name="jenis_kendaraan" className="w-full border rounded-md px-3 py-2 text-sm">
              <option value="">-- Tidak ada --</option>
              <option>Motor</option><option>Mobil</option><option>Truk</option><option>Bus</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">No. Kendaraan</label>
            <input name="no_kendaraan" placeholder="N 1234 ABC" className="w-full border rounded-md px-3 py-2 text-sm" />
          </div>
        </div>
        <div className="pt-4 flex gap-3 border-t">
          <button type="submit" className="bg-[#0e7490] hover:bg-[#155e75] text-white px-6 py-2 rounded-md font-semibold">📩 Ajukan Izin</button>
          <Link href="/izin-tamu" className="bg-gray-200 hover:bg-gray-300 px-6 py-2 rounded-md font-semibold">Batal</Link>
        </div>
      </form>
    </div>
  )
}