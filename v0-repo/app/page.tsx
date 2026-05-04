import { LandingHeader } from '@/components/landing/landing-header'
import { Hero } from '@/components/landing/hero'
import { HowItWorks } from '@/components/landing/how-it-works'
import { Features } from '@/components/landing/features'
import { Preview } from '@/components/landing/preview'
import { Why } from '@/components/landing/why'
import { CtaSection } from '@/components/landing/cta-section'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <LandingHeader />
      <Hero />
      <HowItWorks />
      <Features />
      <Preview />
      <Why />
      <CtaSection />
    </main>
  )
}
