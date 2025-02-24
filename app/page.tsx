import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        {/* Logo personalizado del equipo */}
        <Image
          className="rounded-full"
          src="/logo_united.png"  // Cambia esto si tienes un logo
          alt="United Family Logo"
          width={180}
          height={180}
          priority
        />

        {/* Mensaje de bienvenida */}
        <h1 className="text-3xl font-bold text-blue-600">
          Bienvenidos a United Family
        </h1>
        <p className="text-center sm:text-left text-lg">
          Toda la información oficial sobre jugadores, partidos y más.
        </p>

        {/* Botones de navegación rápida */}
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-blue-700 text-white hover:bg-blue-900 text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="/jugadores"
          >
            Ver Jugadores
          </a>
          <a
            className="rounded-full border border-solid border-blue-700 text-blue-700 hover:bg-blue-100 transition-colors flex items-center justify-center text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="/partidos"
          >
            Próximos Partidos
          </a>
        </div>
      </main>

      {/* Pie de página personalizado */}
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <p className="text-sm text-center">
          © {new Date().getFullYear()} United Family - Todos los derechos reservados
        </p>
      </footer>
    </div>
  );
}
