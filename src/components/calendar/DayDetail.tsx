'use client'

import { User, AvailabilityStatus, Availability } from '@/types/database'
import { Modal } from '../ui/Modal'
import { Avatar } from '../ui/Avatar'
import { STATUS_CONFIG } from '../ui/StatusBadge'
import { cn } from '@/lib/utils'

const DAYS_ES = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
const MONTHS_ES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
]

interface DayDetailProps {
  dateStr: string
  dayData: Availability[]
  users: User[]
  currentUser: User
  onClose: () => void
  onStatusChange: (date: string, status: AvailabilityStatus) => Promise<void>
}

export function DayDetail({ dateStr, dayData, users, currentUser, onClose, onStatusChange }: DayDetailProps) {
  const date = new Date(dateStr + 'T12:00:00')
  const dayName = DAYS_ES[date.getDay()]
  const monthName = MONTHS_ES[date.getMonth()]
  const title = `${dayName} ${date.getDate()} de ${monthName}`

  const available = dayData.filter(a => a.status === 'available').length
  const total = users.length
  const percentage = total > 0 ? Math.round((available / total) * 100) : 0

  const myStatus = dayData.find(a => a.user_id === currentUser.id)?.status || 'unknown'

  const handleStatusClick = async (status: AvailabilityStatus) => {
    await onStatusChange(dateStr, status)
  }

  return (
    <Modal open onClose={onClose} title={title}>
      {/* Users list */}
      <div className="space-y-2 mb-5">
        {users.map(user => {
          const userAvail = dayData.find(a => a.user_id === user.id)
          const status: AvailabilityStatus = userAvail?.status || 'unknown'
          const config = STATUS_CONFIG[status]
          return (
            <div key={user.id} className="flex items-center justify-between py-2 px-3 rounded-xl bg-gray-50">
              <div className="flex items-center gap-3">
                <Avatar avatar={user.avatar} color={user.avatar_color} name={user.display_name} size="sm" />
                <span className="text-sm font-medium text-gray-800">{user.display_name}</span>
              </div>
              <span className="text-sm">{config.emoji} {config.label}</span>
            </div>
          )
        })}
      </div>

      {/* Summary */}
      <div className="bg-indigo-50 rounded-xl p-3 mb-5 text-center">
        <p className="text-sm text-indigo-600 font-semibold">
          {available} de {total} personas disponibles
        </p>
        <p className="text-xs text-indigo-400">{percentage}% del grupo</p>
      </div>

      {/* My status selector */}
      <div>
        <p className="text-xs text-gray-500 mb-2 font-medium">Tu disponibilidad:</p>
        <div className="grid grid-cols-3 gap-2">
          {(['available', 'unavailable', 'unknown'] as AvailabilityStatus[]).map(status => {
            const config = STATUS_CONFIG[status]
            return (
              <button
                key={status}
                onClick={() => handleStatusClick(status)}
                className={cn(
                  'py-2 px-3 rounded-xl text-sm font-medium border-2 transition-all',
                  myStatus === status
                    ? `${config.bg} ${config.text} ${config.border} scale-105`
                    : 'bg-gray-50 text-gray-500 border-gray-100 hover:border-gray-300'
                )}
              >
                {config.emoji}<br />
                <span className="text-xs">{config.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </Modal>
  )
}
