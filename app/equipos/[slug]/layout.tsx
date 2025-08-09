import { ReactNode } from "react"
import { TeamProvider } from "@/lib/team-context"
import TeamHeader from "@/components/TeamHeader"
import Link from "next/link"

interface LayoutProps {
  children: ReactNode
  params: { slug: string }
}

export default function TeamLayout({ children, params }: LayoutProps) {
  return (
    <TeamProvider slug={params.slug}>
      <div className="mx-auto max-w-5xl p-4">
        <TeamHeader slug={params.slug} />
        <nav className="mt-4 flex gap-3 border-b pb-2 text-sm">
          <Link href={`/equipos/${params.slug}`} className="hover:underline">Dashboard</Link>
          <Link href={`/equipos/${params.slug}/plantel`} className="hover:underline">Plantel</Link>
          <Link href={`/equipos/${params.slug}/partidos`} className="hover:underline">Partidos</Link>
          <Link href={`/equipos/${params.slug}/estadisticas`} className="hover:underline">Estadísticas</Link>
        </nav>
        <main className="py-6">{children}</main>
      </div>
    </TeamProvider>
  )
}
