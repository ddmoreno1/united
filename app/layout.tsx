import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./Navbar"; // Importa el Navbar desde otro archivo

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "San Fernando",
  description: "Sitio oficial de la Liga Barrial San Fernando",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-200`}
      >
        <Navbar /> {/* Navbar separado */}
        <main className="pt-24 p-10">{children}</main>
      </body>
    </html>
  );
}
