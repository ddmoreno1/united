'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

// Tipos para la fila de goleador
interface TopScorer {
  player_id: string
  name: string
  team: string | null
  goals: number
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
)

export default function GoleadoresPage() {
  const [goleadores, setGoleadores] = useState<TopScorer[]>([])

  useEffect(() => {
    async function cargar() {
      const { data, error } = await supabase
        .from('top_scorers')
        .select('*')
        .order('goals', { ascending: false })

      if (!error && data) {
        setGoleadores(data as TopScorer[])
      }
    }
    cargar()
  }, [])

  return (
    <div className="p-4 text-black">
      <h1 className="text-2xl font-bold mb-4">Tabla de Goleadores</h1>
      <table className="w-full border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 text-left">Jugador</th>
            <th className="p-2 text-left">Equipo</th>
            <th className="p-2 text-center">Goles</th>
          </tr>
        </thead>
        <tbody>
          {goleadores.map((g) => (
            <tr key={g.player_id} className="border-t border-gray-300">
              <td className="p-2">{g.name}</td>
              <td className="p-2">{g.team || '-'}</td>
              <td className="p-2 text-center">{g.goals}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
