// lib/mock.ts
export type Team = { id: string; name: string; slug: string; crestUrl?: string }
export type Player = { id: string; teamId: string; number?: number; name: string; position?: string }
export type Match = { id: string; teamId: string; opponent: string; date: string; location?: string; goalsFor: number; goalsAgainst: number }

export const TEAMS: Team[] = [
  { id: 't1', name: 'Racing', slug: 'Racing', crestUrl: '/racing.jpg' },
  { id: 't2', name: 'Atlético Libertad', slug: 'Atl-libertad' },
  { id: 't3', name: 'Marañon', slug: 'Marañon' },
  { id: 't4', name: 'Huracan', slug: 'Huracan' },
  { id: 't5', name: 'Ind. Gavilanes', slug: 'Ind-gavilanes' },
  { id: 't6', name: 'Juvenil America', slug: 'Juvenil-America' },
  { id: 't7', name: 'San Fernando', slug: 'San-Fernando' },
  { id: 't8', name: 'Por Definir 1', slug: 'Por-Definir-1' },
  { id: 't9', name: 'Por Definir 2', slug: 'Por-Definir-2' },
]

export const PLAYERS: Player[] = [
  { id: 'p1', teamId: 't1', number: 8,  name: 'Jimmy Loya', position: 'MED' },
  { id: 'p2', teamId: 't1', number: 21, name: 'Douglas Moreno',   position: 'DEL' },
  { id: 'p3', teamId: 't1', number: 10, name: 'Alfredo Moreno',   position: 'MED' },
  { id: 'p4', teamId: 't1', number: 11, name: 'Angel',   position: 'MED' },
  { id: 'p5', teamId: 't1', number: 5,  name: 'Bala', position: 'DEL' },
  { id: 'p6', teamId: 't1', number: 8,  name: 'Gato', position: 'MED' },
  { id: 'p7', teamId: 't1', number: 7,  name: 'Diego ', position: 'DEL' },
  { id: 'p8', teamId: 't1', number: 3,  name: 'Ronald', position: 'DEF' },
  { id: 'p9', teamId: 't2', number: 1,  name: 'Franco Soto', position: 'POR' },
  { id: 'p10', teamId: 't2', number: 4,  name: 'Julián Ríos', position: 'DEF' },
  { id: 'p11', teamId: 't2', number: 2,  name: 'Diego Torres', position: 'DEL' },
  { id: 'p12', teamId: 't3', number: 3,  name: 'Andrés Ruiz', position: 'DEF' },
  { id: 'p13', teamId: 't3', number: 9,  name: 'Carlos Pérez', position: 'DEL' },
  { id: 'p14', teamId: 't3', number: 6,  name: 'Luis Gómez', position: 'MED' },
  { id: 'p15', teamId: 't3', number: 10, name: 'Juan Pérez', position: 'MED' },
  { id: 'p16', teamId: 't4', number: 11, name: 'Pedro López', position: 'DEL' },
  { id: 'p17', teamId: 't4', number: 2,  name: 'Miguel Ángel', position: 'DEF' },
  { id: 'p18', teamId: 't4', number: 5,  name: 'Sergio Martínez', position: 'MED' },
  { id: 'p19', teamId: 't5', number: 7,  name: 'David Fernández', position: 'DEL' },
  { id: 'p20', teamId: 't6', number: 8,  name: 'Javier García', position: 'MED' },
  { id: 'p21', teamId: 't7', number: 9,  name: 'Roberto Sánchez', position: 'DEL' },
  { id: 'p22', teamId: 't8', number: 4,  name: 'Fernando Torres', position: 'DEF' },
]

export const MATCHES: Match[] = [
  { id: 'm1', teamId: 't1', opponent: 'Marañon', date: '2025-08-15', goalsFor: 2, goalsAgainst: 1, location: 'Estadio Central' },
  { id: 'm2', teamId: 't1', opponent: 'Atlético Libertad',  date: '2025-08-22', goalsFor: 0, goalsAgainst: 0, location: 'Estadio Sur' },
  { id: 'm3', teamId: 't2', opponent: 'Racing',  date: '2025-08-15', goalsFor: 1, goalsAgainst: 2, location: 'Estadio Central' },
  { id: 'm4', teamId: 't2', opponent: 'Huracan', date: '2025-08-22', goalsFor: 3, goalsAgainst: 1, location: 'Estadio Norte' },
  { id: 'm5', teamId: 't3', opponent: 'Ind. Gavilanes', date: '2025-08-15', goalsFor: 1, goalsAgainst: 1, location: 'Estadio Este' },
  { id: 'm6', teamId: 't3', opponent: 'Juvenil America', date: '2025-08-22', goalsFor: 2, goalsAgainst: 2, location: 'Estadio Oeste' },
  { id: 'm7', teamId: 't4', opponent: 'San Fernando', date: '2025-08-15', goalsFor: 0, goalsAgainst: 1, location: 'Estadio Central' },
  { id: 'm8', teamId: 't4', opponent: 'Por Definir 1', date: '2025-08-22', goalsFor: 2, goalsAgainst: 0, location: 'Estadio Sur' },
]
