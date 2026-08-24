import { NextRequest, NextResponse } from 'next/server'
import { loginUser } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
    }

    if (!/^\d{4}$/.test(String(password))) {
      return NextResponse.json({ error: 'La contraseña debe ser de 4 dígitos' }, { status: 400 })
    }

    const { user, error } = await loginUser(username, String(password))

    if (error || !user) {
      return NextResponse.json({ error }, { status: 401 })
    }

    // Never return the password hash
    const { password_hash, ...safeUser } = user
    void password_hash

    return NextResponse.json({ user: safeUser })
  } catch (e) {
    console.error('Login error:', e)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
