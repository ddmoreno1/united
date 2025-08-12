'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Team } from '@/lib/types'

export default function TeamSwitcher({ currentSlug }: { currentSlug: string }) {
  const pathname = usePathname()
  const tail = pathname?.split('/').slice(3).join('/') || ''
  const [teams, setTeams] = useState<Team[]>([])

  useEffect(() => {
    supabase.from('teams').select('*').order('name', { ascending: true }).then(({ data }) => setTeams((data ?? []) as Team[]))
  }, [])

  return (
    <div className="flex items-center gap-2 text-black">
      <span className="text-sm opacity-70">Equipo:</span>
      <div className="flex flex-wrap gap-2">
        {teams.map(t => (
          <Link
            key={t.id}
            href={`/equipos/${t.slug}${tail ? `/${tail}` : ''}`}
            className={`rounded-full border px-3 py-1 text-sm ${t.slug===currentSlug ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
          >
            {t.name}
          </Link>
        ))}
      </div>
    </div>
  )

}