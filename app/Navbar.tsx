"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-gradient-to-b from-[#ffffff] to-[#77ACA2] text-black shadow-md p-4">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo a la izquierda */}
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/logo.jpg"
            alt="Logo San Fernando"
            width={60}
            height={60}
          />
          <span className="font-bold text-lg">San Fernando</span>
        </Link>

        {/* Menú desktop */}
        <div className="hidden md:flex space-x-6 text-[18px] text-black">
          <NavLink href="/" label="Inicio" />
          <NavLink href="/equipos/racing/plantel" label="Jugadores" />
          <NavLink href="/partidos" label="Partidos" />
          <NavLink href="/tabla" label="Tabla de Posiciones" />
          <NavLink href="/equipos" label="Equipos" />
          <NavLink href="/goleadores" label="Goleadores" />
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
  const handleCloseMenu = () => setIsOpen(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-black focus:outline-none"
      >
        <Image
          src="/menu.png"
          alt="Menú"
          width={30}
          height={30}
          className="hover:opacity-80 transition duration-200"
        />
      </button>

      <div
        className={`absolute top-16 right-0 w-1/2 bg-gradient-to-b from-white to-sky-300 shadow-2xl p-6 flex flex-col space-y-4 text-[18px] h-auto rounded-l-2xl transform transition-all duration-300 ease-in-out overflow-hidden
          sm:w-1/2 sm:rounded-r-2xl
          md:hidden lg:hidden xl:hidden 2xl:hidden
          ${isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}`}
      >
        <NavLink href="/" label="Inicio" onClick={handleCloseMenu} />
        <NavLink href="/equipos/racing/plantel" label="Jugadores" onClick={handleCloseMenu} />
        <NavLink href="/partidos" label="Partidos" onClick={handleCloseMenu} />
        <NavLink href="/tabla" label="Tabla de Posiciones" onClick={handleCloseMenu} />
        <NavLink href="/equipos" label="Equipos" onClick={handleCloseMenu} />
        <NavLink href="/goleadores" label="Goleadores" onClick={handleCloseMenu} />
      </div>
    </>
  );
}
