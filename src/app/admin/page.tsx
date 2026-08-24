'use client'

import { useState, useEffect, FormEvent } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { AuthGuard } from '@/components/AuthGuard'
import { Avatar } from '@/components/ui/Avatar'
import { User, Calendar } from '@/types/database'
import Link from 'next/link'

const AVATAR_COLORS = [
  '#6366f1', '#f59e0b', '#10b981', '#ef4444',
  '#8b5cf6', '#06b6d4', '#f97316', '#ec4899',
]

export default function AdminPage() {
  const { user } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [calendars, setCalendars] = useState<Calendar[]>([])
  const [tab, setTab] = useState<'users' | 'calendars'>('users')

  // New user form
  const [newUsername, setNewUsername] = useState('')
  const [newDisplayName, setNewDisplayName] = useState('')
  const [newPin, setNewPin] = useState('')
  const [newAvatar, setNewAvatar] = useState('😊')
  const [newColor, setNewColor] = useState(AVATAR_COLORS[0])
  const [newRole, setNewRole] = useState<'user' | 'admin'>('user')
  const [userError, setUserError] = useState('')
  const [userSuccess, setUserSuccess] = useState('')

  // New calendar form
  const [calName, setCalName] = useState('')
  const [calDesc, setCalDesc] = useState('')
  const [calError, setCalError] = useState('')

  const loadData = async () => {
    const [ur, cr] = await Promise.all([
      fetch('/api/users').then(r => r.json()),
      fetch('/api/calendars').then(r => r.json()),
    ])
    setUsers(ur.users || [])
    setCalendars(cr.calendars || [])
  }

  useEffect(() => { loadData() }, [])

  const createUser = async (e: FormEvent) => {
    e.preventDefault()
    setUserError('')
    setUserSuccess('')
    if (!/^\d{4}$/.test(newPin)) {
      setUserError('El PIN debe ser 4 dígitos')
      return
    }
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: newUsername, password: newPin, display_name: newDisplayName, avatar: newAvatar, avatar_color: newColor, role: newRole }),
    })
    const data = await res.json()
    if (!res.ok) { setUserError(data.error); return }
    setUserSuccess('Usuario creado correctamente')
    setNewUsername(''); setNewDisplayName(''); setNewPin(''); setNewAvatar('😊')
    loadData()
  }

  const deleteUser = async (id: string) => {
    if (!confirm('¿Eliminar usuario?')) return
    await fetch(`/api/users/${id}`, { method: 'DELETE' })
    loadData()
  }

  const createCalendar = async (e: FormEvent) => {
    e.preventDefault()
    setCalError('')
    if (!user) return
    const res = await fetch('/api/calendars', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: calName, description: calDesc, created_by: user.id }),
    })
    const data = await res.json()
    if (!res.ok) { setCalError(data.error); return }
    setCalName(''); setCalDesc('')
    loadData()
  }

  const deleteCalendar = async (id: string) => {
    if (!confirm('¿Eliminar calendario y todas sus disponibilidades?')) return
    await fetch(`/api/calendars/${id}`, { method: 'DELETE' })
    loadData()
  }

  const resetCalendar = async (id: string) => {
    if (!confirm('¿Reiniciar todas las disponibilidades?')) return
    await fetch(`/api/calendars/${id}/reset`, { method: 'POST' })
  }

  if (!user) return null

  return (
    <AuthGuard requireAdmin>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
            <div>
              <h1 className="text-base font-bold text-gray-900">⚙️ Administración</h1>
            </div>
            <Link href="/" className="text-sm text-indigo-600 hover:underline">← Volver</Link>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
          {/* Tabs */}
          <div className="flex gap-2">
            {(['users', 'calendars'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  tab === t ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 border border-gray-200'
                }`}>
                {t === 'users' ? 'Usuarios' : 'Calendarios'}
              </button>
            ))}
          </div>

          {/* USERS TAB */}
          {tab === 'users' && (
            <>
              {/* Create user */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <h2 className="font-semibold text-gray-900 mb-4">Crear usuario</h2>
                <form onSubmit={createUser} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Nombre de usuario</label>
                      <input value={newUsername} onChange={e => setNewUsername(e.target.value)} required
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Nombre visible</label>
                      <input value={newDisplayName} onChange={e => setNewDisplayName(e.target.value)} required
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">PIN (4 dígitos)</label>
                      <input value={newPin} onChange={e => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 4))} maxLength={4} required inputMode="numeric"
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 tracking-widest" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Avatar (emoji)</label>
                      <input value={newAvatar} onChange={e => setNewAvatar(e.target.value)} maxLength={2}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-center text-xl" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Color</label>
                    <div className="flex gap-2">
                      {AVATAR_COLORS.map(c => (
                        <button type="button" key={c} onClick={() => setNewColor(c)}
                          className={`w-7 h-7 rounded-full border-2 transition-transform ${
                            newColor === c ? 'scale-125 border-gray-600' : 'border-transparent'
                          }`}
                          style={{ backgroundColor: c }} />
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Rol</label>
                    <select value={newRole} onChange={e => setNewRole(e.target.value as 'user' | 'admin')}
                      className="px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                      <option value="user">Usuario</option>
                      <option value="admin">Administrador</option>
                    </select>
                  </div>
                  {userError && <p className="text-sm text-red-500">{userError}</p>}
                  {userSuccess && <p className="text-sm text-green-600">{userSuccess}</p>}
                  <button type="submit" className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl text-sm transition-colors">
                    Crear usuario
                  </button>
                </form>
              </div>

              {/* Users list */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <h2 className="font-semibold text-gray-900 mb-4">Usuarios ({users.length})</h2>
                <div className="space-y-2">
                  {users.map(u => (
                    <div key={u.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Avatar avatar={u.avatar} color={u.avatar_color} name={u.display_name} size="sm" />
                        <div>
                          <p className="text-sm font-medium text-gray-800">{u.display_name}</p>
                          <p className="text-xs text-gray-400">@{u.username} • {u.role}</p>
                        </div>
                      </div>
                      <button onClick={() => deleteUser(u.id)}
                        className="text-xs px-3 py-1.5 text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
                        Eliminar
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* CALENDARS TAB */}
          {tab === 'calendars' && (
            <>
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <h2 className="font-semibold text-gray-900 mb-4">Crear calendario</h2>
                <form onSubmit={createCalendar} className="space-y-3">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Nombre</label>
                    <input value={calName} onChange={e => setCalName(e.target.value)} required placeholder="Ej: Asado de septiembre"
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Descripción (opcional)</label>
                    <input value={calDesc} onChange={e => setCalDesc(e.target.value)} placeholder="..."
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  {calError && <p className="text-sm text-red-500">{calError}</p>}
                  <button type="submit" className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl text-sm transition-colors">
                    Crear calendario
                  </button>
                </form>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <h2 className="font-semibold text-gray-900 mb-4">Calendarios ({calendars.length})</h2>
                <div className="space-y-2">
                  {calendars.map(cal => (
                    <div key={cal.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div>
                        <p className="text-sm font-medium text-gray-800">{cal.name}</p>
                        {cal.description && <p className="text-xs text-gray-400">{cal.description}</p>}
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => resetCalendar(cal.id)}
                          className="text-xs px-3 py-1.5 text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors">
                          Reiniciar
                        </button>
                        <button onClick={() => deleteCalendar(cal.id)}
                          className="text-xs px-3 py-1.5 text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </AuthGuard>
  )
}
