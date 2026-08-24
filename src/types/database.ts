export type AvailabilityStatus = 'available' | 'unavailable' | 'unknown'

export type UserRole = 'admin' | 'user'

export interface User {
  id: string
  username: string
  password_hash: string
  display_name: string
  avatar: string
  avatar_color: string
  role: UserRole
  created_at: string
  login_attempts: number
  locked_until: string | null
}

export interface Calendar {
  id: string
  name: string
  description: string | null
  created_at: string
  created_by: string
}

export interface Availability {
  id: string
  calendar_id: string
  user_id: string
  date: string
  status: AvailabilityStatus
  updated_at: string
  user?: User
}

export interface Database {
  public: {
    Tables: {
      users: {
        Row: User
        Insert: Omit<User, 'id' | 'created_at'>
        Update: Partial<Omit<User, 'id' | 'created_at'>>
      }
      calendars: {
        Row: Calendar
        Insert: Omit<Calendar, 'id' | 'created_at'>
        Update: Partial<Omit<Calendar, 'id' | 'created_at'>>
      }
      availability: {
        Row: Availability
        Insert: Omit<Availability, 'id' | 'updated_at'>
        Update: Partial<Omit<Availability, 'id'>>
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
  }
}
