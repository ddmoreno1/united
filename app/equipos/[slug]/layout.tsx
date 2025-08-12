// app/equipos/[slug]/layout.tsx
import { ReactNode } from 'react'
import { TeamProvider } from '@/lib/team-context'
import TeamHeader from '@/components/TeamHeader'
import TeamTabs from '@/components/TeamTabs'

type Params = { slug: string }

export default async function TeamLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<Params> // Next 15 da params como Promise
}) {
  const { slug } = await params

  return (
    <TeamProvider slug={slug}>
      <div className="mx-auto max-w-5xl p-4 text-black">
        <TeamHeader slug={slug} />
        {/* Menú mejorado */}
        <TeamTabs slug={slug} />
        <main className="py-6">{children}</main>
      </div>
    </TeamProvider>
  )
}
