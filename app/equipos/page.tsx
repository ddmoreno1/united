'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Team } from '@/lib/types'

export default function EquiposIndex() {
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')

  useEffect(() => {
    let mounted = true
    ;(async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('teams')
        .select('id, name, slug, crestUrl:crest_url')
        .order('name', { ascending: true })
      if (error) console.error('[equipos] ', error)
      if (mounted) {
        setTeams((data ?? []) as Team[])
        setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [])

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase()
    if (!term) return teams
    return teams.filter(t => t.name.toLowerCase().includes(term) || t.slug.toLowerCase().includes(term))
  }, [q, teams])

  return (
    <div className="text-black">
      {/* Header */}
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Equipos</h1>
          <p className="text-sm sm:text-base opacity-80">Explora todos los equipos de la liga.</p>
        </div>

        {/* Buscador */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar equipo…"
              className="w-64 max-w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 pr-10 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Buscar equipo por nombre"
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">🔎</span>
          </div>
          {q && (
            <button
              onClick={() => setQ('')}
              className="text-sm px-3 py-2 rounded-lg border border-black/10 hover:bg-gray-50"
              aria-label="Limpiar búsqueda"
            >
              Limpiar
            </button>
          )}
        </div>
      </div>

      {/* Grid */}
      <ul className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <li key={`sk-${i}`} className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-3 animate-pulse">
                  <div className="h-12 w-12 rounded-lg bg-gray-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-2/3 bg-gray-200 rounded" />
                    <div className="h-3 w-1/3 bg-gray-200 rounded" />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <div className="h-8 w-20 bg-gray-200 rounded" />
                  <div className="h-8 w-24 bg-gray-200 rounded" />
                </div>
              </li>
            ))
          : filtered.length === 0
          ? (
            <li className="col-span-full">
              <div className="rounded-2xl border border-black/10 bg-white p-6 text-sm opacity-80">
                No se encontraron equipos {q ? <>para “{q}”</> : null}.
              </div>
            </li>
          )
          : filtered.map((t) => (
              <li key={t.id}>
                <article className="group h-full rounded-2xl border border-black/10 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3">
                    <Image
                      src={t.crestUrl ?? '/placeholder-crest.svg'}
                      alt={t.name}
                      width={48}
                      height={48}
                      className="h-12 w-12 rounded-lg bg-white ring-1 ring-black/5 object-contain"
                    />
                    <div className="min-w-0">
                      <Link
                        href={`/equipos/${t.slug}`}
                        className="block font-semibold truncate text-blue-700 hover:underline"
                        title={t.name}
                      >
                        {t.name}
                      </Link>
                      <div className="text-xs opacity-70 truncate">@{t.slug}</div>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="mt-4 flex items-center gap-2">
                    <Link
                      href={`/equipos/${t.slug}/plantel`}
                      className="inline-flex items-center justify-center rounded-xl border border-black/10 px-3 py-1.5 text-sm hover:bg-gray-50 transition-colors"
                    >
                      Plantel
                    </Link>
                    <Link
                      href={`/equipos/${t.slug}/partidos`}
                      className="inline-flex items-center justify-center rounded-xl border border-transparent bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700 transition-colors"
                    >
                      Partidos
                    </Link>
                  </div>

                  {/* Línea decorativa sutil */}
                  <div className="pointer-events-none mt-3 h-1 rounded-full bg-gradient-to-r from-transparent via-blue-500/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </article>
              </li>
            ))}
      </ul>
    </div>
  )
}
