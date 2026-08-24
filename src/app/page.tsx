'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { AuthGuard } from '@/components/AuthGuard'
import { Calendar } from '@/components/calendar/Calendar'
import { BestDates } from '@/components/calendar/BestDates'
import { Avatar } from '@/components/ui/Avatar'
import { useAvailability } from '@/hooks/useAvailability'
import { User, Calendar as CalendarType } from '@/types/database'
import Link from 'next/link'

export default function HomePage() {
  const { user, logout } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [calendars, setCalendars] = useState<CalendarType[]>([])
  const [selectedCalendarId, setSelectedCalendarId] = useState<string | null>(null)
  const today = new Date()
  const { availability } = useAvailability(selectedCalendarId, today.getFullYear(), today.getMonth())

  useEffect(() => {
    fetch('/api/users').then(r => r.json()).then(d => setUsers(d.users || []))
    fetch('/api/calendars').then(r => r.json()).then(d => {
      const cals = d.calendars || []
      setCalendars(cals)
      if (cals.length > 0) setSelectedCalendarId(cals[0].id)
    })
  }, [])

  if (!user) return null

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
            <div>
              <h1 className="text-base font-bold text-gray-900">📅 ¿Cuándo nos juntamos?</h1>
              <p className="text-xs text-gray-400">Hola, {user.display_name}</p>
            </div>
            <div className="flex items-center gap-2">
              {user.role === 'admin' && (
                <Link
                  href="/admin"
                  className="text-xs px-3 py-1.5 bg-amber-100 text-amber-700 rounded-lg font-medium hover:bg-amber-200 transition-colors"
                >
                  Admin
                </Link>
              )}
              <button
                onClick={logout}
                className="text-xs px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Salir
              </button>
              <Avatar avatar={user.avatar} color={user.avatar_color} name={user.display_name} size="sm" />
            </div>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
          {/* Calendar selector */}
          {calendars.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {calendars.map(cal => (
                <button
                  key={cal.id}
                  onClick={() => setSelectedCalendarId(cal.id)}
                  className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    selectedCalendarId === cal.id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-gray-600 border border-gray-200 hover:border-indigo-300'
                  }`}
                >
                  {cal.name}
                </button>
              ))}
            </div>
          )}

          {calendars.length === 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-center">
              <p className="text-amber-700 text-sm">
                No hay calendarios aún.
                {user.role === 'admin' && (
                  <> <Link href="/admin" className="underline font-medium">Crear uno en Administración</Link>.</>  
                )}
              </p>
            </div>
          )}

          {/* Calendar */}
          {selectedCalendarId && (
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <Calendar
                currentUser={user}
                calendarId={selectedCalendarId}
                users={users}
              />
            </div>
          )}

          {/* Legend */}
          {users.length > 0 && (
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <p className="text-xs text-gray-400 font-semibold mb-3">Participantes</p>
              <div className="flex flex-wrap gap-3">
                {users.map(u => (
                  <div key={u.id} className="flex items-center gap-2">
                    <Avatar avatar={u.avatar} color={u.avatar_color} name={u.display_name} size="sm" />
                    <span className="text-sm text-gray-700">{u.display_name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Best dates */}
          {selectedCalendarId && (
            <BestDates availability={availability} users={users} />
          )}
        </main>
      </div>
    </AuthGuard>
  )
}
