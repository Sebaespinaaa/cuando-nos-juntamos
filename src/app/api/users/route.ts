import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { hashPassword } from '@/lib/auth'

export async function GET() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('users')
    .select('id, username, display_name, avatar, avatar_color, role, created_at')
    .order('created_at')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ users: data })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password, display_name, avatar, avatar_color, role } = body

    if (!username || !password || !display_name) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
    }

    if (!/^\d{4}$/.test(String(password))) {
      return NextResponse.json({ error: 'La contraseña debe ser de 4 dígitos' }, { status: 400 })
    }

    const password_hash = await hashPassword(String(password))
    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from('users')
      .insert({
        username: username.toLowerCase().trim(),
        password_hash,
        display_name,
        avatar: avatar || '😊',
        avatar_color: avatar_color || '#6366f1',
        role: role || 'user',
      })
      .select('id, username, display_name, avatar, avatar_color, role, created_at')
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ user: data })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
