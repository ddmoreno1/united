'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { useTeam } from '@/lib/team-context'

type SortKey = 'number' | 'name'

export default function PlantelPage() {
  // 1) Siempre llama hooks al tope
  const ctx = useTeam() as {
    team: { name: string; crestUrl?: string | null } | null
    players: { id: string; name: string; number: number | null; position?: string | null }[]
    loading?: boolean
  }

  const team = ctx?.team ?? null
  const players = ctx?.players ?? []
  const loading = ctx?.loading ?? false

  const [q, setQ] = useState('')
  const [sortBy, setSortBy] = useState<SortKey>('number')
  const [posFilter, setPosFilter] = useState<string>('') // "" = todas

  // 2) Derivados con useMemo (siempre después de hooks, antes del render)
  const positions = useMemo(() => {
    const set = new Set<string>()
    for (const p of players) {
      if (p.position && p.position.trim()) set.add(p.position.trim())
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'es'))
  }, [players])

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase()
    let list = players

    if (term) {
      list = list.filter((p) =>
        p.name.toLowerCase().includes(term) || String(p.number ?? '').includes(term)
      )
    }
    if (posFilter) {
      list = list.filter((p) => (p.position ?? '').trim() === posFilter)
    }

    list = [...list].sort((a, b) => {
      if (sortBy === 'number') {
        const an = a.number ?? 9999
        const bn = b.number ?? 9999
        if (an !== bn) return an - bn
        return a.name.localeCompare(b.name, 'es')
      } else {
        const n = a.name.localeCompare(b.name, 'es')
        if (n !== 0) return n
        return (a.number ?? 9999) - (b.number ?? 9999)
      }
    })

    return list
  }, [players, q, posFilter, sortBy])

  // 3) Ahora sí: renders (puedes retornar temprano aquí)
  if (!team) {
    return <div className="rounded-xl border p-4 text-sm text-black bg-white">Equipo no encontrado.</div>
  }

  return (
    <div className="text-black">
      {/* Header */}
      <header className="mb-6 sm:mb-8 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <Image
            src={team.crestUrl ?? '/placeholder-crest.svg'}
            alt={team.name}
            width={48}
            height={48}
            className="h-12 w-12 rounded-lg bg-white ring-1 ring-black/5 object-contain"
          />
        <div>
            <h1 className="text-2xl sm:text-3xl font-bold leading-tight">Plantel — {team.name}</h1>
            <p className="text-sm opacity-70">{players.length} jugador{players.length === 1 ? '' : 'es'}</p>
          </div>
        </div>

        {/* Controles */}
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          {/* Búsqueda */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Buscar por nombre o dorsal…"
                className="w-72 max-w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 pr-10 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Buscar jugador"
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

          {/* Sort + Filtros */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortKey)}
              className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Ordenar por"
            >
              <option value="number">Ordenar por dorsal</option>
              <option value="name">Ordenar por nombre</option>
            </select>

            <div className="flex items-center gap-2">
              <FilterChip active={!posFilter} onClick={() => setPosFilter('')} label="Todas" />
              {positions.map((pos) => (
                <FilterChip
                  key={pos}
                  active={posFilter === pos}
                  onClick={() => setPosFilter(pos)}
                  label={pos}
                />
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Grid */}
      <ul className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <li key={`sk-${i}`} className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-gray-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-2/3 bg-gray-200 rounded" />
                    <div className="h-3 w-1/3 bg-gray-200 rounded" />
                  </div>
                </div>
              </li>
            ))
          : filtered.length === 0
          ? (
            <li className="col-span-full">
              <div className="rounded-2xl border border-black/10 bg-white p-6 text-sm opacity-80">
                {q || posFilter ? 'No hay jugadores que coincidan con los filtros.' : 'No hay jugadores cargados.'}
              </div>
            </li>
          )
          : filtered.map((p) => (
              <li key={p.id}>
                <article className="group h-full rounded-2xl border border-black/10 bg-white p-4 shadow-sm hover:shadow-md transition">
                  <div className="flex items-center gap-4">
                    <NumberBadge number={p.number} />
                    <div className="min-w-0">
                      <div className="font-semibold truncate">{p.name}</div>
                      <div className="text-xs opacity-70">
                        {p.position ? <PositionPill label={p.position} /> : <span className="opacity-60">Sin posición</span>}
                      </div>
                    </div>
                  </div>
                </article>
              </li>
            ))}
      </ul>
    </div>
  )
}

/* ---------- subcomponentes UI ---------- */

function NumberBadge({ number }: { number: number | null }) {
  const display = number ?? '—'
  return (
    <div
      className={`flex items-center justify-center h-12 w-12 rounded-full ring-1 ring-black/5 ${
        number != null ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
      }`}
      title={number != null ? `Dorsal ${number}` : 'Sin dorsal'}
    >
      <span className="text-sm font-bold">{display}</span>
    </div>
  )
}

function PositionPill({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[11px] text-blue-700">
      {label}
    </span>
  )
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3 py-1 text-xs border transition ${
        active
          ? 'bg-blue-600 text-white border-blue-600'
          : 'bg-white text-gray-800 border-black/10 hover:bg-gray-50'
      }`}
      aria-pressed={active}
      type="button"
    >
      {label}
    </button>
  )
}
