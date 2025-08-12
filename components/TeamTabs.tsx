// components/TeamTabs.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function TeamTabs({ slug }: { slug: string }) {
  const pathname = usePathname()

  const tabs = [
    { href: `/equipos/${slug}`, label: 'Información', exact: true },
    { href: `/equipos/${slug}/plantel`, label: 'Jugadores' },
    { href: `/equipos/${slug}/partidos`, label: 'Partidos' },
    // Estadísticas eliminada
  ]

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  return (
    <nav
      className="mt-4 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      aria-label="Secciones del equipo"
    >
      <ul className="flex min-w-max gap-1 rounded-xl border border-black/10 bg-white p-1 shadow-sm">
        {tabs.map((t) => {
          const active = isActive(t.href, t.exact)
          return (
            <li key={t.href}>
              <Link
                href={t.href}
                aria-current={active ? 'page' : undefined}
                className={[
                  'inline-flex items-center rounded-lg px-3.5 py-2 text-sm transition-colors',
                  active
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-700 hover:bg-gray-50',
                ].join(' ')}
              >
                {t.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
