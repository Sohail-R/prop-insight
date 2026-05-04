import Link from 'next/link'

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 border-b-2 border-ink bg-background/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="relative w-7 h-7 flex items-center justify-center">
              <span className="absolute inset-0 rotate-45 bg-foreground border-2 border-ink" />
              <span className="relative -rotate-0 font-display text-background text-base leading-none italic">P</span>
            </span>
            <span className="font-display text-xl text-foreground tracking-tight">
              PropInsight
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#how" className="font-sans text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">
              How it works
            </a>
            <a href="#features" className="font-sans text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#why" className="font-sans text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">
              Why
            </a>
          </nav>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 border-2 border-ink bg-foreground text-background px-4 py-2 font-sans text-sm font-semibold tracking-wide hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            Launch app
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    </header>
  )
}
