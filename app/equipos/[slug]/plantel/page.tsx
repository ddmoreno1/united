'use client'
import { useTeam } from '@/lib/team-context'

export default function PlantelPage() {
  const { team, players } = useTeam()
  if (!team) return <div>Equipo no encontrado.</div>
  return (
    <div className="space-y-4 text-black">
      <h2 className="text-xl font-semibold">Plantel — {team.name}</h2>
      <ul className="grid gap-2 md:grid-cols-2">
        {players.map(p => (
          <li key={p.id} className="rounded-xl border p-3">
            <div className="flex items-center justify-between">
              <span className="font-medium">#{p.number ?? '—'} {p.name}</span>
              {p.position && <span className="text-xs opacity-70">{p.position}</span>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
