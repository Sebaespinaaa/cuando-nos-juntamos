'use client'

import { useState } from 'react'
import { getDaysInMonth, getFirstDayOfMonth, toDateString } from '@/lib/utils'
import { User, AvailabilityStatus } from '@/types/database'
import { useAvailability } from '@/hooks/useAvailability'
import { DayCell } from './DayCell'
import { DayDetail } from './DayDetail'
import { Avatar } from '../ui/Avatar'

const WEEKDAYS = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do']
const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
]

interface CalendarProps {
  currentUser: User
  calendarId: string | null
  users: User[]
}

export function Calendar({ currentUser, calendarId, users }: CalendarProps) {
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const { byDate, updateAvailability } = useAvailability(calendarId, viewYear, viewMonth)

  const days = getDaysInMonth(viewYear, viewMonth)
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth)

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }

  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  const goToday = () => {
    setViewYear(today.getFullYear())
    setViewMonth(today.getMonth())
  }

  const handleDayClick = (dateStr: string) => {
    setSelectedDate(dateStr)
  }

  const handleStatusChange = async (date: string, status: AvailabilityStatus) => {
    await updateAvailability(currentUser.id, date, status)
  }

  const blanks = Array(firstDay).fill(null)

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={prevMonth}
            className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors text-gray-600"
          >
            ‹
          </button>
          <h2 className="text-xl font-bold text-gray-900 min-w-[200px] text-center">
            {MONTHS[viewMonth]} de {viewYear}
          </h2>
          <button
            onClick={nextMonth}
            className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors text-gray-600"
          >
            ›
          </button>
        </div>
        <button
          onClick={goToday}
          className="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors"
        >
          Hoy
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-2">
        {WEEKDAYS.map(day => (
          <div key={day} className="text-center text-xs font-semibold text-gray-400 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1">
        {blanks.map((_, i) => <div key={`blank-${i}`} />)}
        {days.map(day => {
          const dateStr = toDateString(day)
          const dayData = byDate[dateStr] || []
          const isToday = toDateString(today) === dateStr
          const myStatus = dayData.find(a => a.user_id === currentUser.id)?.status || 'unknown'

          return (
            <DayCell
              key={dateStr}
              date={day}
              dateStr={dateStr}
              dayData={dayData}
              users={users}
              isToday={isToday}
              myStatus={myStatus as AvailabilityStatus}
              onClick={() => handleDayClick(dateStr)}
            />
          )
        })}
      </div>

      {/* Day Detail Modal */}
      {selectedDate && (
        <DayDetail
          dateStr={selectedDate}
          dayData={byDate[selectedDate] || []}
          users={users}
          currentUser={currentUser}
          onClose={() => setSelectedDate(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  )
}
