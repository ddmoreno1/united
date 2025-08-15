// app/partidos/page.tsx
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

type Row = {
  id: string
  date: string
  location: string | null
  status: string
  opponent: string
  matchday: number | null
  goals_for: number | null
  goals_against: number | null
  team: { id: string; name: string; slug: string }
}

export const dynamic = 'force-dynamic' // opcional

function formatShort(d: Date) {
  return new Intl.DateTimeFormat('es-EC', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(d)
}

function startOfWeek(d: Date) {
  // Lunes = inicio de semana
  const day = d.getDay() || 7
  const result = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
  if (day !== 1) result.setUTCDate(result.getUTCDate() - (day - 1))
  result.setUTCHours(0, 0, 0, 0)
  return result.getTime()
}

/** Agrupa por matchday si existe; si no, agrupa por semanas etiquetadas como "Fecha N". */
function groupByMatchdayOrWeek(rows: Row[]): { md: number; title: string; items: Row[] }[] {
  if (!rows.length) return []

  const hasMatchday = rows.some((r) => r.matchday != null)

  if (hasMatchday) {
    const map = new Map<number, Row[]>()
    for (const r of rows) {
      const md = r.matchday ?? 0
      if (md <= 0) continue
      if (!map.has(md)) map.set(md, [])
      map.get(md)!.push(r)
    }
    const out = Array.from(map.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([md, items]) => ({
        md,
        title: `Fecha ${md}`,
        items: items.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
      }))
    return out
  }

  // Sin matchday: agrupar por semanas desde la primera
  rows.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  const first = new Date(rows[0].date)
  const firstWeekKey = startOfWeek(first)
  const buckets = new Map<number, Row[]>()
  for (const r of rows) {
    const wk = startOfWeek(new Date(r.date))
    const offsetWeeks = Math.round((wk - firstWeekKey) / (7 * 24 * 3600 * 1000))
    const md = offsetWeeks + 1
    if (!buckets.has(md)) buckets.set(md, [])
    buckets.get(md)!.push(r)
  }
  return Array.from(buckets.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([md, items]) => ({
      md,
      title: `Fecha ${md}`,
      items,
    }))
}

/** Página: muestra SOLO una fecha (última por defecto), select para cambiar y listado de fechas anteriores. */
export default async function PartidosPage({
  searchParams,
}: {
  // En tu versión de Next, searchParams viene como Promise y hay que await
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const sp = await searchParams

  // Trae todos los partidos
  const { data, error } = await supabase
    .from('matches')
    .select(`
      id,
      date,
      location,
      status,
      opponent,
      matchday,
      goals_for,
      goals_against,
      team:teams!matches_team_id_fkey (
        id, name, slug
      )
    `)
    .order('matchday', { ascending: true, nullsFirst: true })
    .order('date', { ascending: true })
    .returns<Row[]>()

  if (error) {
    console.error('[partidos/page]', error)
  }

  const rows = data ?? []
  const groups = groupByMatchdayOrWeek(rows)

  // Lista de números de fecha (mds) y último
  const mds = groups.map((g) => g.md)
  const lastMd = mds.length ? mds[mds.length - 1] : 0

  // Obtener ?fecha=N desde los params ya resueltos
  const q = sp?.fecha
  const parsed = Array.isArray(q) ? Number(q[0]) : q != null ? Number(q) : NaN
  const selectedMd = mds.includes(parsed) ? parsed : lastMd

  const current = groups.find((g) => g.md === selectedMd)
  const previous = groups.filter((g) => g.md < selectedMd)

  return (
    <main className="container mx-auto px-4 py-8 text-black">
      <h1 className="text-2xl font-bold mb-6">Partidos</h1>

      {groups.length === 0 ? (
        <div className="rounded-2xl border border-black/10 bg-white p-4 sm:p-5 shadow-sm text-sm opacity-70">
          No hay partidos registrados.
        </div>
      ) : (
        <div className="space-y-6">
          {/* Filtro con SELECT (GET ?fecha=N) */}
          <form method="GET" className="flex items-center gap-2">
            <label htmlFor="fecha" className="text-sm opacity-70">Ver fecha:</label>
            <select
              id="fecha"
              name="fecha"
              defaultValue={String(selectedMd)}
              className="rounded-lg border px-3 py-1.5"
              aria-label="Seleccionar fecha"
            >
              {mds.map((md) => (
                <option key={md} value={md}>
                  Fecha {md}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="px-3 py-1.5 rounded-lg border bg-white hover:bg-gray-50"
            >
              Ver
            </button>
            {/* Accesos rápidos */}
            <div className="ml-2 flex items-center gap-2">
              {(() => {
                const idx = mds.indexOf(selectedMd)
                const prevMd = idx > 0 ? mds[idx - 1] : null
                const nextMd = idx >= 0 && idx < mds.length - 1 ? mds[idx + 1] : null
                return (
                  <>
                    <Link
                      aria-disabled={!prevMd}
                      className={`px-3 py-1.5 rounded-lg border ${prevMd ? 'hover:bg-gray-50' : 'opacity-40 pointer-events-none'}`}
                      href={prevMd ? `/partidos?fecha=${prevMd}` : '#'}
                    >
                      ← Anterior
                    </Link>
                    <Link
                      aria-disabled={!nextMd}
                      className={`px-3 py-1.5 rounded-lg border ${nextMd ? 'hover:bg-gray-50' : 'opacity-40 pointer-events-none'}`}
                      href={nextMd ? `/partidos?fecha=${nextMd}` : '#'}
                    >
                      Siguiente →
                    </Link>
                  </>
                )
              })()}
            </div>
          </form>

          {/* SOLO la fecha seleccionada */}
          {current ? (
            <section className="rounded-2xl border border-black/10 bg-white p-4 sm:p-5 shadow-sm">
              <h2 className="text-lg font-semibold mb-3">{current.title}</h2>
              <ul className="divide-y">
                {current.items.map((m) => {
                  const d = new Date(m.date)
                  return (
                    <li key={m.id} className="py-3 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="font-medium truncate">
                          {m.team.name} <span className="opacity-60">vs</span> {m.opponent}
                        </div>
                        <div className="text-sm opacity-70 truncate">
                          {formatShort(d)}
                          {m.location ? ` · ${m.location}` : ''}
                          {m.status !== 'scheduled' ? ` · ${m.status}` : ''}
                        </div>
                      </div>
                      <div className="text-right shrink-0 tabular-nums">
                        {/* marcador */}
                        {(m.goals_for ?? 0)} - {(m.goals_against ?? 0)}
                      </div>
                    </li>
                  )
                })}
              </ul>
            </section>
          ) : (
            <div className="rounded-2xl border border-black/10 bg-white p-4 sm:p-5 shadow-sm text-sm opacity-70">
              No hay partidos para la fecha seleccionada.
            </div>
          )}

          {/* Fechas anteriores: resultados compactos */}
          {previous.length > 0 && (
            <section className="rounded-2xl border border-black/10 bg-white p-4 sm:p-5 shadow-sm">
              <h3 className="font-semibold mb-3">Fechas anteriores</h3>
              <div className="space-y-4">
                {previous
                  .slice()
                  .sort((a, b) => b.md - a.md) // de la más reciente hacia atrás
                  .map((g) => (
                    <div key={g.md}>
                      <div className="mb-2 text-sm font-medium opacity-80">{g.title}</div>
                      <ul className="text-sm divide-y">
                        {g.items.map((m) => (
                          <li key={m.id} className="py-2 flex items-center justify-between gap-3">
                            <div className="truncate">
                              <span className="font-medium">{m.team.name}</span>
                              <span className="opacity-60"> vs </span>
                              <span className="font-medium">{m.opponent}</span>
                              {m.location ? <span className="opacity-60"> · {m.location}</span> : null}
                            </div>
                            <div className="shrink-0 tabular-nums">
                              {(m.goals_for ?? 0)} - {(m.goals_against ?? 0)}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
              </div>
            </section>
          )}
        </div>
      )}
    </main>
  )
}
