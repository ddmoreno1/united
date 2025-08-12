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

function groupByMatchdayOrWeek(rows: Row[]) {
  if (!rows.length) return [] as { title: string; items: Row[] }[]

  // ¿Hay al menos un matchday?
  const hasMatchday = rows.some(r => r.matchday != null)

  if (hasMatchday) {
    // Agrupar por matchday fijo
    const map = new Map<number, Row[]>()
    for (const r of rows) {
      const md = r.matchday ?? 0
      if (!map.has(md)) map.set(md, [])
      map.get(md)!.push(r)
    }
    return Array.from(map.entries())
      .filter(([md]) => md > 0)
      .sort((a, b) => a[0] - b[0])
      .map(([md, items]) => ({
        title: `Fecha ${md}`,
        items: items.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
      }))
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
    .map(([md, items]) => ({ title: `Fecha ${md}`, items }))
}

export default async function PartidosPage() {
  // Trae todos los partidos (scheduled + finished), con matchday si existe
  const { data, error } = await supabase
    .from('matches')
    .select(`
      id,
      date,
      location,
      status,
      opponent,
      matchday,
      team:teams!matches_team_id_fkey (
        id, name, slug
      )
    `)
    .order('matchday', { ascending: true, nullsFirst: true })
    .order('date', { ascending: true })
    .returns<Row[]>() // 👈 importante: tipa la respuesta

  if (error) {
    console.error('[partidos/page]', error)
  }

  const rows = data ?? [] // 👈 ya no hace falta el cast
  const groups = groupByMatchdayOrWeek(rows)

  return (
    <main className="container mx-auto px-4 py-8 text-black">
      <h1 className="text-2xl font-bold mb-6">Partidos</h1>

      {groups.length === 0 ? (
        <div className="rounded-2xl border border-black/10 bg-white p-4 sm:p-5 shadow-sm text-sm opacity-70">
          No hay partidos registrados.
        </div>
      ) : (
        <div className="space-y-6">
          {groups.map((g) => (
            <section key={g.title} className="rounded-2xl border border-black/10 bg-white p-4 sm:p-5 shadow-sm">
              <h2 className="text-lg font-semibold mb-3">{g.title}</h2>
              <ul className="divide-y">
                {g.items.map((m) => {
                  const d = new Date(m.date)
                  return (
                    <li key={m.id} className="py-3 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="font-medium truncate">
                          {m.team.name} <span className="opacity-60">vs</span> {m.opponent}
                        </div>
                        <div className="text-sm opacity-70 truncate">
                          {formatShort(d)}{m.location ? ` · ${m.location}` : ''}
                          {m.status !== 'scheduled' ? ` · ${m.status}` : ''}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <Link
                          className="text-xs text-blue-700 hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 rounded"
                          href={`/equipos/${m.team.slug}/partidos`}
                        >
                          Ver equipo
                        </Link>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </section>
          ))}
        </div>
      )}
    </main>
  )
}
