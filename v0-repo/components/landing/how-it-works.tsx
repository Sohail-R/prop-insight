export function HowItWorks() {
  const steps = [
    {
      n: '01',
      title: 'Drop a Zillow link',
      body: 'Copy the URL of any home for sale on Zillow and paste it into PropInsight. That\'s the entire input.',
    },
    {
      n: '02',
      title: 'We extract the truth',
      body: 'Forty-plus data points — price, sqft, taxes, HOA, mortgage estimate, school ratings, walk score, days on market — pulled and cleaned in seconds.',
    },
    {
      n: '03',
      title: 'Add a rival listing',
      body: 'Paste a second link. We instantly score every metric head-to-head so the smarter buy is obvious, not a hunch.',
    },
    {
      n: '04',
      title: 'Decide with confidence',
      body: 'Export the comparison, run mortgage scenarios, and walk into the offer with receipts.',
    },
  ]

  return (
    <section id="how" className="border-b-2 border-ink">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        {/* Section header */}
        <div className="grid lg:grid-cols-12 gap-8 items-end mb-16">
          <div className="lg:col-span-7">
            <p className="eyebrow mb-6 inline-flex items-center gap-2.5">
              <span className="inline-block w-2 h-2 rotate-45 bg-accent" />
              How it works
            </p>
            <h2 className="font-display text-5xl sm:text-7xl text-foreground tracking-tight leading-[0.95] text-balance">
              Four steps. <em>Zero</em> spreadsheets.
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="text-foreground/70 text-lg leading-relaxed text-pretty">
              We built PropInsight for the buyers tired of toggling between
              twelve browser tabs trying to remember which home had the
              cheaper taxes.
            </p>
          </div>
        </div>

        {/* Steps */}
        <div className="border-2 border-ink bg-card">
          {steps.map((step, i) => (
            <div
              key={step.n}
              className={`grid grid-cols-12 gap-4 sm:gap-8 px-6 sm:px-10 py-8 sm:py-12 ${
                i < steps.length - 1 ? 'border-b-2 border-ink' : ''
              } group hover:bg-accent/10 transition-colors`}
            >
              <div className="col-span-3 sm:col-span-2">
                <span className="font-display text-5xl sm:text-7xl text-foreground leading-none">
                  {step.n}
                </span>
              </div>
              <div className="col-span-9 sm:col-span-7">
                <h3 className="font-display text-3xl sm:text-4xl text-foreground tracking-tight leading-tight mb-2">
                  {step.title}
                </h3>
                <p className="text-foreground/70 text-base sm:text-lg leading-relaxed max-w-xl">
                  {step.body}
                </p>
              </div>
              <div className="hidden sm:flex col-span-3 items-end justify-end">
                <div className="w-12 h-12 border-2 border-ink flex items-center justify-center group-hover:bg-accent transition-colors">
                  <svg
                    className="w-5 h-5 text-foreground"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
