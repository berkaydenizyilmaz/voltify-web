'use client'

import { MobileNav } from './sidebar'

export function Header() {
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-background px-4 md:hidden">
      <MobileNav />
      <span className="text-lg font-semibold">Voltify</span>
    </header>
  )
}
