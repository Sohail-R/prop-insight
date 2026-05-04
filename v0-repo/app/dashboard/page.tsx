'use client'

import { useState, useCallback } from 'react'
import { Property } from '@/lib/property-schema'
import { PropertyInput } from '@/components/property-input'
import { PropertyCard } from '@/components/property-card'
import { ComparisonView } from '@/components/comparison-view'
import { Header } from '@/components/header'

type ReplaceTarget = { index: number } | null

function isDuplicate(a: Property, b: Property) {
  // Consider two properties identical if their core identifiers all match.
  const sameAddress =
    a.address.trim().toLowerCase() === b.address.trim().toLowerCase()
  const samePrice = a.price === b.price
  const sameSqft = a.sqft === b.sqft
  const sameBeds = a.bedrooms === b.bedrooms
  const sameBaths = a.bathrooms === b.bathrooms
  // Strong duplicate: address + price + sqft match. Also catch the case where
  // address comes back empty (rare) but every spec lines up perfectly.
  if (sameAddress && samePrice && sameSqft) return true
  if (samePrice && sameSqft && sameBeds && sameBaths && a.sqft > 0) return true
  return false
}

export default function DashboardPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeView, setActiveView] = useState<'single' | 'compare'>('single')
  const [needsManualInput, setNeedsManualInput] = useState(false)
  const [manualInputInstructions, setManualInputInstructions] = useState<string[]>([])
  const [pendingUrl, setPendingUrl] = useState<string | undefined>()
  const [replaceTarget, setReplaceTarget] = useState<ReplaceTarget>(null)
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null)

  const handleAddProperty = useCallback(
    async (url: string, pageContent?: string) => {
      const replacing = replaceTarget !== null
      if (!replacing && properties.length >= 2) {
        setError('You can only compare up to 2 properties. Remove one to add another.')
        return
      }

      setIsLoading(true)
      setError(null)
      setDuplicateWarning(null)

      try {
        const response = await fetch('/api/extract-property', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url, pageContent }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to extract property')
        }

        if (data.needsManualInput) {
          setNeedsManualInput(true)
          setManualInputInstructions(data.instructions || [])
          setPendingUrl(url)
          setIsLoading(false)
          return
        }

        const incoming: Property = data.property

        // Duplicate detection: compare against every existing property except
        // the slot being replaced (if we're in replace mode).
        const others = properties.filter(
          (_, idx) => !(replacing && replaceTarget?.index === idx),
        )
        const dupe = others.find(p => isDuplicate(p, incoming))
        if (dupe) {
          setDuplicateWarning(
            'This looks like the same listing you already added. The page source you pasted matches an existing property exactly. Open the new listing in a fresh tab, hard-reload it (Ctrl+Shift+R / Cmd+Shift+R), copy that page source, and paste it again.',
          )
          // Stay on the paste step so they can retry without losing the URL.
          setNeedsManualInput(true)
          setManualInputInstructions([
            'Open the new Zillow listing in a brand-new tab',
            'Hard reload (Ctrl/Cmd + Shift + R) to flush old data',
            'Right click → View Page Source',
            'Select All, Copy, then paste below',
          ])
          setPendingUrl(url)
          setIsLoading(false)
          return
        }

        // Success - reset manual input state
        setNeedsManualInput(false)
        setManualInputInstructions([])
        setPendingUrl(undefined)
        setDuplicateWarning(null)

        if (replacing && replaceTarget) {
          const idx = replaceTarget.index
          setProperties(prev => prev.map((p, i) => (i === idx ? incoming : p)))
          setReplaceTarget(null)
        } else {
          setProperties(prev => {
            const next = [...prev, incoming]
            if (next.length === 2) setActiveView('compare')
            return next
          })
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong')
      } finally {
        setIsLoading(false)
      }
    },
    [properties, replaceTarget],
  )

  const handleRemoveProperty = (index: number) => {
    setProperties(prev => prev.filter((_, i) => i !== index))
    setActiveView('single')
    if (replaceTarget?.index === index) {
      setReplaceTarget(null)
      setNeedsManualInput(false)
      setPendingUrl(undefined)
    }
  }

  const handleReplaceProperty = (index: number) => {
    setReplaceTarget({ index })
    setNeedsManualInput(false)
    setPendingUrl(undefined)
    setError(null)
    setDuplicateWarning(null)
    // Smooth scroll to the input.
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleCancelReplace = () => {
    setReplaceTarget(null)
    setNeedsManualInput(false)
    setPendingUrl(undefined)
    setDuplicateWarning(null)
  }

  const handleClearAll = () => {
    setProperties([])
    setActiveView('single')
    setError(null)
    setNeedsManualInput(false)
    setManualInputInstructions([])
    setPendingUrl(undefined)
    setReplaceTarget(null)
    setDuplicateWarning(null)
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Heading */}
        <section className="mb-10 border-b border-ink/15 pb-8">
          <div className="flex items-end justify-between flex-wrap gap-4">
            <div>
              <p className="label-sans mb-3">
                {properties.length === 0
                  ? 'Step one of three'
                  : properties.length === 1
                    ? 'Step two of three'
                    : 'Step three of three'}
              </p>
              <h1 className="font-display text-5xl sm:text-6xl text-foreground tracking-tight leading-[0.95] text-balance">
                {replaceTarget !== null
                  ? <>Re-paste source for <em className="not-italic font-display">Property {replaceTarget.index + 1}</em></>
                  : properties.length === 0
                    ? 'Paste a Zillow link.'
                    : properties.length === 1
                      ? 'Add one more.'
                      : 'Side-by-side intelligence.'}
              </h1>
            </div>
            <div className="label-sans">
              <span className="font-display text-2xl text-foreground leading-none">{properties.length}</span>
              <span className="text-muted-foreground"> &nbsp;of two properties</span>
            </div>
          </div>
        </section>

        {/* Input */}
        <PropertyInput
          onSubmit={handleAddProperty}
          isLoading={isLoading}
          propertyCount={properties.length}
          needsManualInput={needsManualInput}
          manualInputInstructions={manualInputInstructions}
          pendingUrl={pendingUrl}
          duplicateWarning={duplicateWarning}
          replaceMode={replaceTarget !== null}
          onCancelReplace={handleCancelReplace}
        />

        {/* Error */}
        {error && (
          <div className="mt-6 border-2 border-ink bg-destructive/10 px-4 py-3 text-sm text-foreground max-w-2xl mx-auto">
            <strong className="font-display text-base italic mr-1">Error —</strong>
            <span>{error}</span>
          </div>
        )}

        {/* View Toggle */}
        {properties.length === 2 && !needsManualInput && replaceTarget === null && (
          <div className="flex justify-center mt-10">
            <div className="inline-flex border-2 border-ink p-1 bg-card">
              <button
                onClick={() => setActiveView('single')}
                className={`px-5 py-2 text-sm font-medium transition-colors ${
                  activeView === 'single'
                    ? 'bg-foreground text-background'
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                Individual
              </button>
              <button
                onClick={() => setActiveView('compare')}
                className={`px-5 py-2 text-sm font-medium transition-colors ${
                  activeView === 'compare'
                    ? 'bg-foreground text-background'
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                Compare
              </button>
            </div>
          </div>
        )}

        {/* Properties */}
        {properties.length > 0 && (
          <div className="mt-10">
            {activeView === 'compare' && properties.length === 2 ? (
              <ComparisonView
                property1={properties[0]}
                property2={properties[1]}
                onRemove={handleRemoveProperty}
                onReplace={handleReplaceProperty}
              />
            ) : properties.length === 1 ? (
              // Single property: center, max width, then prompt for #2 below
              <div className="space-y-10">
                <div className="max-w-2xl mx-auto">
                  <PropertyCard
                    property={properties[0]}
                    index={0}
                    onRemove={() => handleRemoveProperty(0)}
                    onReplace={() => handleReplaceProperty(0)}
                  />
                </div>

                {!needsManualInput && replaceTarget === null && (
                  <AddSecondPropertyPrompt />
                )}
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {properties.map((property, index) => (
                  <PropertyCard
                    key={`${property.address}-${index}`}
                    property={property}
                    index={index}
                    onRemove={() => handleRemoveProperty(index)}
                    onReplace={() => handleReplaceProperty(index)}
                  />
                ))}
              </div>
            )}

            <div className="flex justify-center mt-10">
              <button
                onClick={handleClearAll}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4 italic"
              >
                Clear all and start over
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {properties.length === 0 && !isLoading && !needsManualInput && (
          <div className="mt-20 max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 mb-6">
              <span className="w-1.5 h-1.5 rotate-45 bg-accent" />
              <span className="label-sans-strong">Awaiting your first listing</span>
            </div>
            <p className="font-display text-3xl text-foreground leading-tight text-balance">
              Drop any Zillow URL above.
              <br />
              <span className="text-muted-foreground italic">We&apos;ll do the rest.</span>
            </p>
          </div>
        )}
      </div>
    </main>
  )
}

function AddSecondPropertyPrompt() {
  const handleScrollToInput = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      // Focus the URL input shortly after scroll begins
      setTimeout(() => {
        const input = document.querySelector<HTMLInputElement>('input[type="url"]')
        input?.focus()
      }, 400)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="border-2 border-ink bg-card overflow-hidden">
        <div className="border-b border-ink/15 px-5 py-3 bg-foreground text-background flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rotate-45 bg-accent" />
            <span className="text-sm font-medium">Second listing</span>
          </div>
          <span className="text-sm text-background/65 italic">Empty</span>
        </div>

        <div className="px-7 py-9 text-center">
          <p className="label-sans mb-4">
            Add a second listing to unlock comparison
          </p>
          <h3 className="font-display text-3xl sm:text-4xl text-foreground tracking-tight leading-[1.05] text-balance">
            Drop one more Zillow URL
            <br />
            <em className="not-italic text-muted-foreground">to see the verdict.</em>
          </h3>
          <p className="text-foreground/70 mt-4 max-w-md mx-auto leading-relaxed">
            We&apos;ll line them up side-by-side &mdash; price, taxes, mortgage, schools, walkability &mdash; and
            tell you which one wins.
          </p>

          <button
            onClick={handleScrollToInput}
            className="group inline-flex items-center gap-2.5 mt-7 border-2 border-ink bg-foreground text-background px-6 py-3 text-sm font-semibold tracking-wide hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            Add second property
            <svg
              className="w-4 h-4 transition-transform group-hover:-translate-y-0.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.25}
            >
              <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
