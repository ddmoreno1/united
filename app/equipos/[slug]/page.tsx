'use client'
import { useTeam } from '@/lib/team-context'

export default function TeamDashboard() {
  const { team, matches, players } = useTeam()
  if (!team) return <div className="text-red-600">Equipo no encontrado.</div>
  const nextMatch = matches.find(m => new Date(m.date) >= new Date())

  return (
    <div className="grid gap-4 md:grid-cols-3 text-black">
      <div className="rounded-2xl border p-4 md:col-span-2">
        <h2 className="mb-2 text-lg font-medium">Próximo partido</h2>
        {nextMatch ? (
          <div className="text-sm text-black">
            <div className="text-xl font-semibold text-black">{team.name} vs {nextMatch.opponent}</div>
            <div>{new Date(nextMatch.date).toLocaleDateString()}</div>
            {nextMatch.location && <div className="opacity-70">{nextMatch.location}</div>}
          </div>
        ) : <div className="opacity-70">Sin partidos programados.</div>}
      </div>

      <div className="rounded-2xl border p-4">
        <h2 className="mb-2 text-lg font-medium">Plantel</h2>
        <div className="text-sm opacity-70">{players.length} jugadores</div>
      </div>
    </div>
  )
}
