export function Features() {
  const items = [
    {
      tag: 'Financial',
      title: 'Real numbers, not vibes.',
      body: 'List price, price-per-sqft, monthly mortgage estimate, property tax, HOA fees, Zestimate vs. asking — laid out so the cheap home doesn\'t hide expensive ownership.',
    },
    {
      tag: 'Comparison',
      title: 'Two homes. One verdict.',
      body: 'Side-by-side tables flag the winner on every metric. We highlight which house wins on value, space, and location at a glance.',
    },
    {
      tag: 'Calculator',
      title: 'Mortgage math in real time.',
      body: 'Adjust down payment, rate, and term. Watch the monthly payment recalculate the second you move the slider.',
    },
    {
      tag: 'Neighborhood',
      title: 'Beyond the four walls.',
      body: 'Walk Score, Transit Score, Bike Score, school ratings, days on market — the context that matters once you\'ve actually moved in.',
    },
    {
      tag: 'Export',
      title: 'Take it to the offer table.',
      body: 'Download a clean PDF of your comparison. Bring it to your agent, your partner, your spreadsheet-loving uncle.',
    },
    {
      tag: 'Honest',
      title: 'No login. No fluff.',
      body: 'Paste a link, get answers. We don\'t store your search history or sell you to lenders.',
    },
  ]

  return (
    <section id="features" className="border-b-2 border-ink bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <div className="grid lg:grid-cols-12 gap-8 items-end mb-16">
          <div className="lg:col-span-7">
            <p className="eyebrow mb-6 inline-flex items-center gap-2.5">
              <span className="inline-block w-2 h-2 rotate-45 bg-accent" />
              What you get
            </p>
            <h2 className="font-display text-5xl sm:text-7xl text-foreground tracking-tight leading-[0.95] text-balance">
              Everything a real <em>diligence</em> looks like.
            </h2>
          </div>
          <div className="lg:col-span-5 flex justify-start lg:justify-end">
            <div className="inline-flex items-center gap-2 border-2 border-ink px-3 py-2 bg-accent">
              <span className="w-2 h-2 rotate-45 bg-foreground" />
              <span className="eyebrow-strong text-foreground">
                Six pillars · One workflow
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-2 border-ink">
          {items.map((it, i) => (
            <article
              key={it.title}
              className={`relative p-8 sm:p-10 bg-background hover:bg-accent/15 transition-colors group
                ${i % 3 !== 2 ? 'lg:border-r-2' : ''}
                ${i % 2 === 0 ? 'sm:border-r-2 lg:border-r-2' : ''}
                ${i < items.length - (items.length % 3 || 3) ? 'lg:border-b-2' : ''}
                ${i < items.length - (items.length % 2 === 0 ? 2 : 1) ? 'sm:border-b-2' : ''}
                ${i < items.length - 1 ? 'border-b-2' : ''}
                border-ink`}
            >
              <div className="flex items-center justify-between mb-8">
                <span className="eyebrow inline-flex items-center gap-2">
                  <span className="font-display text-base text-foreground/40 leading-none">{String(i + 1).padStart(2, '0')}</span>
                  <span className="w-3 h-px bg-foreground/30" />
                  {it.tag}
                </span>
                <span className="w-6 h-6 border-2 border-ink flex items-center justify-center group-hover:bg-accent transition-colors">
                  <svg className="w-3 h-3 text-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M7 17L17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
              <h3 className="font-display text-3xl sm:text-4xl text-foreground tracking-tight leading-[1.05] mb-4 text-balance">
                {it.title}
              </h3>
              <p className="text-foreground/70 leading-relaxed text-pretty">
                {it.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
