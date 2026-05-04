import Link from 'next/link'

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink/15 bg-background/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rotate-45 border-2 border-ink bg-foreground flex items-center justify-center">
              <span className="-rotate-45 font-display text-background text-base leading-none italic">P</span>
            </div>
            <span className="font-display text-xl text-foreground tracking-tight">
              PropInsight
            </span>
          </Link>

          <div className="hidden sm:flex items-center gap-2 label-sans">
            <span className="font-display italic text-foreground/70">the</span>
            <span className="text-foreground font-medium">Dashboard</span>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 border border-ink/25 bg-card text-foreground px-3 py-1.5 text-sm font-medium hover:bg-muted hover:border-ink transition-colors"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M11 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Home
          </Link>
        </div>
      </div>
    </header>
  )
}
