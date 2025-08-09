// lib/mock.ts
export type Team = { id: string; name: string; slug: string; crestUrl?: string }
export type Player = { id: string; teamId: string; number?: number; name: string; position?: string }
export type Match = { id: string; teamId: string; opponent: string; date: string; location?: string; goalsFor: number; goalsAgainst: number }

export const TEAMS: Team[] = [
  { id: 't1', name: 'United Family', slug: 'united', crestUrl: '/logo_united.png' },
  { id: 't2', name: 'Atlético Norte', slug: 'atletico-norte' },
  { id: 't3', name: 'Deportivo Sur', slug: 'deportivo-sur' },
]

export const PLAYERS: Player[] = [
  { id: 'p1', teamId: 't1', number: 9,  name: 'Carlos Peña', position: 'DEL' },
  { id: 'p2', teamId: 't1', number: 10, name: 'Luis Vera',   position: 'MED' },
  { id: 'p3', teamId: 't2', number: 1,  name: 'Franco Soto', position: 'POR' },
  { id: 'p4', teamId: 't3', number: 4,  name: 'Julián Ríos', position: 'DEF' },
]

export const MATCHES: Match[] = [
  { id: 'm1', teamId: 't1', opponent: 'Atlético Norte', date: '2025-08-15', goalsFor: 2, goalsAgainst: 1, location: 'Estadio Central' },
  { id: 'm2', teamId: 't1', opponent: 'Deportivo Sur',  date: '2025-08-22', goalsFor: 0, goalsAgainst: 0, location: 'Estadio Sur' },
  { id: 'm3', teamId: 't2', opponent: 'United Family',  date: '2025-08-15', goalsFor: 1, goalsAgainst: 2, location: 'Estadio Central' },
]
