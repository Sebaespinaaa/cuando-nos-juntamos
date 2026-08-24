'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User } from '@/types/database'

interface AuthContextType {
  user: User | null
  setUser: (user: User | null) => void
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const stored = sessionStorage.getItem('cnj_user')
    if (stored) {
      try {
        setUserState(JSON.parse(stored))
      } catch {
        sessionStorage.removeItem('cnj_user')
      }
    }
    setIsLoading(false)
  }, [])

  const setUser = (u: User | null) => {
    setUserState(u)
    if (u) {
      sessionStorage.setItem('cnj_user', JSON.stringify(u))
    } else {
      sessionStorage.removeItem('cnj_user')
    }
  }

  const logout = () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, setUser, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
