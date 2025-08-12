'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import type { Team } from '@/lib/types'

type TeamRow = Team & { crestUrl?: string | null }

export default function TeamSwitcher({ currentSlug }: { currentSlug: string }) {
  const pathname = usePathname()
  const router = useRouter()

  // todo lo que venga después de /equipos/[slug]/...
  const tail = useMemo(() => pathname?.split('/').slice(3).join('/') || '', [pathname])

  const [teams, setTeams] = useState<TeamRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('teams')
        .select('id, name, slug, crestUrl:crest_url')
        .order('name', { ascending: true })
      if (!mounted) return
      if (error) console.error('[TeamSwitcher] load teams', error)
      setTeams((data ?? []) as TeamRow[])
      setLoading(false)
    })()
    return () => { mounted = false }
  }, [])

  // Cambiar desde el <select> (móvil)
  const handleChange = (slug: string) => {
    const href = `/equipos/${slug}${tail ? `/${tail}` : ''}`
    router.push(href)
  }

  return (
    <div className="text-black">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm opacity-70">Equipo:</span>

        {/* Móvil: selector nativo */}
        <div className="md:hidden">
          <select
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={currentSlug}
            onChange={(e) => handleChange(e.target.value)}
            aria-label="Cambiar equipo"
          >
            {loading ? (
              <option>Cargando…</option>
            ) : (
              teams.map((t) => (
                <option key={t.id} value={t.slug}>{t.name}</option>
              ))
            )}
          </select>
        </div>
      </div>

      {/* Desktop: pills con scroll horizontal suave */}
      <div
        className="mt-2 hidden md:block overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-label="Selector de equipo"
      >
        <ul className="flex min-w-max gap-2">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <li key={`sk-${i}`} className="rounded-full border border-black/10 bg-white px-3 py-2 text-sm shadow-sm animate-pulse">
                  <span className="inline-block h-4 w-20 bg-gray-200 rounded" />
                </li>
              ))
            : teams.map((t) => {
                const active = t.slug === currentSlug
                return (
                  <li key={t.id}>
                    <Link
                      href={`/equipos/${t.slug}${tail ? `/${tail}` : ''}`}
                      aria-current={active ? 'page' : undefined}
                      className={[
                        'inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm transition-colors shadow-sm',
                        active
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'bg-white border-black/10 text-gray-800 hover:bg-gray-50'
                      ].join(' ')}
                      title={t.name}
                    >
                      <Image
                        src={t.crestUrl ?? '/placeholder-crest.svg'}
                        alt={t.name}
                        width={18}
                        height={18}
                        className="h-[18px] w-[18px] rounded bg-white ring-1 ring-black/5 object-contain"
                      />
                      <span className="whitespace-nowrap">{t.name}</span>
                    </Link>
                  </li>
                )
              })}
        </ul>
      </div>
    </div>
  )
}
