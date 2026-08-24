'use client'

import { Availability, User } from '@/types/database'

const MEDALS = ['🥇', '🥈', '🥉']
const DAYS_ES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
const MONTHS_ES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']

interface BestDatesProps {
  availability: Availability[]
  users: User[]
}

export function BestDates({ availability, users }: BestDatesProps) {
  const total = users.length
  if (total === 0) return null

  // Group by date, count available
  const dateMap: Record<string, number> = {}
  availability.forEach(a => {
    if (a.status === 'available') {
      dateMap[a.date] = (dateMap[a.date] || 0) + 1
    }
  })

  const sorted = Object.entries(dateMap)
    .filter(([, count]) => count > 0)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)

  if (sorted.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-3">⭐ Mejores fechas</h3>
        <p className="text-sm text-gray-400 text-center py-4">Aún no hay disponibilidades marcadas</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <h3 className="font-semibold text-gray-900 mb-4">⭐ Mejores fechas</h3>
      <div className="space-y-3">
        {sorted.map(([dateStr, count], i) => {
          const date = new Date(dateStr + 'T12:00:00')
          const dayName = DAYS_ES[date.getDay()]
          const label = `${dayName} ${date.getDate()} ${MONTHS_ES[date.getMonth()]}`
          const pct = Math.round((count / total) * 100)
          const medal = MEDALS[i] || `#${i + 1}`

          return (
            <div key={dateStr} className="flex items-center gap-3">
              <span className="text-lg w-8 text-center">{medal}</span>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-800">{label}</span>
                  <span className="text-sm text-gray-500">{count}/{total}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
