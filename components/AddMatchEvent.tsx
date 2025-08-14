'use client'

import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

interface Player {
  id: string
  name: string
}

interface AddMatchEventProps {
  matchId: string
  teamId: string
  players: Player[]
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
)

const EVENT_TYPES = ['goal', 'own_goal', 'yellow_card', 'red_card'] as const
type EventType = typeof EVENT_TYPES[number]

export default function AddMatchEvent({ matchId, teamId, players }: AddMatchEventProps) {
  const [playerId, setPlayerId] = useState<string>('')
  const [minute, setMinute] = useState<number>(0)
  const [eventType, setEventType] = useState<EventType>('goal')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.from('match_events').insert([
      {
        match_id: matchId,
        team_id: teamId,
        player_id: playerId || null,
        minute,
        event_type: eventType
      }
    ])

    setLoading(false)
    if (error) {
      alert(`Error: ${error.message}`)
    } else {
      alert('Evento agregado')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded-lg flex flex-col gap-2">
      <label>Jugador</label>
      <select value={playerId} onChange={(e) => setPlayerId(e.target.value)}>
        <option value="">Sin jugador</option>
        {players.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>

      <label>Minuto</label>
      <input
        type="number"
        value={minute}
        onChange={(e) => setMinute(Number(e.target.value))}
      />

      <label>Evento</label>
      <select value={eventType} onChange={(e) => setEventType(e.target.value as EventType)}>
        {EVENT_TYPES.map((et) => (
          <option key={et} value={et}>
            {et}
          </option>
        ))}
      </select>

      <button type="submit" disabled={loading}>
        {loading ? 'Guardando...' : 'Agregar evento'}
      </button>
    </form>
  )
}
