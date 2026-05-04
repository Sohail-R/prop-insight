export function Why() {
  return (
    <section id="why" className="border-b-2 border-ink relative overflow-hidden">
      <div className="absolute inset-0 diamond-pattern-lg opacity-70" aria-hidden="true" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <p className="eyebrow mb-8 inline-flex items-center gap-2.5">
          <span className="inline-block w-2 h-2 rotate-45 bg-accent" />
          Why this exists
        </p>

        <blockquote className="font-display text-foreground text-4xl sm:text-6xl lg:text-7xl leading-[1.05] tracking-tight max-w-5xl text-balance">
          <span className="text-foreground/30">&ldquo;</span>
          The most expensive purchase of your life shouldn&apos;t depend on
          whether you remembered to <em>scroll down</em> on the listing.
          <span className="text-foreground/30">&rdquo;</span>
        </blockquote>

        <div className="mt-12 grid sm:grid-cols-3 gap-px bg-foreground border-2 border-ink">
          <div className="bg-card p-6 sm:p-8">
            <p className="font-display text-5xl text-foreground leading-none mb-3">
              <em>$11k</em>
            </p>
            <p className="text-sm text-foreground/70 leading-relaxed">
              Average annual property tax difference between two similarly-priced
              homes a block apart. Most buyers never check.
            </p>
          </div>
          <div className="bg-card p-6 sm:p-8">
            <p className="font-display text-5xl text-foreground leading-none mb-3">
              <em>14</em>
            </p>
            <p className="text-sm text-foreground/70 leading-relaxed">
              Browser tabs the average buyer juggles to compare just two homes.
              We replace all of them.
            </p>
          </div>
          <div className="bg-card p-6 sm:p-8">
            <p className="font-display text-5xl text-foreground leading-none mb-3">
              <em>0</em>
            </p>
            <p className="text-sm text-foreground/70 leading-relaxed">
              Accounts to create. Forms to fill. Emails to verify. Just paste a
              link and go.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
