"use client"; // Este solo es cliente

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-gradient-to-b from-white to-sky-300 text-black shadow-md p-4">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo a la izquierda */}
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/logo.jpg" // Asegúrate de tenerlo en la carpeta public
            alt="Logo San Fernando"
            width={60}
            height={60}
          />
          <span className="font-bold text-lg">San Fernando</span>
        </Link>

        {/* Menú adaptable en todas las resoluciones */}
        <div className="hidden md:flex space-x-6 text-[18px] text-black">

          <NavLink href="/" label="Inicio"  />
          <NavLink href="/equipos/Racing/plantel" label="Plantel"  />
          <NavLink href="/equipos/Racing/partidos" label="Partidos"/>
          <NavLink href="/equipos/Racing/estadisticas" label="Estadísticas"  />
          <NavLink href="/equipos" label="Equipos" />
        </div>

        {/* Menú hamburguesa en móviles */}
        <div className="md:hidden">
          <MobileMenu />
        </div>
      </div>
    </nav>
  );
}

function NavLink({
  href,
  label,
  onClick,
}: {
  href: string;
  label: string;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="px-4 py-2 rounded-lg transition-all duration-300 hover:bg-sky-400 hover:shadow-lg"
    >
      {label}
    </Link>
  );
}

function MobileMenu() {
    const [isOpen, setIsOpen] = useState(false);
  
    // Cierra el menú cuando se selecciona una opción
    const handleCloseMenu = () => {
      setIsOpen(false);
    };
  
    return (
      <>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-black focus:outline-none"
        >
          {/* Icono personalizado en lugar de ☰ */}
          <Image
            src="/menu.png" // Asegúrate de colocar la imagen en la carpeta public
            alt="Menú"
            width={30}
            height={30}
            className="hover:opacity-80 transition duration-200"
          />
        </button>
  
        {/* Animación de deslizamiento + desvanecimiento con borde redondeado y sombra mejorada */}
        <div
          className={`absolute top-16 right-0 w-1/2 bg-gradient-to-b from-white to-sky-300 shadow-2xl p-6 flex flex-col space-y-4 text-[18px] h-auto rounded-l-2xl transform transition-all duration-300 ease-in-out overflow-hidden
          sm:w-1/2 sm:rounded-r-2xl
          md:hidden
          lg:hidden
          xl:hidden
          2xl:hidden
          ${isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}`}
        >
          
          <NavLink href="/" label="Inicio" onClick={handleCloseMenu} />
          <NavLink href="/equipos/Racing/plantel" label="Plantel" onClick={handleCloseMenu} />
          <NavLink href="/equipos/Racing/partidos" label="Partidos" onClick={handleCloseMenu} />
          <NavLink href="/equipos/Racing/estadisticas" label="Estadísticas" onClick={handleCloseMenu} />
          <NavLink href="/equipos" label="Equipos" onClick={handleCloseMenu} />

        </div>
      </>
    );
  }
  
