'use client'
import React, { createContext, useContext, useMemo } from 'react'
import { TEAMS, PLAYERS, MATCHES, Team, Player, Match } from './mock'

type TeamData = { team?: Team; players: Player[]; matches: Match[] }
const TeamContext = createContext<TeamData | null>(null)

export function useTeam() {
  const ctx = useContext(TeamContext)
  if (!ctx) throw new Error('useTeam debe usarse dentro de <TeamProvider/>')
  return ctx
}

export function TeamProvider({ slug, children }: { slug: string; children: React.ReactNode }) {
  const value = useMemo<TeamData>(() => {
    const team = TEAMS.find(t => t.slug === slug)
    if (!team) return { team: undefined, players: [], matches: [] }
    return {
      team,
      players: PLAYERS.filter(p => p.teamId === team.id),
      matches: MATCHES.filter(m => m.teamId === team.id).sort((a,b)=>a.date.localeCompare(b.date)),
    }
  }, [slug])

  return <TeamContext.Provider value={value}>{children}</TeamContext.Provider>
}
