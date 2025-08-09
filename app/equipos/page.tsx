import Link from 'next/link'
import { TEAMS } from '@/lib/mock'

export default function EquiposIndex() {
  return (
    <div className="space-y-4 text-black">
      <h1 className="text-2xl font-semibold">Elige un equipo</h1>
      <ul className="grid gap-3 md:grid-cols-3">
        {TEAMS.map(t => (
          <li key={t.id} className="rounded-xl border p-4">
            <div className="font-medium">{t.name}</div>
            <Link className="text-blue-600 hover:underline text-sm" href={`/equipos/${t.slug}`}>Abrir</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
