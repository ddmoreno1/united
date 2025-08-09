'use client'
import { useTeam } from '@/lib/team-context'

export default function EstadisticasPage() {
  const { team, matches } = useTeam()
  if (!team) return <div>Equipo no encontrado.</div>

  const pj = matches.length
  const pg = matches.filter(m => m.goalsFor > m.goalsAgainst).length
  const pe = matches.filter(m => m.goalsFor === m.goalsAgainst).length
  const pp = matches.filter(m => m.goalsFor < m.goalsAgainst).length
  const gf = matches.reduce((s,m)=>s+m.goalsFor,0)
  const gc = matches.reduce((s,m)=>s+m.goalsAgainst,0)
  const dg = gf - gc

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Estadísticas — {team.name}</h2>
      <div className="grid gap-3 md:grid-cols-3">
        {[
          { label: 'PJ', value: pj },
          { label: 'PG', value: pg },
          { label: 'PE', value: pe },
          { label: 'PP', value: pp },
          { label: 'GF', value: gf },
          { label: 'GC', value: gc },
          { label: 'DG', value: dg },
        ].map(k => (
          <div key={k.label} className="rounded-xl border p-4">
            <div className="text-sm opacity-70">{k.label}</div>
            <div className="text-2xl font-semibold">{k.value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
