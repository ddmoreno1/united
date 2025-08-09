'use client'
import { useTeam } from '@/lib/team-context'

export default function PartidosPage() {
  const { team, matches } = useTeam()
  if (!team) return <div>Equipo no encontrado.</div>

  return (
    <div className="space-y-4 text-black">
      <h2 className="text-xl font-semibold text-black">Partidos — {team.name}</h2>
      <div className="rounded-xl border text-black">
        <table className="w-full text-sm text-black">
          <thead>
            <tr className="text-left text-black">
              <th className="p-3">Fecha</th>
              <th className="p-3">Rival</th>
              <th className="p-3">Lugar</th>
              <th className="p-3">Marcador</th>
            </tr>
          </thead>
          <tbody>
            {matches.map(m => (
              <tr key={m.id} className="border-t text-black">
                <td className="p-3">{new Date(m.date).toLocaleDateString()}</td>
                <td className="p-3">{m.opponent}</td>
                <td className="p-3">{m.location ?? '—'}</td>
                <td className="p-3">{m.goalsFor} - {m.goalsAgainst}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
