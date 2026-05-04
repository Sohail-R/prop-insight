'use client'

import { useState, useMemo } from 'react'
import { Property } from '@/lib/property-schema'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MortgageCalculator } from '@/components/mortgage-calculator'
import { NeighborhoodInsights } from '@/components/neighborhood-insights'
import { PriceHistory } from '@/components/price-history'
import { formatCurrency, formatNumber } from '@/lib/format'
import { cleanDescription } from '@/lib/clean-text'

interface PropertyCardProps {
  property: Property
  index?: number
  onRemove: () => void
  onReplace?: () => void
}

export function PropertyCard({ property, index = 0, onRemove, onReplace }: PropertyCardProps) {
  const [activeTab, setActiveTab] = useState('overview')

  const cleanedDescription = useMemo(
    () => cleanDescription(property.description),
    [property.description],
  )

  const quickStats = [
    property.bedrooms > 0 && { v: property.bedrooms, l: 'Bd' },
    property.bathrooms > 0 && { v: property.bathrooms, l: 'Ba' },
    property.sqft > 0 && { v: formatNumber(property.sqft), l: 'Sqft' },
    property.yearBuilt && property.yearBuilt > 0 && { v: property.yearBuilt, l: 'Built' },
  ].filter((s): s is { v: string | number; l: string } => Boolean(s))

  return (
    <article className="border-2 border-ink bg-card overflow-hidden flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-ink/15 px-5 py-3 bg-foreground text-background">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rotate-45 bg-accent" />
          <span className="text-sm font-medium">
            <span className="font-display italic mr-1.5">No.</span>
            {index + 1}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {onReplace && (
            <button
              onClick={onReplace}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-sm hover:bg-background hover:text-foreground transition-colors"
              aria-label="Re-paste source for this property"
              title="Re-paste source"
            >
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25">
                <path d="M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Re-paste
            </button>
          )}
          <button
            onClick={onRemove}
            className="p-1.5 rounded-sm hover:bg-destructive transition-colors"
            aria-label="Remove property"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.25">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Hero section: address + huge price + inline quick stats */}
      <div className="px-7 pt-7 pb-7 border-b border-ink/12">
        <p className="label-sans mb-3">
          {[property.city, property.state, property.zipCode].filter(Boolean).join(', ') || 'Location pending'}
        </p>
        <h2 className="font-display text-3xl sm:text-[2.25rem] text-foreground tracking-tight leading-[1.05] text-balance">
          {property.address || 'Address unavailable'}
        </h2>

        <div className="mt-6 flex items-baseline gap-4 flex-wrap">
          <span className="font-display text-6xl sm:text-7xl text-foreground leading-none">
            {formatCurrency(property.price)}
          </span>
          {property.pricePerSqFt ? (
            <span className="text-sm text-muted-foreground pb-1.5 italic">
              {formatCurrency(property.pricePerSqFt)} per sqft
            </span>
          ) : null}
        </div>

        {quickStats.length > 0 && (
          <div className="mt-6 flex items-baseline gap-x-6 gap-y-2 flex-wrap">
            {quickStats.map((s, i) => (
              <div key={s.l} className="flex items-baseline gap-1.5">
                <span className="font-display text-2xl text-foreground leading-none">{s.v}</span>
                <span className="text-sm text-muted-foreground italic">
                  {s.l === 'Bd' ? 'beds' : s.l === 'Ba' ? 'baths' : s.l === 'Sqft' ? 'sqft' : 'built'}
                </span>
                {i < quickStats.length - 1 && (
                  <span className="ml-3 text-foreground/25 font-display text-xl leading-none" aria-hidden="true">
                    /
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {property.daysOnMarket !== null && property.daysOnMarket !== undefined && (
          <div className="mt-5 inline-flex items-center gap-2 border border-ink/25 bg-muted px-3 py-1.5">
            <span className="w-1.5 h-1.5 rotate-45 bg-accent" />
            <span className="text-sm font-medium text-foreground">
              {property.daysOnMarket} days on market
            </span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="px-7 py-6 flex-1">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 border-b border-ink/20 bg-transparent p-0 h-auto rounded-none">
            <TabsTrigger
              value="overview"
              className="rounded-none font-sans text-[14px] font-medium py-3 border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:font-semibold data-[state=active]:shadow-none text-muted-foreground hover:text-foreground transition-colors"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="financial"
              className="rounded-none font-sans text-[14px] font-medium py-3 border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:font-semibold data-[state=active]:shadow-none text-muted-foreground hover:text-foreground transition-colors"
            >
              Financial
            </TabsTrigger>
            <TabsTrigger
              value="neighborhood"
              className="rounded-none font-sans text-[14px] font-medium py-3 border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:font-semibold data-[state=active]:shadow-none text-muted-foreground hover:text-foreground transition-colors"
            >
              Neighborhood
            </TabsTrigger>
            <TabsTrigger
              value="calculator"
              className="rounded-none font-sans text-[14px] font-medium py-3 border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:font-semibold data-[state=active]:shadow-none text-muted-foreground hover:text-foreground transition-colors"
            >
              Calculator
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6 space-y-7">
            <DetailSection title="Property details">
              <DetailRow label="Property type" value={property.propertyType} />
              {property.lotSize ? (
                <DetailRow label="Lot size" value={`${formatNumber(property.lotSize)} sqft`} />
              ) : null}
              {property.stories ? (
                <DetailRow label="Stories" value={property.stories} />
              ) : null}
              {property.parkingSpaces ? (
                <DetailRow label="Parking" value={`${property.parkingSpaces} spaces`} />
              ) : null}
            </DetailSection>

            {(property.hasPool ||
              property.hasGarage ||
              property.hasBasement ||
              property.heatingType ||
              property.coolingType) && (
              <DetailSection title="Features">
                <div className="flex flex-wrap gap-2 px-1 pt-1">
                  {property.hasPool && <FeatureBadge>Pool</FeatureBadge>}
                  {property.hasGarage && <FeatureBadge>Garage</FeatureBadge>}
                  {property.hasBasement && <FeatureBadge>Basement</FeatureBadge>}
                  {property.heatingType && <FeatureBadge>{property.heatingType} heat</FeatureBadge>}
                  {property.coolingType && <FeatureBadge>{property.coolingType} cooling</FeatureBadge>}
                </div>
              </DetailSection>
            )}

            {cleanedDescription && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-display italic text-lg text-foreground flex items-center gap-2">
                    <span className="inline-block w-1.5 h-1.5 rotate-45 bg-accent" />
                    Description
                  </h4>
                  <span className="text-xs text-muted-foreground italic">
                    scroll to read more
                  </span>
                </div>
                <div className="border border-ink/20 bg-card">
                  <div className="scroll-editorial max-h-72 overflow-y-auto p-5">
                    <p className="text-[15px] text-foreground/85 leading-relaxed whitespace-pre-line">
                      {cleanedDescription}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="financial" className="mt-6 space-y-7">
            <DetailSection title="Costs">
              {property.estimatedMortgage ? (
                <DetailRow
                  label="Est. monthly payment"
                  value={formatCurrency(property.estimatedMortgage)}
                  highlight
                />
              ) : null}
              {property.propertyTax ? (
                <DetailRow label="Property tax (annual)" value={formatCurrency(property.propertyTax)} />
              ) : null}
              {property.hoaFees ? (
                <DetailRow label="HOA (monthly)" value={formatCurrency(property.hoaFees)} />
              ) : null}
            </DetailSection>

            <DetailSection title="Valuations">
              <DetailRow label="List price" value={formatCurrency(property.price)} />
              {property.zestimate ? (
                <DetailRow label="Zestimate" value={formatCurrency(property.zestimate)} />
              ) : null}
              {property.rentEstimate ? (
                <DetailRow
                  label="Rent estimate"
                  value={`${formatCurrency(property.rentEstimate)} / mo`}
                />
              ) : null}
            </DetailSection>

            {property.priceHistory && property.priceHistory.length > 0 && (
              <PriceHistory history={property.priceHistory} />
            )}
          </TabsContent>

          <TabsContent value="neighborhood" className="mt-6">
            <NeighborhoodInsights property={property} />
          </TabsContent>

          <TabsContent value="calculator" className="mt-6">
            <MortgageCalculator
              price={property.price}
              propertyTax={property.propertyTax || 0}
              hoaFees={property.hoaFees || 0}
            />
          </TabsContent>
        </Tabs>

        {property.listingUrl && (
          <a
            href={property.listingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full mt-7 py-3.5 border border-ink/30 bg-card text-foreground text-sm font-medium hover:bg-foreground hover:text-background hover:border-foreground transition-colors"
          >
            View on Zillow
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        )}

        <p className="mt-4 label-soft text-xs text-center italic">
          Scores &amp; estimates are approximations
        </p>
      </div>
    </article>
  )
}

function DetailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="font-display italic text-lg text-foreground mb-2 flex items-center gap-2">
        <span className="inline-block w-1.5 h-1.5 rotate-45 bg-accent" />
        {title}
      </h4>
      <div className="border border-ink/20 bg-card divide-soft">{children}</div>
    </div>
  )
}

function DetailRow({
  label,
  value,
  highlight,
}: {
  label: string
  value: string | number
  highlight?: boolean
}) {
  return (
    <div
      className={`flex items-center justify-between gap-4 px-5 py-3.5 ${
        highlight ? 'bg-accent/25' : ''
      }`}
    >
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="font-display text-xl text-foreground leading-none text-right">{value}</span>
    </div>
  )
}

function FeatureBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center border border-ink/25 bg-card px-3 py-1.5 text-sm text-foreground rounded-sm">
      {children}
    </span>
  )
}
