'use client'

import { User, AvailabilityStatus, Availability } from '@/types/database'
import { cn } from '@/lib/utils'

const STATUS_BG = {
  available: 'bg-green-100',
  unavailable: 'bg-red-50',
  unknown: '',
}

interface DayCellProps {
  date: Date
  dateStr: string
  dayData: Availability[]
  users: User[]
  isToday: boolean
  myStatus: AvailabilityStatus
  onClick: () => void
}

export function DayCell({ date, dayData, users, isToday, myStatus, onClick }: DayCellProps) {
  const available = dayData.filter(a => a.status === 'available')
  const totalUsers = users.length
  const availableCount = available.length

  const bgClass = myStatus !== 'unknown' ? STATUS_BG[myStatus] : ''

  return (
    <button
      onClick={onClick}
      className={cn(
        'relative aspect-square min-h-[52px] rounded-xl p-1 flex flex-col items-center',
        'hover:bg-indigo-50 transition-all duration-150 cursor-pointer group',
        bgClass,
        isToday && 'ring-2 ring-indigo-500 ring-offset-1'
      )}
    >
      {/* Day number */}
      <span
        className={cn(
          'text-sm font-semibold leading-none mb-1',
          isToday ? 'text-indigo-600' : 'text-gray-800'
        )}
      >
        {date.getDate()}
      </span>

      {/* Avatars preview */}
      {available.length > 0 && (
        <div className="flex flex-wrap justify-center gap-px">
          {available.slice(0, 3).map(a => {
            const u = users.find(u => u.id === a.user_id)
            if (!u) return null
            return (
              <div
                key={u.id}
                className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold"
                style={{ backgroundColor: u.avatar_color + '40', border: `1.5px solid ${u.avatar_color}`, color: u.avatar_color }}
                title={u.display_name}
              >
                {u.display_name.charAt(0)}
              </div>
            )
          })}
          {available.length > 3 && (
            <div className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center text-[7px] text-gray-500 font-bold">
              +{available.length - 3}
            </div>
          )}
        </div>
      )}

      {/* Count badge */}
      {availableCount > 0 && totalUsers > 0 && (
        <span className="text-[9px] text-gray-400 mt-auto">
          {availableCount}/{totalUsers}
        </span>
      )}
    </button>
  )
}
