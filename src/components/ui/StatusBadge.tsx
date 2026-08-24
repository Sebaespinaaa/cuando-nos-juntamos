import { AvailabilityStatus } from '@/types/database'
import { cn } from '@/lib/utils'

const STATUS_CONFIG = {
  available: { emoji: '🟢', label: 'Disponible', bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' },
  unavailable: { emoji: '🔴', label: 'No disponible', bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200' },
  unknown: { emoji: '⚪', label: 'Sin responder', bg: 'bg-gray-100', text: 'text-gray-500', border: 'border-gray-200' },
}

export function StatusBadge({ status, className }: { status: AvailabilityStatus; className?: string }) {
  const config = STATUS_CONFIG[status]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border',
        config.bg, config.text, config.border,
        className
      )}
    >
      {config.emoji} {config.label}
    </span>
  )
}

export { STATUS_CONFIG }
