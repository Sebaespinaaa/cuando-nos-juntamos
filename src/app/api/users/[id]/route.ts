import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { hashPassword } from '@/lib/auth'

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { password, ...rest } = body
    const updates: Record<string, unknown> = { ...rest }

    if (password) {
      if (!/^\d{4}$/.test(String(password))) {
        return NextResponse.json({ error: 'La contraseña debe ser de 4 dígitos' }, { status: 400 })
      }
      updates.password_hash = await hashPassword(String(password))
    }

    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', params.id)
      .select('id, username, display_name, avatar, avatar_color, role, created_at')
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ user: data })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('users').delete().eq('id', params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
