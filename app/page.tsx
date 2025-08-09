import Image from "next/image"
import Link from "next/link"
import { TEAMS, MATCHES } from "@/lib/mock"

function computeStandings() {
  const nameById = new Map(TEAMS.map(t => [t.id, t.name]))
  const table = new Map<string, {
    teamId: string; name: string; pj: number; pg: number; pe: number; pp: number; gf: number; gc: number; dg: number; pts: number
  }>()

  const ensure = (teamId: string) => {
    if (!table.has(teamId)) {
      table.set(teamId, { teamId, name: nameById.get(teamId) ?? "Equipo", pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dg: 0, pts: 0 })
    }
    return table.get(teamId)!
  }

  for (const m of MATCHES) {
    const r = ensure(m.teamId)
    r.pj += 1
    r.gf += m.goalsFor
    r.gc += m.goalsAgainst
    r.dg = r.gf - r.gc
    if (m.goalsFor > m.goalsAgainst) { r.pg += 1; r.pts += 3 }
    else if (m.goalsFor === m.goalsAgainst) { r.pe += 1; r.pts += 1 }
    else { r.pp += 1 }
  }

  return Array.from(table.values()).sort((a, b) => {
    if (b.pts !== a.pts) return b.pts - a.pts
    if (b.dg !== a.dg) return b.dg - a.dg
    return b.gf - a.gf
  })
}

function nextFixtures(limit = 5) {
  const now = new Date()
  const rows: { key: string; date: Date; teamName: string; opponent: string; location?: string; slug: string }[] = []

  for (const m of MATCHES) {
    const team = TEAMS.find(t => t.id === m.teamId)
    if (!team) continue
    const d = new Date(m.date)
    if (d >= now) {
      rows.push({
        key: `${team.slug}|${m.opponent}|${m.date}`,
        date: d,
        teamName: team.name,
        opponent: m.opponent,
        location: m.location,
        slug: team.slug,
      })
    }
  }

  return rows.sort((a, b) => a.date.getTime() - b.date.getTime()).slice(0, limit)
}

export default function Home() {
  const year = new Date().getFullYear()
  const fixtures = nextFixtures(5)
  const table = computeStandings()

  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen p-8 gap-8 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-white">
      {/* MAIN */}
      <main className="flex flex-col gap-8 row-start-2 w-full max-w-6xl">
        {/* Hero (tu diseño) */}
        <section className="flex flex-col items-center sm:items-start gap-6">
          <Image
            className="rounded-full"
            src="/logo.jpg"  // asegúrate de tenerlo en /public
            alt="San Fernando Logo"
            width={180}
            height={180}
            priority
          />
          <h1 className="text-3xl font-bold text-blue-600">
            Bienvenidos a la Liga Barrial <span className="uppercase">San Fernando</span>
          </h1>
          <p className="text-center sm:text-left text-lg text-black">
            Toda la información oficial sobre equipos, jugadores, partidos y más.
          </p>

          <div className="flex gap-4 items-center flex-col sm:flex-row">
            <Link
              className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-blue-700 text-white hover:bg-blue-900 text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
              href="/equipos"
            >
              Ver Equipos
            </Link>
            <Link
              className="rounded-full border border-solid border-blue-700 text-blue-700 hover:bg-blue-100 transition-colors flex items-center justify-center text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
              href="/equipos/united/partidos"
            >
              Próximos Partidos
            </Link>
          </div>
        </section>

        {/* Grid con Próximos partidos y Tabla */}
        <section className="grid gap-6 md:grid-cols-5 text-black">
          {/* Próximos Partidos */}
          <div className="md:col-span-3 rounded-2xl border p-5">
            <h2 className="text-lg font-semibold mb-3">Próximos partidos</h2>
            {fixtures.length === 0 ? (
              <div className="text-sm opacity-70">No hay partidos programados.</div>
            ) : (
              <ul className="divide-y">
                {fixtures.map(f => (
                  <li key={f.key} className="py-3 flex items-center justify-between">
                    <div className="min-w-0">
                      <div className="font-medium truncate">{f.teamName} vs {f.opponent}</div>
                      <div className="text-sm opacity-70">{f.location ?? "Por definir"}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm">{f.date.toLocaleDateString()}</div>
                      <Link className="text-xs text-blue-600 hover:underline" href={`/equipos/${f.slug}/partidos`}>
                        Ver equipo
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Tabla de posiciones */}
          <div className="md:col-span-2 rounded-2xl border p-5 text-black">
            <h2 className="text-lg font-semibold mb-3">Tabla de posiciones</h2>
            {table.length === 0 ? (
              <div className="text-sm opacity-70">Sin datos</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left">
                      <th className="p-2">#</th>
                      <th className="p-2">Equipo</th>
                      <th className="p-2">PJ</th>
                      <th className="p-2">PTS</th>
                      <th className="p-2 hidden md:table-cell">DG</th>
                    </tr>
                  </thead>
                  <tbody>
                    {table.map((r, i) => {
                      const team = TEAMS.find(t => t.id === r.teamId)!
                      return (
                        <tr key={r.teamId} className="border-t">
                          <td className="p-2">{i + 1}</td>
                          <td className="p-2">
                            <Link className="hover:underline" href={`/equipos/${team.slug}`}>
                              {r.name}
                            </Link>
                          </td>
                          <td className="p-2">{r.pj}</td>
                          <td className="p-2 font-semibold">{r.pts}</td>
                          <td className="p-2 hidden md:table-cell">{r.dg}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
            <div className="mt-3 text-right">
              <Link className="text-xs text-blue-600 hover:underline" href="/equipos">
                Ver todos los equipos
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center text-black">
        <p className="text-sm text-center">
          © {year} San Fernando - Todos los derechos reservados
        </p>
      </footer>
    </div>
  )
}
