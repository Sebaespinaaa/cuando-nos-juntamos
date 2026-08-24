import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const calendar_id = searchParams.get('calendar_id')
  const year = searchParams.get('year')
  const month = searchParams.get('month')

  if (!calendar_id) {
    return NextResponse.json({ error: 'calendar_id requerido' }, { status: 400 })
  }

  const supabase = createAdminClient()
  let query = supabase
    .from('availability')
    .select('*, user:users(id, display_name, avatar, avatar_color)')
    .eq('calendar_id', calendar_id)

  if (year && month) {
    const start = `${year}-${String(month).padStart(2, '0')}-01`
    const end = `${year}-${String(month).padStart(2, '0')}-31`
    query = query.gte('date', start).lte('date', end)
  }

  const { data, error } = await query.order('date')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ availability: data })
}

export async function POST(request: NextRequest) {
  try {
    const { calendar_id, user_id, date, status } = await request.json()

    if (!calendar_id || !user_id || !date || !status) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
    }

    const validStatuses = ['available', 'unavailable', 'unknown']
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Estado inválido' }, { status: 400 })
    }

    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('availability')
      .upsert(
        { calendar_id, user_id, date, status },
        { onConflict: 'calendar_id,user_id,date' }
      )
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ availability: data })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
