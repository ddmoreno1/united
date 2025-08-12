export type Team = {
  id: string
  name: string
  slug: string
  crestUrl?: string | null
}

export type Player = {
  id: string
  teamId: string
  number?: number | null
  name: string
  position?: string | null
}

export type Match = {
  id: string
  teamId: string
  opponent: string
  date: string // o Date si luego lo parseas
  location?: string | null
  goalsFor: number
  goalsAgainst: number
  status: string
}
