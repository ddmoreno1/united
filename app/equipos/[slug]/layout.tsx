import { ReactNode } from "react"
import { TeamProvider } from "@/lib/team-context"
import TeamHeader from "@/components/TeamHeader"
import Link from "next/link"

type Params = { slug: string }

export default async function TeamLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<Params> // 👈 Next 15 genera tipos así
}) {
  const { slug } = await params // 👈 esperamos el Promise

  return (
    <TeamProvider slug={slug}>
      <div className="mx-auto max-w-5xl p-4">
        <TeamHeader slug={slug} />
        <nav className="mt-4 flex gap-3 border-b pb-2 text-sm">
          <Link href={`/equipos/${slug}`} className="hover:underline">Dashboard</Link>
          <Link href={`/equipos/${slug}/plantel`} className="hover:underline">Plantel</Link>
          <Link href={`/equipos/${slug}/partidos`} className="hover:underline">Partidos</Link>
          <Link href={`/equipos/${slug}/estadisticas`} className="hover:underline">Estadísticas</Link>
        </nav>
        <main className="py-6">{children}</main>
      </div>
    </TeamProvider>
  )
}
