'use client'

import { useState } from 'react'
import { Property } from '@/lib/property-schema'
import { PropertyInput } from '@/components/property-input'
import { PropertyCard } from '@/components/property-card'
import { ComparisonView } from '@/components/comparison-view'
import { Header } from '@/components/header'

export default function HomePage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeView, setActiveView] = useState<'single' | 'compare'>('single')
  const [needsManualInput, setNeedsManualInput] = useState(false)
  const [manualInputInstructions, setManualInputInstructions] = useState<string[]>([])
  const [pendingUrl, setPendingUrl] = useState<string | undefined>()

  const handleAddProperty = async (url: string, pageContent?: string) => {
    if (properties.length >= 2) {
      setError('You can only compare up to 2 properties. Remove one to add another.')
      return
    }

    setIsLoading(true)
    setError(null)

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

      // Check if we need manual input
      if (data.needsManualInput) {
        setNeedsManualInput(true)
        setManualInputInstructions(data.instructions || [])
        setPendingUrl(url)
        setIsLoading(false)
        return
      }

      // Success - reset manual input state and add property
      setNeedsManualInput(false)
      setManualInputInstructions([])
      setPendingUrl(undefined)
      setProperties(prev => [...prev, data.property])
      
      if (properties.length === 1) {
        setActiveView('compare')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveProperty = (index: number) => {
    setProperties(prev => prev.filter((_, i) => i !== index))
    if (properties.length <= 2) {
      setActiveView('single')
    }
  }

  const handleClearAll = () => {
    setProperties([])
    setActiveView('single')
    setError(null)
    setNeedsManualInput(false)
    setManualInputInstructions([])
    setPendingUrl(undefined)
  }

  return (
    <main className="min-h-screen">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-foreground mb-4 text-balance">
            Property Analysis Made Simple
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Paste a Zillow link and get instant, comprehensive insights. Add a second property to compare them side-by-side.
          </p>
        </section>

        {/* Input Section */}
        <PropertyInput 
          onSubmit={handleAddProperty} 
          isLoading={isLoading}
          propertyCount={properties.length}
          needsManualInput={needsManualInput}
          manualInputInstructions={manualInputInstructions}
          pendingUrl={pendingUrl}
        />

        {/* Error Display */}
        {error && (
          <div className="mt-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-center">
            {error}
          </div>
        )}

        {/* View Toggle */}
        {properties.length === 2 && (
          <div className="flex justify-center gap-2 mt-8">
            <button
              onClick={() => setActiveView('single')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeView === 'single'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              Individual View
            </button>
            <button
              onClick={() => setActiveView('compare')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeView === 'compare'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              Comparison View
            </button>
          </div>
        )}

        {/* Properties Display */}
        {properties.length > 0 && (
          <div className="mt-8">
            {activeView === 'compare' && properties.length === 2 ? (
              <ComparisonView 
                property1={properties[0]} 
                property2={properties[1]}
                onRemove={handleRemoveProperty}
              />
            ) : (
              <div className="grid gap-8 md:grid-cols-2">
                {properties.map((property, index) => (
                  <PropertyCard
                    key={`${property.address}-${index}`}
                    property={property}
                    onRemove={() => handleRemoveProperty(index)}
                  />
                ))}
              </div>
            )}
            
            {properties.length > 0 && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={handleClearAll}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
                >
                  Clear all and start over
                </button>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {properties.length === 0 && !isLoading && !needsManualInput && (
          <div className="mt-16 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary mb-4">
              <svg className="w-8 h-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">No properties yet</h3>
            <p className="text-muted-foreground">Paste a Zillow link above to get started</p>
          </div>
        )}
      </div>
    </main>
  )
}
