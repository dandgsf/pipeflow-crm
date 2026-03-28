'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface SettingsTabProps {
  href: string
  label: string
}

export function SettingsTab({ href, label }: SettingsTabProps) {
  const pathname = usePathname()
  const isActive = pathname === href || pathname.startsWith(`${href}/`)

  return (
    <Link
      href={href}
      className={cn(
        'relative px-4 py-2.5 text-sm font-medium transition-colors',
        isActive ? 'text-[#F0F0F0]' : 'text-[#888] hover:text-[#C8C8C8]',
      )}
    >
      {label}
      {isActive && (
        <span
          className="absolute inset-x-0 bottom-0 h-[2px] rounded-t-full"
          style={{ backgroundColor: '#CAFF33' }}
        />
      )}
    </Link>
  )
}
