'use client'

import Link from 'next/link'
import { useAnimatedNumber, useRotating } from '@/lib/use-animations'

const ROTATING_WORDS = ['house', 'home', 'deal', 'condo', 'investment'] as const
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

export function Hero() {
  const { item: rotatingWord, index: wordIndex } = useRotating(ROTATING_WORDS, 1900)

  // Animate stat counters in on mount
  const dataPoints = useAnimatedNumber(40, 1600, 200)
  const sideBySide = useAnimatedNumber(2, 600, 600)

  return (
    <section className="relative overflow-hidden border-b-2 border-ink">
      <div className="absolute inset-0 diamond-pattern" aria-hidden="true" />
      <div className="absolute inset-0 noise pointer-events-none" aria-hidden="true" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20 sm:pt-20 sm:pb-28">
        {/* Eyebrow */}
        <div className="flex items-center gap-3 mb-10 rise-in" style={{ animationDelay: '0ms' }}>
          <span className="w-2 h-2 rotate-45 bg-accent" />
          <span className="font-display italic text-lg text-foreground">
            Property intelligence
          </span>
          <span className="hidden sm:inline-block w-8 h-px bg-foreground/30" />
          <span className="hidden sm:inline-block text-sm text-muted-foreground italic">
            Built for buyers, not brokers
          </span>
        </div>

        {/* Massive editorial headline */}
        <h1 className="font-display text-foreground tracking-tight leading-[0.88] text-balance">
          <span className="block text-[14vw] sm:text-[12vw] lg:text-[10rem] xl:text-[12rem] rise-in" style={{ animationDelay: '120ms' }}>
            Buy the right
          </span>
          <span className="block text-[14vw] sm:text-[12vw] lg:text-[10rem] xl:text-[12rem] rise-in" style={{ animationDelay: '220ms' }}>
            <span className="relative inline-flex items-baseline overflow-hidden align-baseline">
              {/* Reserve width using the longest word so the layout doesn't jump */}
              <span aria-hidden="true" className="invisible italic font-display">
                investment
              </span>
              <span
                key={wordIndex}
                aria-live="polite"
                className="absolute left-0 inset-y-0 italic font-display text-foreground"
                style={{
                  animation: 'word-cycle 1.9s ease-in-out',
                  animationFillMode: 'forwards',
                }}
              >
                {rotatingWord}
              </span>
            </span>
            <span className="inline-block mx-3 sm:mx-6 align-middle">
              <span className="inline-block bg-accent border-2 border-ink px-3 sm:px-6 py-0 sm:py-1 wobble-soft align-middle">
                <span className="text-foreground">not the</span>
              </span>
            </span>
          </span>
          <span className="block text-[14vw] sm:text-[12vw] lg:text-[10rem] xl:text-[12rem] rise-in" style={{ animationDelay: '320ms' }}>
            pretty <em className="font-display italic">one</em>.
          </span>
        </h1>

        {/* Sub copy + meta */}
        <div className="mt-12 grid lg:grid-cols-12 gap-8 items-end rise-in" style={{ animationDelay: '460ms' }}>
          <div className="lg:col-span-7">
            <p className="text-foreground text-xl sm:text-2xl leading-snug max-w-2xl text-pretty">
              PropInsight pulls the data out of any Zillow listing and lays two
              homes side-by-side &mdash; price, taxes, mortgage, schools, walkability &mdash;
              so the better deal is impossible to miss.
            </p>
          </div>
          <div className="lg:col-span-5 lg:text-right">
            <div className="inline-flex items-center gap-3 text-sm text-muted-foreground italic">
              <span className="w-8 h-px bg-foreground/40" />
              <span>scroll to learn how</span>
            </div>
          </div>
        </div>

        {/* Stats strip with animated counters */}
        <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 border-2 border-ink bg-card rise-in" style={{ animationDelay: '560ms' }}>
          <StatBox big="< 5s" small="Time to insight" />
          <StatBox big={`${Math.round(dataPoints)}+`} small="Data points / home" />
          <StatBox big={String(Math.round(sideBySide))} small="Side-by-side homes" />
          <StatBox big="$0" small="To get started" />
        </div>

        {/* CTA row */}
        <div className="mt-10 flex flex-wrap items-center gap-4 rise-in" style={{ animationDelay: '660ms' }}>
          <Link
            href="/dashboard"
            className="group inline-flex items-center gap-3 border-2 border-ink bg-foreground text-background px-6 py-4 font-sans text-sm font-semibold tracking-wide hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            Open the analyzer
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <a
            href="#how"
            className="inline-flex items-center gap-2 border-2 border-ink bg-card text-foreground px-6 py-4 font-sans text-sm font-semibold tracking-wide hover:bg-muted transition-colors"
          >
            See how it works
          </a>
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

function StatBox({ big, small }: { big: string; small: string }) {
  return (
    <div className="px-5 py-6 border-soft border-r last:border-r-0 [&:nth-child(2n)]:border-r-0 sm:[&:nth-child(2n)]:border-r [&:nth-child(-n+2)]:border-b sm:[&:nth-child(-n+2)]:border-b-0 sm:[&:last-child]:border-r-0">
      <p className="font-display text-4xl sm:text-5xl text-foreground leading-none tabular-nums">
        {big}
      </p>
      <p className="mt-2 text-sm text-muted-foreground italic">
        {small}
      </p>
    </div>
  )
}
