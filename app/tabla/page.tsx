// /app/tabla/page.tsx
import { getStandings } from '@/lib/standings'
import Standings from '@/components/Standings'

export const dynamic = 'force-dynamic' // opcional

export default async function TablaDePosicionesPage() {
  const table = await getStandings()
  return (
    <main className="container mx-auto px-4 py-8 text-black">
      <h1 className="text-2xl font-bold mb-6">Tabla de Posiciones</h1>
      <Standings rows={table} variant="full" />
    </main>
  )
}
