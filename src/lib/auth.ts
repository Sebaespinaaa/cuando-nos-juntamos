import bcrypt from 'bcryptjs'
import { createAdminClient } from './supabase/admin'
import { User } from '@/types/database'

const MAX_ATTEMPTS = 5
const LOCK_DURATION_MINUTES = 15

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function loginUser(username: string, password: string): Promise<{ user: User | null; error: string | null }> {
  const supabase = createAdminClient()

  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username.toLowerCase().trim())
    .single()

  if (error || !user) {
    return { user: null, error: 'Usuario o contraseña incorrectos' }
  }

  // Check if locked
  if (user.locked_until && new Date(user.locked_until) > new Date()) {
    const remaining = Math.ceil((new Date(user.locked_until).getTime() - Date.now()) / 60000)
    return { user: null, error: `Cuenta bloqueada. Intenta en ${remaining} minuto(s).` }
  }

  const valid = await verifyPassword(password, user.password_hash)

  if (!valid) {
    const newAttempts = (user.login_attempts || 0) + 1
    const updates: Record<string, unknown> = { login_attempts: newAttempts }

    if (newAttempts >= MAX_ATTEMPTS) {
      const lockedUntil = new Date(Date.now() + LOCK_DURATION_MINUTES * 60 * 1000).toISOString()
      updates.locked_until = lockedUntil
      updates.login_attempts = 0
    }

    await supabase.from('users').update(updates).eq('id', user.id)
    return { user: null, error: 'Usuario o contraseña incorrectos' }
  }

  // Reset attempts on success
  await supabase.from('users').update({ login_attempts: 0, locked_until: null }).eq('id', user.id)

  return { user, error: null }
}
