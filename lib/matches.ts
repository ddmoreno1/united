import { supabase } from '@/lib/supabase'

export type UpcomingMatch = {
  id: string
  date: string
  location: string | null
  status: string
  goalsFor: number
  goalsAgainst: number
  opponent: string
  team: {
    id: string
    name: string
    slug: string
    crestUrl: string | null
  }
}

export async function getUpcomingMatches(limit = 10): Promise<UpcomingMatch[]> {
  const { data, error } = await supabase
    .from('matches')
    .select(`
      id,
      date,
      location,
      status,
      goalsFor:goals_for,
      goalsAgainst:goals_against,
      opponent,
      team:teams!matches_team_id_fkey (
        id, name, slug, crestUrl:crest_url
      )
    `)
    .eq('status', 'scheduled')
    .gte('date', new Date().toISOString())
    .order('date', { ascending: true })
    .limit(limit)
    .returns<UpcomingMatch[]>()

  if (error) {
    console.error('[getUpcomingMatches]', error)
    return []
  }
  return data ?? []
}
