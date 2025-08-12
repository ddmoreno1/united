// /components/Standings.tsx
'use client'

import Link from 'next/link'
import Image from 'next/image'
import * as React from 'react'
import type { StandingRow } from '@/lib/standings'

type Props = {
  rows: StandingRow[]
  variant?: 'full' | 'compact' // compact para el Home
}

export default function Standings({ rows, variant = 'full' }: Props) {
  if (!rows.length) {
    return (
      <div className="rounded-2xl border border-black/10 bg-white p-4 sm:p-5 shadow-sm">
        <div className="text-sm opacity-70">Sin datos</div>
      </div>
    )
  }

  // Desktop (tabla completa o compacta)
  return (
    <div className="rounded-2xl border border-black/10 bg-white shadow-sm overflow-hidden">
      <div className="hidden md:block">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-gradient-to-b from-gray-50 to-white border-b">
            <tr className="text-left">
              <Th>#</Th>
              <Th>Equipo</Th>
              <Th>PJ</Th>
              {variant === 'full' && (<>
                <Th>PG</Th><Th>PE</Th><Th>PP</Th><Th>GF</Th><Th>GC</Th>
              </>)}
              <Th>DG</Th>
              <Th>PTS</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.teamId} className="border-t hover:bg-sky-50/50 transition-colors">
                <Td>
                  <RankBadge rank={i + 1} />
                </Td>
                <Td>
                  <Link href={`/equipos/${r.slug}`} className="flex items-center gap-2 group">
                    <Image
                      src={r.crestUrl ?? '/placeholder-crest.svg'}
                      alt={r.name}
                      width={22}
                      height={22}
                      className="rounded bg-white ring-1 ring-black/5"
                    />
                    <span className="group-hover:underline">{r.name}</span>
                  </Link>
                </Td>
                <Td>{r.pj}</Td>
                {variant === 'full' && (<>
                  <Td>{r.pg}</Td><Td>{r.pe}</Td><Td>{r.pp}</Td><Td>{r.gf}</Td><Td>{r.gc}</Td>
                </>)}
                <Td className={r.dg > 0 ? 'text-green-600' : r.dg < 0 ? 'text-red-600' : ''}>{r.dg}</Td>
                <Td className="font-semibold">{r.pts}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Móvil (cards) */}
      <div className="md:hidden divide-y">
        {rows.map((r, i) => (
          <div key={r.teamId} className="p-3 bg-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <RankBadge rank={i + 1} />
                <Image
                  src={r.crestUrl ?? '/placeholder-crest.svg'}
                  alt={r.name}
                  width={28}
                  height={28}
                  className="rounded bg-white ring-1 ring-black/5"
                />
                <Link href={`/equipos/${r.slug}`} className="font-medium truncate hover:underline">
                  {r.name}
                </Link>
              </div>
              <div className="text-right">
                <div className="text-base font-semibold">{r.pts} pts</div>
                <div className="text-xs opacity-70">PJ {r.pj} · DG {r.dg}</div>
              </div>
            </div>

            {variant === 'full' && (
              <div className="mt-2 grid grid-cols-6 text-[11px] gap-2">
                <StatBadge label="PG" value={r.pg} />
                <StatBadge label="PE" value={r.pe} />
                <StatBadge label="PP" value={r.pp} />
                <StatBadge label="GF" value={r.gf} />
                <StatBadge label="GC" value={r.gc} />
                <StatBadge label="DG" value={r.dg} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="p-2 text-[12px] font-semibold text-gray-700">{children}</th>
}
function Td({ children, className }: { children: React.ReactNode; className?: string }) {
  return <td className={`p-2 align-middle ${className ?? ''}`}>{children}</td>
}

function RankBadge({ rank }: { rank: number }) {
  // Estilos: 1–4 azul, 5–8 gris, resto neutro (ajusta a tu gusto)
  const base = 'inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold'
  const cls =
    rank <= 4 ? 'bg-blue-600 text-white' :
    rank <= 8 ? 'bg-gray-200 text-gray-800' :
    'bg-gray-100 text-gray-700'
  return <span className={`${base} ${cls}`}>{rank}</span>
}

function StatBadge({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border px-2 py-1 text-center">
      <div className="text-[10px] opacity-60">{label}</div>
      <div className="text-xs font-semibold">{value}</div>
    </div>
  )
}
