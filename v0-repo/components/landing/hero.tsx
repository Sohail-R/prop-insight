'use client'

import Link from 'next/link'
import { useAnimatedNumber, useRotating } from '@/lib/use-animations'

const VERDICTS = ['better deal', 'lower taxes', 'cheaper sqft', 'shorter commute', 'higher walk score'] as const

export function Hero() {
  const { item: verdict, index: verdictIndex } = useRotating(VERDICTS, 2200)
  const priceA = useAnimatedNumber(847000, 1400, 200)
  const priceB = useAnimatedNumber(792500, 1400, 400)
  const sqftA = useAnimatedNumber(2140, 1200, 600)
  const sqftB = useAnimatedNumber(2480, 1200, 800)

  return (
    <section className="relative overflow-hidden border-b-2 border-ink">
      <div className="absolute inset-0 diamond-pattern" aria-hidden="true" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 sm:pt-16 sm:pb-20">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* LEFT: editorial copy */}
          <div className="lg:col-span-6">
            <div className="flex items-center gap-3 mb-8 rise-in">
              <span className="w-2 h-2 rotate-45 bg-accent" />
              <span className="font-display italic text-lg text-foreground">
                Property intelligence
              </span>
            </div>

            <h1 className="font-display text-foreground tracking-tight leading-[0.9] text-balance text-6xl sm:text-7xl lg:text-[5.5rem] xl:text-[6.5rem] rise-in" style={{ animationDelay: '120ms' }}>
              Two homes.
              <br />
              <em className="not-italic">One</em>{' '}
              <span className="relative inline-block align-baseline">
                <span aria-hidden className="invisible italic">shorter commute</span>
                <span
                  key={verdictIndex}
                  aria-live="polite"
                  className="absolute left-0 top-0 italic text-foreground"
                  style={{ animation: 'word-cycle 2.2s ease-in-out', animationFillMode: 'forwards' }}
                >
                  {verdict}
                </span>
              </span>
              .
            </h1>

            <p className="mt-8 text-foreground text-lg sm:text-xl leading-snug max-w-xl text-pretty rise-in" style={{ animationDelay: '320ms' }}>
              Paste any two Zillow links. PropInsight pulls 40+ data points and tells you which one wins &mdash; in under five seconds.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4 rise-in" style={{ animationDelay: '460ms' }}>
              <Link
                href="/dashboard"
                className="group inline-flex items-center gap-3 border-2 border-ink bg-foreground text-background px-6 py-4 text-sm font-semibold tracking-wide hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                Open the analyzer
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <a
                href="#how"
                className="inline-flex items-center gap-2 border-2 border-ink bg-card text-foreground px-6 py-4 text-sm font-semibold tracking-wide hover:bg-muted transition-colors"
              >
                See how it works
              </a>
            </div>
          </div>

          {/* RIGHT: thumbnail showpiece — versus comparison card */}
          <div className="lg:col-span-6 rise-in" style={{ animationDelay: '380ms' }}>
            <div className="relative">
              {/* Property A */}
              <div className="border-2 border-ink bg-card relative">
                <div className="border-b border-ink/15 px-4 py-2.5 bg-foreground text-background flex items-center justify-between">
                  <span className="text-sm font-medium">
                    <span className="font-display italic mr-1.5">No.</span>1
                  </span>
                  <span className="text-xs text-background/60 italic">Maple Street</span>
                </div>
                <div className="p-5 sm:p-6">
                  <p className="font-display text-5xl sm:text-6xl text-foreground leading-none tabular-nums">
                    ${Math.round(priceA / 1000)}k
                  </p>
                  <div className="mt-3 flex items-baseline gap-3 text-sm text-muted-foreground italic">
                    <span><span className="font-display not-italic text-foreground text-base">3</span> beds</span>
                    <span className="text-foreground/25">/</span>
                    <span><span className="font-display not-italic text-foreground text-base">2</span> baths</span>
                    <span className="text-foreground/25">/</span>
                    <span><span className="font-display not-italic text-foreground text-base tabular-nums">{Math.round(sqftA).toLocaleString()}</span> sqft</span>
                  </div>
                </div>
              </div>

              {/* VS badge */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                <div className="relative">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 border-2 border-ink bg-accent rotate-45 wobble-soft" />
                  <span className="absolute inset-0 flex items-center justify-center font-display italic text-2xl sm:text-3xl text-foreground">
                    vs
                  </span>
                </div>
              </div>

              {/* Property B (winner) */}
              <div className="border-2 border-ink bg-card relative -mt-px">
                <div className="border-b border-ink/15 px-4 py-2.5 bg-foreground text-background flex items-center justify-between">
                  <span className="text-sm font-medium flex items-center gap-2">
                    <span className="w-2 h-2 rotate-45 bg-accent" />
                    <span className="font-display italic mr-1.5">No.</span>2
                  </span>
                  <span className="text-xs text-accent italic">winner</span>
                </div>
                <div className="p-5 sm:p-6 bg-accent/15">
                  <p className="font-display text-5xl sm:text-6xl text-foreground leading-none tabular-nums">
                    ${Math.round(priceB / 1000)}k
                  </p>
                  <div className="mt-3 flex items-baseline gap-3 text-sm text-muted-foreground italic">
                    <span><span className="font-display not-italic text-foreground text-base">4</span> beds</span>
                    <span className="text-foreground/25">/</span>
                    <span><span className="font-display not-italic text-foreground text-base">3</span> baths</span>
                    <span className="text-foreground/25">/</span>
                    <span><span className="font-display not-italic text-foreground text-base tabular-nums">{Math.round(sqftB).toLocaleString()}</span> sqft</span>
                  </div>

                  {/* mini delta strip */}
                  <div className="mt-5 grid grid-cols-3 border border-ink/20 bg-card text-xs">
                    <div className="px-3 py-2 border-r border-ink/15">
                      <p className="font-display text-base text-foreground tabular-nums">-$54k</p>
                      <p className="text-muted-foreground italic">price</p>
                    </div>
                    <div className="px-3 py-2 border-r border-ink/15">
                      <p className="font-display text-base text-foreground tabular-nums">+340</p>
                      <p className="text-muted-foreground italic">sqft</p>
                    </div>
                    <div className="px-3 py-2">
                      <p className="font-display text-base text-foreground">A+</p>
                      <p className="text-muted-foreground italic">schools</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* corner annotation */}
              <div className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 border-2 border-ink bg-foreground text-background px-3 py-1.5 text-xs font-semibold rotate-3">
                <span className="font-display italic mr-1">live</span> comparison
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Property-metric ribbon */}
      <div className="relative border-t-2 border-ink bg-foreground text-background overflow-hidden">
        <div className="flex whitespace-nowrap marquee-track py-3.5">
          {[...METRIC_RIBBON, ...METRIC_RIBBON].map((metric, i) => (
            <span
              key={`${metric}-${i}`}
              className="inline-flex items-center gap-3 px-7 text-sm font-medium text-background"
            >
              <span className="w-1.5 h-1.5 rotate-45 bg-accent" />
              {metric}
              <span className="font-display italic text-background/55 ml-1">analyzed</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

const METRIC_RIBBON = [
  'Price / sqft',
  'Property tax',
  'Mortgage estimate',
  'Walk score',
  'School rating',
  'Days on market',
  'Zestimate delta',
  'HOA fees',
  'Year built',
  'Lot size',
  'Transit access',
  'Bike score',
] as const
