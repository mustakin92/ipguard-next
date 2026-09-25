'use client'
import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function ScanPage() {
  const [gps, setGps] = useState<{ lat: number; lng: number; accuracy: number } | null>(null)
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const scannerRef = useRef<any>(null)

  useEffect(() => {
    if (!navigator.geolocation) {
      alert('GPS tidak didukung')
      return
    }
    navigator.geolocation.watchPosition(
      (pos) => setGps({ lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy }),
      (err) => alert('GPS Error: ' + err.message),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    )
  }, [])

  useEffect(() => {
    if (!gps) return // tunggu GPS siap
    let scanner: any

    async function init() {
      const { Html5Qrcode } = await import('html5-qrcode')
      scanner = new Html5Qrcode('reader')
      scannerRef.current = scanner

      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: 250 },
        async (decodedText: string) => {
          if (loading) return
          setLoading(true)
          try {
            const res = await fetch('/api/validasi-scan', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ kode_qr: decodedText, lat: gps!.lat, lng: gps!.lng })
            })
            const data = await res.json()
            setResult({ ...data, kode_qr: decodedText })
          } catch (err: any) {
            setResult({ status: 'error', message: err.message })
          }
          setLoading(false)
        },
        () => {}
      )
    }
    init()
    return () => { scanner?.stop?.().catch(() => {}) }
  }, [gps])

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-[#0e7490] text-white px-4 py-3 flex justify-between items-center">
        <div>
          <h1 className="font-bold text-lg">📷 Scan Titik Patroli</h1>
          <p className="text-xs text-cyan-100">
            {gps ? `GPS: ${gps.lat.toFixed(6)}, ${gps.lng.toFixed(6)} (±${Math.round(gps.accuracy)}m)` : 'Mendeteksi GPS...'}
          </p>
        </div>
        <a href="/patroli" className="bg-white/20 px-3 py-1.5 rounded-md text-sm">✕ Tutup</a>
      </div>

      <div className="p-4">
        <div id="reader" className="bg-black rounded-xl overflow-hidden"></div>
      </div>

      {result && (
        <div className="p-4">
          <div className={`border-2 rounded-lg p-4 ${
            result.status === 'valid' ? 'bg-green-50 border-green-300 text-green-700' :
            result.status === 'warning' ? 'bg-yellow-50 border-yellow-300 text-yellow-700' :
            'bg-red-50 border-red-300 text-red-700'
          }`}>
            <div className="text-center font-bold text-lg mb-2">{result.message}</div>
            <div className="text-sm space-y-1 bg-white/70 rounded p-3">
              <div className="flex justify-between"><span>Kode QR</span><b>{result.kode_qr}</b></div>
              <div className="flex justify-between"><span>Nama Titik</span><b>{result.nama_titik || '-'}</b></div>
              <div className="flex justify-between"><span>Jarak</span><b>{result.jarak || '-'}</b></div>
            </div>
            <button onClick={() => setResult(null)}
              className="w-full mt-3 bg-[#0e7490] text-white px-6 py-2 rounded-md font-semibold">
              Scan Lagi
            </button>
          </div>
        </div>
      )}
    </div>
  )
}