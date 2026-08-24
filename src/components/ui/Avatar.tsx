'use client'

import { cn } from '@/lib/utils'

interface AvatarProps {
  avatar: string
  color: string
  name: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Avatar({ avatar, color, name, size = 'md', className }: AvatarProps) {
  const sizes = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base',
  }

  const isEmoji = /\p{Emoji}/u.test(avatar)

  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center font-semibold flex-shrink-0',
        sizes[size],
        className
      )}
      style={{ backgroundColor: isEmoji ? color + '30' : color, border: `2px solid ${color}` }}
      title={name}
    >
      {isEmoji ? (
        <span className="leading-none">{avatar}</span>
      ) : (
        <span style={{ color }} className="leading-none">
          {avatar || name.charAt(0).toUpperCase()}
        </span>
      )}
    </div>
  )
}
