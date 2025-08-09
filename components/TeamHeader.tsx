'use client'
import TeamSwitcher from '@/components/TeamSwitcher'
import { useTeam } from '@/lib/team-context'
import Image from 'next/image'

export default function TeamHeader({ slug }: { slug: string }) {
  const { team } = useTeam()

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        {team?.crestUrl && (
          <Image
            src={team.crestUrl}
            alt={team.name}
            width={40}
            height={40}
            className="h-10 w-10 rounded-md"
            priority
          />
        )}
        <h1 className="text-2xl font-semibold">{team?.name ?? 'Equipo no encontrado'}</h1>
      </div>
      <TeamSwitcher currentSlug={slug}/>
    </div>
  )
}
