'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Availability, AvailabilityStatus } from '@/types/database'

export function useAvailability(calendarId: string | null, year: number, month: number) {
  const [availability, setAvailability] = useState<Availability[]>([])
  const [loading, setLoading] = useState(false)

  const fetchAvailability = useCallback(async () => {
    if (!calendarId) return
    setLoading(true)
    try {
      const res = await fetch(
        `/api/availability?calendar_id=${calendarId}&year=${year}&month=${month + 1}`
      )
      const data = await res.json()
      setAvailability(data.availability || [])
    } finally {
      setLoading(false)
    }
  }, [calendarId, year, month])

  useEffect(() => {
    fetchAvailability()
  }, [fetchAvailability])

  // Realtime subscription
  useEffect(() => {
    if (!calendarId) return
    const supabase = createClient()

    const channel = supabase
      .channel(`availability:${calendarId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'availability',
          filter: `calendar_id=eq.${calendarId}`,
        },
        () => {
          fetchAvailability()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [calendarId, fetchAvailability])

  const updateAvailability = async (
    userId: string,
    date: string,
    status: AvailabilityStatus
  ) => {
    if (!calendarId) return
    await fetch('/api/availability', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ calendar_id: calendarId, user_id: userId, date, status }),
    })
  }

  // Group by date
  const byDate = availability.reduce<Record<string, Availability[]>>((acc, a) => {
    if (!acc[a.date]) acc[a.date] = []
    acc[a.date].push(a)
    return acc
  }, {})

  return { availability, byDate, loading, updateAvailability, refetch: fetchAvailability }
}
