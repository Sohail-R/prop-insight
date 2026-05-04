import Link from 'next/link'

export function CtaSection() {
  return (
    <section className="bg-foreground text-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-36 text-center">
        <p className="eyebrow text-background/65 mb-10 inline-flex items-center gap-2.5 justify-center">
          <span className="inline-block w-2 h-2 rotate-45 bg-accent" />
          The decision is one click away
        </p>

        <h2 className="font-display text-background tracking-tight leading-[0.9] text-balance">
          <span className="block text-7xl sm:text-9xl lg:text-[12rem]">Stop guessing.</span>
          <span className="block text-7xl sm:text-9xl lg:text-[12rem]">
            <em className="italic">Start</em>{' '}
            <span className="inline-block bg-accent text-accent-foreground border-2 border-background px-4 sm:px-6 -rotate-1 align-middle">
              comparing
            </span>
            .
          </span>
        </h2>

        <p className="mt-10 text-background/70 text-xl sm:text-2xl max-w-2xl mx-auto leading-snug text-pretty">
          The analyzer is one click away. No signup, no demo, no nonsense.
        </p>

        <div className="mt-14 flex justify-center">
          <Link
            href="/dashboard"
            className="group relative inline-flex items-center gap-4 border-2 border-background bg-accent text-accent-foreground px-10 sm:px-14 py-6 sm:py-8 font-sans text-base sm:text-lg font-bold tracking-wide hover:bg-background hover:text-foreground transition-colors"
          >
            <span className="absolute -top-3 -left-3 border-2 border-background bg-foreground text-background w-7 h-7 rotate-45 flex items-center justify-center">
              <span className="-rotate-45 font-display text-base leading-none italic">P</span>
            </span>
            Open the analyzer
            <svg className="w-6 h-6 transition-transform group-hover:translate-x-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        <p className="mt-8 eyebrow text-background/55">
          Free · No account · Built for buyers
        </p>
      </div>

      <div className="border-t-2 border-background/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 border-2 border-background bg-background flex items-center justify-center">
              <span className="font-display text-foreground text-base leading-none italic">P</span>
            </div>
            <span className="font-display text-xl text-background tracking-tight">
              PropInsight
            </span>
          </div>
          <p className="eyebrow text-background/55">
            © {new Date().getFullYear()} · Property analysis, decoded.
          </p>
        </div>
      </div>
    </section>
  )
}
