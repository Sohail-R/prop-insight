'use client'

import { useEffect, useState } from 'react'

type Row = {
  label: string
  a: string
  b: string
  winner: 'a' | 'b'
}

const ROWS: Row[] = [
  { label: 'Price / sqft', a: '$372', b: '$323', winner: 'b' },
  { label: 'Est. mortgage', a: '$4,710 / mo', b: '$4,470 / mo', winner: 'b' },
  { label: 'Property tax (annual)', a: '$13,420', b: '$10,890', winner: 'b' },
  { label: 'Walk Score', a: '78', b: '64', winner: 'a' },
  { label: 'School rating', a: '8 / 10', b: '9 / 10', winner: 'b' },
  { label: 'Year built', a: '1992', b: '2008', winner: 'b' },
]

export function Preview() {
  // Sweep through rows highlighting the current "active" comparison
  const [activeRow, setActiveRow] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setActiveRow(r => (r + 1) % ROWS.length)
    }, 1500)
    const onVis = () => {
      if (document.hidden) clearInterval(id)
    }
    document.addEventListener('visibilitychange', onVis)
    return () => {
      clearInterval(id)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [])

  return (
    <section className="border-b-2 border-ink bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-12">
          <div>
            <p className="eyebrow mb-6 inline-flex items-center gap-2.5">
              <span className="inline-block w-2 h-2 rotate-45 bg-accent" />
              A look inside
            </p>
            <h2 className="font-display text-5xl sm:text-7xl text-foreground tracking-tight leading-[0.95] text-balance max-w-3xl">
              The verdict, <em>instantly</em>.
            </h2>
          </div>
          <p className="label-soft max-w-sm leading-relaxed">
            <span className="font-display text-foreground text-xl mr-2 align-baseline">↓</span>
            A real comparison rendered live in the dashboard
          </p>
        </div>

        {/* Mock comparison panel */}
        <div className="border-2 border-ink bg-card overflow-hidden shadow-[8px_8px_0_0_var(--foreground)]">
          {/* Top bar */}
          <div className="flex items-center justify-between border-b-2 border-ink px-5 py-3 bg-muted">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 border-2 border-ink rounded-full bg-card" />
              <span className="w-3 h-3 border-2 border-ink rounded-full bg-card" />
              <span className="w-3 h-3 border-2 border-ink rounded-full bg-accent" />
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground">
              propinsight / dashboard
            </span>
            <span className="w-3" />
          </div>

          {/* Header row */}
          <div className="grid grid-cols-2 border-b-2 border-ink">
            <div className="p-6 border-r-2 border-ink">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-3 h-3 rotate-45 bg-foreground" />
                <span className="eyebrow">Property 01</span>
              </div>
              <p className="font-display text-2xl text-foreground leading-tight">
                412 Birchwood Lane
              </p>
              <p className="text-sm text-muted-foreground">Austin, TX 78704</p>
              <p className="font-display text-3xl text-foreground mt-3 tabular-nums">$685,000</p>
              <p className="font-mono text-xs text-muted-foreground mt-1">
                3 bd · 2 ba · 1,840 sqft
              </p>
            </div>
            <div className="p-6 relative">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-3 h-3 rotate-45 bg-accent ring-2 ring-foreground" />
                <span className="eyebrow">Property 02</span>
              </div>
              <p className="font-display text-2xl text-foreground leading-tight">
                89 Linden Crescent
              </p>
              <p className="text-sm text-muted-foreground">Austin, TX 78745</p>
              <p className="font-display text-3xl text-foreground mt-3 tabular-nums">$649,000</p>
              <p className="font-mono text-xs text-muted-foreground mt-1">
                3 bd · 2.5 ba · 2,010 sqft
              </p>
            </div>
          </div>

          {/* Comparison rows */}
          <div className="divide-y-2 divide-foreground">
            {ROWS.map((row, idx) => {
              const isActive = idx === activeRow
              return (
                <div
                  key={row.label}
                  className="grid grid-cols-[1fr_2fr] sm:grid-cols-[1.2fr_1fr_1fr] transition-colors duration-500"
                >
                  <div
                    className={`px-6 py-4 font-mono text-xs uppercase tracking-[0.18em] border-r-2 border-ink flex items-center transition-colors duration-500 ${
                      isActive ? 'text-foreground bg-muted' : 'text-muted-foreground'
                    }`}
                  >
                    {row.label}
                  </div>
                  <div
                    className={`px-6 py-4 font-display text-xl border-r-2 border-ink flex items-center justify-between transition-all duration-500 tabular-nums ${
                      row.winner === 'a' && isActive
                        ? 'bg-accent text-foreground'
                        : row.winner === 'a'
                          ? 'bg-accent/30 text-foreground'
                          : 'text-foreground/80'
                    }`}
                  >
                    <span>{row.a}</span>
                    {row.winner === 'a' && (
                      <span
                        className={`font-mono text-[10px] uppercase tracking-[0.2em] text-foreground border-2 border-ink px-1.5 py-0.5 transition-all duration-500 ${
                          isActive ? 'bg-card scale-110' : 'bg-card scale-100'
                        }`}
                      >
                        Win
                      </span>
                    )}
                  </div>
                  <div
                    className={`px-6 py-4 font-display text-xl flex items-center justify-between transition-all duration-500 tabular-nums ${
                      row.winner === 'b' && isActive
                        ? 'bg-accent text-foreground'
                        : row.winner === 'b'
                          ? 'bg-accent/30 text-foreground'
                          : 'text-foreground/80'
                    }`}
                  >
                    <span>{row.b}</span>
                    {row.winner === 'b' && (
                      <span
                        className={`font-mono text-[10px] uppercase tracking-[0.2em] text-foreground border-2 border-ink px-1.5 py-0.5 transition-all duration-500 ${
                          isActive ? 'bg-card scale-110' : 'bg-card scale-100'
                        }`}
                      >
                        Win
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Verdict bar */}
          <div className="border-t-2 border-ink bg-foreground text-background px-6 py-5 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-background/60">
                Verdict
              </span>
              <span className="font-display text-xl">
                Property 02 wins on 5 of 6 metrics.
              </span>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
              Better value · Lower carry
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
