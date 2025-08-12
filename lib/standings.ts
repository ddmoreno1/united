// /lib/standings.ts
import { supabase } from '@/lib/supabase'

export type StandingRow = {
  teamId: string
  slug: string
  name: string
  crestUrl: string | null
  pj: number
  pg: number
  pe: number
  pp: number
  gf: number
  gc: number
  dg: number
  pts: number
}

type TeamRow = { id: string; name: string; slug: string; crestUrl: string | null }
type MatchRow = { teamId: string; goalsFor: number | null; goalsAgainst: number | null; status: string }

export async function getStandings(): Promise<StandingRow[]> {
  // Equipos con escudo
  const { data: teams, error: tErr } = await supabase
    .from('teams')
    .select('id, name, slug, crestUrl:crest_url')
    .order('name', { ascending: true })
    .returns<TeamRow[]>()

  if (tErr) {
    console.error('[getStandings][teams]', tErr)
    return []
  }

  // Partidos finalizados (cuentan para team_id)
  const { data: matches, error: mErr } = await supabase
    .from('matches')
    .select('teamId:team_id, goalsFor:goals_for, goalsAgainst:goals_against, status')
    .eq('status', 'finished')
    .returns<MatchRow[]>()

  if (mErr) console.error('[getStandings][matches]', mErr)

  const table = new Map<string, StandingRow>()
  const ensure = (t: TeamRow) => {
    if (!table.has(t.id)) {
      table.set(t.id, {
        teamId: t.id, slug: t.slug, name: t.name, crestUrl: t.crestUrl ?? null,
        pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dg: 0, pts: 0,
      })
    }
    return table.get(t.id)!
  }

  for (const t of teams ?? []) ensure(t)

  for (const m of matches ?? []) {
    const r = table.get(m.teamId)
    if (!r) continue
    const gf = m.goalsFor ?? 0
    const gc = m.goalsAgainst ?? 0
    r.pj += 1
    r.gf += gf
    r.gc += gc
    r.dg = r.gf - r.gc
    if (gf > gc) { r.pg += 1; r.pts += 3 }
    else if (gf === gc) { r.pe += 1; r.pts += 1 }
    else { r.pp += 1 }
  }

  return Array.from(table.values()).sort((a, b) => {
    if (b.pts !== a.pts) return b.pts - a.pts
    if (b.dg !== a.dg) return b.dg - a.dg
    return b.gf - a.gf
  })
}
