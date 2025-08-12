

'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'


import type { Team } from '@/lib/types'

export default function EquiposIndex() {
  const [teams, setTeams] = useState<Team[]>([])

  useEffect(() => {
    supabase
      .from('teams')
      .select('id, name, slug, crestUrl:crest_url')
      .order('name', { ascending: true })
      .then(({ data }) => setTeams((data ?? []) as Team[]))
  }, [])



  return (
    <div className="space-y-4 text-black">
      <h1 className="text-2xl font-semibold">Elige un equipo</h1>
      <ul className="grid gap-3 md:grid-cols-3">


        {teams.map(t => (
          <li key={t.id} className="rounded-xl border p-4">
            <div className="font-medium">{t.name}</div>
            <Link className="text-blue-600 hover:underline text-sm" href={`/equipos/${t.slug}`}>Abrir</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
