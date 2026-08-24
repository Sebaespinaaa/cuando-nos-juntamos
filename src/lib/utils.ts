import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date, locale = 'es-CL'): string {
  return date.toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long' })
}

export function toDateString(date: Date): string {
  return date.toISOString().split('T')[0]
}

export function getDaysInMonth(year: number, month: number): Date[] {
  const days: Date[] = []
  const date = new Date(year, month, 1)
  while (date.getMonth() === month) {
    days.push(new Date(date))
    date.setDate(date.getDate() + 1)
  }
  return days
}

export function getFirstDayOfMonth(year: number, month: number): number {
  // 0=Sun, convert to Mon-based (0=Mon)
  const day = new Date(year, month, 1).getDay()
  return day === 0 ? 6 : day - 1
}
