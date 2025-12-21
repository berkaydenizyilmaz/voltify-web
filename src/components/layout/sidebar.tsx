'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Home01Icon,
  ChartLineData02Icon,
  Settings02Icon,
  Analytics01Icon,
  CpuIcon,
  InformationCircleIcon,
  Menu01Icon,
} from '@hugeicons/core-free-icons'

const NAV_ITEMS = [
  { href: '/', label: 'Dashboard', icon: Home01Icon },
  { href: '/tahminler', label: 'Tahminler', icon: ChartLineData02Icon },
  { href: '/simulasyon', label: 'Simülasyon', icon: Settings02Icon },
  { href: '/karsilastirma', label: 'Karşılaştırma', icon: Analytics01Icon },
  { href: '/modeller', label: 'Modeller', icon: CpuIcon },
  { href: '/hakkinda', label: 'Hakkında', icon: InformationCircleIcon },
] as const

function NavLink({
  href,
  label,
  icon,
  isActive,
}: {
  href: string
  label: string
  icon: typeof Home01Icon
  isActive: boolean
}) {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
        isActive
          ? 'bg-primary text-primary-foreground'
          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
      )}
    >
      <HugeiconsIcon icon={icon} size={20} />
      {label}
    </Link>
  )
}

function NavContent() {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col gap-1">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.href}
          href={item.href}
          label={item.label}
          icon={item.icon}
          isActive={pathname === item.href}
        />
      ))}
    </nav>
  )
}

export function Sidebar() {
  return (
    <aside className="hidden h-screen w-64 flex-col border-r bg-background p-4 md:flex">
      <div className="mb-8 flex items-center gap-2 px-2">
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
          <HugeiconsIcon icon={ChartLineData02Icon} size={20} className="text-primary-foreground" />
        </div>
        <span className="text-xl font-bold">Voltify</span>
      </div>
      <NavContent />
    </aside>
  )
}

export function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger
        render={<Button variant="ghost" size="icon" className="md:hidden" />}
      >
        <HugeiconsIcon icon={Menu01Icon} size={20} />
        <span className="sr-only">Toggle menu</span>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-4">
        <div className="mb-8 flex items-center gap-2 px-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
            <HugeiconsIcon icon={ChartLineData02Icon} size={20} className="text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">Voltify</span>
        </div>
        <NavContent />
      </SheetContent>
    </Sheet>
  )
}
