import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(req: Request) {
  try {
    // 1. Verify user yang request adalah admin/superadmin
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role_id, roles(nama_role)')
      .eq('id', user.id)
      .single()

    const roleName = (profile as any)?.roles?.nama_role
    if (roleName !== 'superadmin' && roleName !== 'admin') {
      return NextResponse.json({ error: 'Hanya admin yang bisa tambah user' }, { status: 403 })
    }

    // 2. Ambil data dari form
    const body = await req.json()
    const { nama, username, email, password, role_id, status } = body

    if (!nama || !username || !email || !password || !role_id) {
      return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 })
    }

    // 3. Buat user di Supabase Auth (pakai admin client)
    const adminClient = createAdminClient()
    const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // auto-confirm
      user_metadata: {
        nama,
        username: username.toLowerCase(),
      },
    })

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    // 4. Update profile (karena trigger hanya isi default, kita override dengan data lengkap)
    const { error: profileError } = await adminClient
      .from('profiles')
      .update({
        nama,
        username: username.toLowerCase(),
        email,
        role_id: Number(role_id),
        status: status || 'aktif',
      })
      .eq('id', authData.user.id)

    if (profileError) {
      // Rollback: hapus user auth kalau profile gagal
      await adminClient.auth.admin.deleteUser(authData.user.id)
      return NextResponse.json({ error: profileError.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      user: { id: authData.user.id, email: authData.user.email },
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}