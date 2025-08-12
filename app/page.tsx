import Image from "next/image";
import Link from "next/link";
import { getUpcomingMatches } from "@/lib/matches";
import { getStandings } from "@/lib/standings";

function formatDate(d: Date) {
  try {
    return new Intl.DateTimeFormat("es-EC", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    }).format(d);
  } catch {
    return d.toLocaleDateString();
  }
}

export default async function Home() {
  const year = new Date().getFullYear();
  const fixtures = await getUpcomingMatches(5);
  const table = await getStandings();

  return (
    <div className="min-h-dvh text-black bg-[#4DE6E2]/10 sm:px-0 lg:px-8">
      <div className="container mx-auto p-0 grid grid-rows-[auto_1fr_auto] min-h-dvh ">
        {/* MAIN */}
        <main className="row-start-2 py-8 sm:py-12">
          {/* Hero */}
          <section className="flex flex-col items-center sm:items-start gap-5 sm:gap-6 text-center sm:text-left">
            <Image
              className="rounded-full ring-1 ring-black/10"
              src="/logo.jpg"
              alt="Logo San Fernando"
              width={180}
              height={180}
              priority
              sizes="(max-width: 640px) 96px, 180px"
            />
            <h1 className="font-bold text-3xl sm:text-4xl md:text-5xl leading-tight text-blue-700">
              Bienvenidos a la Liga Barrial <span className="uppercase">San Fernando</span>
            </h1>
            <p className="text-base sm:text-lg max-w-2xl opacity-90">
              Toda la información oficial sobre equipos, jugadores, partidos y más.
            </p>

            <div className="w-full flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link
                className="w-full sm:w-auto rounded-full border border-transparent transition-colors inline-flex items-center justify-center bg-blue-700 text-white hover:bg-blue-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 text-sm sm:text-base h-11 sm:h-12 px-5"
                href="/equipos"
              >
                Ver Equipos
              </Link>
              <Link
                className="w-full sm:w-auto rounded-full border border-blue-700 text-blue-700 hover:bg-blue-100 transition-colors inline-flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 text-sm sm:text-base h-11 sm:h-12 px-5"
                href="/equipos/racing/partidos"
              >
                Próximos Partidos
              </Link>
            </div>
          </section>

          {/* Contenido principal */}
          <section className="mt-10 grid gap-6 md:grid-cols-5 px-4">
            {/* Próximos Partidos */}
            <div className="md:col-span-3 rounded-2xl border border-black/10 bg-white p-4 sm:p-5 shadow-sm">
              <h2 className="text-lg font-semibold mb-3">Próximos partidos</h2>
              {fixtures.length === 0 ? (
                <div className="text-sm opacity-70">No hay partidos programados.</div>
              ) : (
                <ul className="divide-y">
                  {fixtures.map((f) => {
                    const dateObj = new Date(f.date);
                    return (
                      <li key={f.id} className="py-3 flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="font-medium truncate">
                            {f.team.name} <span className="opacity-60">vs</span> {f.opponent}
                          </div>
                          <div className="text-sm opacity-70 truncate">
                            {f.location ?? "Por definir"}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-sm">{formatDate(dateObj)}</div>
                          <Link
                            className="text-xs text-blue-700 hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 rounded"
                            href={`/equipos/${f.team.slug}/partidos`}
                          >
                            Ver equipo
                          </Link>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* Tabla de posiciones */}
            <div className="md:col-span-2 rounded-2xl border border-black/10 bg-white p-4 sm:p-5 shadow-sm">
              <h2 className="text-lg font-semibold mb-3">Tabla de posiciones</h2>

              {/* Móvil */}
              <div className="space-y-2 md:hidden" aria-label="Tabla de posiciones (móvil)">
                {table.length === 0 ? (
                  <div className="text-sm opacity-70">Sin datos</div>
                ) : (
                  table.map((r, i) => (
                    <div key={r.teamId} className="flex items-center justify-between rounded-xl border p-3">
                      <div className="min-w-0">
                        <div className="text-xs opacity-70">#{i + 1}</div>
                        <Link className="font-medium hover:underline truncate" href={`/equipos/${r.slug}`}>
                          {r.name}
                        </Link>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold">{r.pts} pts</div>
                        <div className="text-xs opacity-70">PJ {r.pj} · DG {r.dg}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Desktop */}
              <div className="hidden md:block overflow-x-auto">
                {table.length === 0 ? (
                  <div className="text-sm opacity-70">Sin datos</div>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left">
                        <th className="p-2">#</th>
                        <th className="p-2">Equipo</th>
                        <th className="p-2">PJ</th>
                        <th className="p-2">PTS</th>
                        <th className="p-2">DG</th>
                      </tr>
                    </thead>
                    <tbody>
                      {table.map((r, i) => (
                        <tr key={r.teamId} className="border-t">
                          <td className="p-2">{i + 1}</td>
                          <td className="p-2">
                            <Link className="hover:underline" href={`/equipos/${r.slug}`}>
                              {r.name}
                            </Link>
                          </td>
                          <td className="p-2">{r.pj}</td>
                          <td className="p-2 font-semibold">{r.pts}</td>
                          <td className="p-2">{r.dg}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              <div className="mt-3 text-right">
                <Link className="text-xs text-blue-700 hover:underline" href="/tabla">
                  Ver tabla completa
                </Link>
              </div>
            </div>
          </section>
        </main>

        {/* FOOTER */}
        <footer className="row-start-3 py-6">
          <p className="text-sm text-center">© {year} San Fernando - Todos los derechos reservados</p>
        </footer>
      </div>
    </div>
  );
}
