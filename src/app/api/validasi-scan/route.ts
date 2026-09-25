import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

function hitungJarak(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371000
  const toRad = (d: number) => (d * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export async function POST(req: Request) {
  const { kode_qr, lat, lng } = await req.json()
  const supabase = await createClient()

  if (!kode_qr || !lat || !lng) {
    return NextResponse.json({ status: 'error', message: 'Data tidak lengkap' })
  }

  const { data: titik } = await supabase
    .from('master_titik').select('*').eq('kode_qr', kode_qr).single()

  if (!titik) {
    return NextResponse.json({ status: 'error', message: 'QR Code tidak dikenali!' })
  }

  const jarak = hitungJarak(lat, lng, Number(titik.latitude), Number(titik.longitude))

  if (jarak > titik.radius_meter) {
    return NextResponse.json({
      status: 'warning',
      message: 'Anda di luar radius titik!',
      nama_titik: titik.nama_titik,
      jarak: `${Math.round(jarak)} meter`,
      radius: `${titik.radius_meter} meter`,
    })
  }

  const { data: putaran } = await supabase
    .from('patroli').select('*').lt('jumlah_discan', 20).order('id', { ascending: false }).limit(1).maybeSingle()

  if (!putaran) {
    return NextResponse.json({ status: 'warning', message: 'Tidak ada putaran aktif', nama_titik: titik.nama_titik })
  }

  const nomorTitik = parseInt(kode_qr.replace(/\D/g, ''))
  const now = new Date()
  const waktu = now.toTimeString().split(' ')[0]

  const { data: existing } = await supabase
    .from('patroli_checkpoint')
    .select('*')
    .eq('patroli_id', putaran.id)
    .eq('nomor_titik', nomorTitik)
    .maybeSingle()

  if (existing?.status === 'valid') {
    return NextResponse.json({
      status: 'warning',
      message: `Titik ${nomorTitik} sudah discan`,
      nama_titik: titik.nama_titik,
      jarak: `${Math.round(jarak)} meter`,
    })
  }

  if (existing) {
    await supabase.from('patroli_checkpoint').update({
      status: 'valid', waktu_scan: waktu, scanned_at: now.toISOString(),
      scan_latitude: lat, scan_longitude: lng, jarak_meter: jarak,
    }).eq('id', existing.id)
  } else {
    await supabase.from('patroli_checkpoint').insert({
      patroli_id: putaran.id, nomor_titik: nomorTitik, status: 'valid',
      waktu_scan: waktu, scanned_at: now.toISOString(),
      scan_latitude: lat, scan_longitude: lng, jarak_meter: jarak,
    })
  }

  const { count } = await supabase.from('patroli_checkpoint')
    .select('*', { count: 'exact', head: true })
    .eq('patroli_id', putaran.id).eq('status', 'valid')

  const totalValid = count ?? 0
  const persentase = (totalValid / 20) * 100

  await supabase.from('patroli').update({
    jumlah_discan: totalValid,
    persentase,
    status: totalValid >= 20 ? 'Lengkap' : 'Terlewat / Tidak Lengkap',
  }).eq('id', putaran.id)

  return NextResponse.json({
    status: 'valid',
    message: 'Scan berhasil & tervalidasi!',
    nama_titik: titik.nama_titik,
    lokasi: titik.lokasi,
    jarak: `${Math.round(jarak)} meter`,
    radius: `${titik.radius_meter} meter`,
    waktu,
  })
}