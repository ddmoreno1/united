'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Team } from '@/lib/types'

type TeamRow = Team

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
        .select('id, name, slug') // no necesitamos crest aquí
        .order('name', { ascending: true })
      if (!mounted) return
      if (error) console.error('[TeamSwitcher] load teams', error)
      setTeams((data ?? []) as TeamRow[])
      setLoading(false)
    })()
    return () => { mounted = false }
  }, [])

  const handleChange = (slug: string) => {
    const href = `/equipos/${slug}${tail ? `/${tail}` : ''}`
    router.push(href)
  }

  return (
    <div className="text-black">
      <label htmlFor="team-switcher" className="text-sm opacity-70 mr-2">
        Equipo:
      </label>
      <select
        id="team-switcher"
        className="inline-block w-72 max-w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={currentSlug}
        onChange={(e) => handleChange(e.target.value)}
        aria-label="Cambiar equipo"
        disabled={loading || teams.length === 0}
      >
        {loading ? (
          <option>Cargando…</option>
        ) : teams.length === 0 ? (
          <option>No hay equipos</option>
        ) : (
          teams.map((t) => (
            <option key={t.id} value={t.slug}>
              {t.name}
            </option>
          ))
        )}
      </select>
    </div>
  )
}
