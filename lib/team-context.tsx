'use client'
import React, { createContext, useContext, useEffect, useState, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import type { Team, Player, Match } from '@/lib/types'

type TeamData = { team?: Team; players: Player[]; matches: Match[] }
const TeamContext = createContext<TeamData | null>(null)

export function useTeam() {
  const ctx = useContext(TeamContext)
  if (!ctx) throw new Error('useTeam debe usarse dentro de <TeamProvider/>')
  return ctx
}

export function TeamProvider({ slug, children }: { slug: string; children: React.ReactNode }) {
  const [team, setTeam] = useState<Team | undefined>()
  const [players, setPlayers] = useState<Player[]>([])
  const [matches, setMatches] = useState<Match[]>([])

  useEffect(() => {
    async function load() {
      // 1) equipo por slug (alias crest_url -> crestUrl)
      const { data: t, error: teamErr } = await supabase
        .from('teams')
        .select('id, name, slug, crestUrl:crest_url')
        .eq('slug', slug)
        .maybeSingle()
      if (teamErr) console.error(teamErr)
      if (!t) {
        setTeam(undefined)
        setPlayers([])
        setMatches([])
        return
      }
      setTeam(t as Team)

      // 2) jugadores (team_id -> teamId)
      const { data: ps, error: pErr } = await supabase
        .from('players')
        .select('id, teamId:team_id, number, name, position')
        .eq('team_id', t.id)
        .order('number', { ascending: true })
      if (pErr) console.error(pErr)
      setPlayers((ps ?? []) as Player[])

      // 3) partidos (team_id, goals_for/against -> camelCase)
      const { data: ms, error: mErr } = await supabase
        .from('matches')
        .select('id, teamId:team_id, opponent, date, location, goalsFor:goals_for, goalsAgainst:goals_against, status')
        .eq('team_id', t.id)
        .order('date', { ascending: true })
      if (mErr) console.error(mErr)
      setMatches((ms ?? []) as Match[])
    }
    load()
  }, [slug])

  const value = useMemo<TeamData>(() => ({ team, players, matches }), [team, players, matches])
  return <TeamContext.Provider value={value}>{children}</TeamContext.Provider>
}
