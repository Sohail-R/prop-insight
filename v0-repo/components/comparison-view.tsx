'use client'

import { useState, useMemo } from 'react'
import { Property } from '@/lib/property-schema'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatCurrency, formatNumber } from '@/lib/format'
import { ComparisonChart } from '@/components/comparison-chart'
import { ExportComparison } from '@/components/export-comparison'

interface ComparisonViewProps {
  property1: Property
  property2: Property
  onRemove: (index: number) => void
  onReplace?: (index: number) => void
}

interface ComparisonItem {
  label: string
  value1: string | number | null | undefined
  value2: string | number | null | undefined
  winner: 1 | 2 | 'tie' | null
  format?: 'currency' | 'number' | 'text'
  lowerIsBetter?: boolean
}

export function ComparisonView({ property1, property2, onRemove, onReplace }: ComparisonViewProps) {
  const [activeTab, setActiveTab] = useState('overview')

  const comparisons = useMemo(() => {
    const compare = (
      v1: number | null | undefined,
      v2: number | null | undefined,
      lowerIsBetter = false,
    ): 1 | 2 | 'tie' | null => {
      if (v1 === null || v1 === undefined || v2 === null || v2 === undefined) return null
      if (v1 === v2) return 'tie'
      if (lowerIsBetter) return v1 < v2 ? 1 : 2
      return v1 > v2 ? 1 : 2
    }

    const financial: ComparisonItem[] = [
      { label: 'List price', value1: property1.price, value2: property2.price, winner: compare(property1.price, property2.price, true), format: 'currency', lowerIsBetter: true },
      { label: 'Price / sqft', value1: property1.pricePerSqFt, value2: property2.pricePerSqFt, winner: compare(property1.pricePerSqFt, property2.pricePerSqFt, true), format: 'currency', lowerIsBetter: true },
      { label: 'Est. mortgage', value1: property1.estimatedMortgage, value2: property2.estimatedMortgage, winner: compare(property1.estimatedMortgage, property2.estimatedMortgage, true), format: 'currency', lowerIsBetter: true },
      { label: 'Property tax', value1: property1.propertyTax, value2: property2.propertyTax, winner: compare(property1.propertyTax, property2.propertyTax, true), format: 'currency', lowerIsBetter: true },
      { label: 'HOA fees', value1: property1.hoaFees, value2: property2.hoaFees, winner: compare(property1.hoaFees, property2.hoaFees, true), format: 'currency', lowerIsBetter: true },
      { label: 'Rent estimate', value1: property1.rentEstimate, value2: property2.rentEstimate, winner: compare(property1.rentEstimate, property2.rentEstimate), format: 'currency' },
    ]

    const size: ComparisonItem[] = [
      { label: 'Bedrooms', value1: property1.bedrooms, value2: property2.bedrooms, winner: compare(property1.bedrooms, property2.bedrooms), format: 'number' },
      { label: 'Bathrooms', value1: property1.bathrooms, value2: property2.bathrooms, winner: compare(property1.bathrooms, property2.bathrooms), format: 'number' },
      { label: 'Square feet', value1: property1.sqft, value2: property2.sqft, winner: compare(property1.sqft, property2.sqft), format: 'number' },
      { label: 'Lot size', value1: property1.lotSize, value2: property2.lotSize, winner: compare(property1.lotSize, property2.lotSize), format: 'number' },
      { label: 'Year built', value1: property1.yearBuilt, value2: property2.yearBuilt, winner: compare(property1.yearBuilt, property2.yearBuilt), format: 'number' },
    ]

    const neighborhood: ComparisonItem[] = [
      { label: 'Walk Score', value1: property1.walkScore, value2: property2.walkScore, winner: compare(property1.walkScore, property2.walkScore), format: 'number' },
      { label: 'Transit Score', value1: property1.transitScore, value2: property2.transitScore, winner: compare(property1.transitScore, property2.transitScore), format: 'number' },
      { label: 'Bike Score', value1: property1.bikeScore, value2: property2.bikeScore, winner: compare(property1.bikeScore, property2.bikeScore), format: 'number' },
      { label: 'School rating', value1: property1.schoolRating, value2: property2.schoolRating, winner: compare(property1.schoolRating, property2.schoolRating), format: 'number' },
      { label: 'Days on market', value1: property1.daysOnMarket, value2: property2.daysOnMarket, winner: compare(property1.daysOnMarket, property2.daysOnMarket, true), format: 'number', lowerIsBetter: true },
    ]

    return { financial, size, neighborhood }
  }, [property1, property2])

  const chartData = useMemo(
    () => ({
      financial: [
        { name: 'Price', property1: property1.price / 1000, property2: property2.price / 1000 },
        { name: 'Price/Sqft', property1: property1.pricePerSqFt || 0, property2: property2.pricePerSqFt || 0 },
        { name: 'Mortgage', property1: property1.estimatedMortgage || 0, property2: property2.estimatedMortgage || 0 },
      ],
      size: [
        { name: 'Beds', property1: property1.bedrooms, property2: property2.bedrooms },
        { name: 'Baths', property1: property1.bathrooms, property2: property2.bathrooms },
        { name: 'Sqft (100s)', property1: property1.sqft / 100, property2: property2.sqft / 100 },
      ],
      scores: [
        { name: 'Walk', property1: property1.walkScore || 0, property2: property2.walkScore || 0 },
        { name: 'Transit', property1: property1.transitScore || 0, property2: property2.transitScore || 0 },
        { name: 'Bike', property1: property1.bikeScore || 0, property2: property2.bikeScore || 0 },
        { name: 'School', property1: (property1.schoolRating || 0) * 10, property2: (property2.schoolRating || 0) * 10 },
      ],
    }),
    [property1, property2],
  )

  return (
    <div className="space-y-6">
      {/* Property Headers */}
      <div className="grid md:grid-cols-2 gap-4">
        <PropertyHeader property={property1} index={0} onRemove={onRemove} onReplace={onReplace} accent="ink" />
        <PropertyHeader property={property2} index={1} onRemove={onRemove} onReplace={onReplace} accent="lime" />
      </div>

      {/* Export */}
      <div className="flex justify-end">
        <ExportComparison property1={property1} property2={property2} comparisons={comparisons} />
      </div>

      {/* Comparison Card */}
      <div className="border-2 border-ink bg-card overflow-hidden">
        <div className="flex items-center justify-between border-b border-ink/15 px-5 py-3 bg-foreground text-background">
          <span className="text-sm font-medium">
            <span className="font-display italic mr-1.5">The</span>
            side-by-side
          </span>
          <span className="text-sm text-background/65 italic">
            {comparisons.financial.length + comparisons.size.length + comparisons.neighborhood.length} metrics
          </span>
        </div>

        <div className="px-6 py-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 border-b border-ink/20 bg-transparent p-0 h-auto rounded-none">
              <TabsTrigger value="overview" className="rounded-none text-[14px] font-medium py-3 border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:font-semibold data-[state=active]:shadow-none text-muted-foreground hover:text-foreground transition-colors">
                Overview
              </TabsTrigger>
              <TabsTrigger value="financial" className="rounded-none text-[14px] font-medium py-3 border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:font-semibold data-[state=active]:shadow-none text-muted-foreground hover:text-foreground transition-colors">
                Financial
              </TabsTrigger>
              <TabsTrigger value="size" className="rounded-none text-[14px] font-medium py-3 border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:font-semibold data-[state=active]:shadow-none text-muted-foreground hover:text-foreground transition-colors">
                Size
              </TabsTrigger>
              <TabsTrigger value="area" className="rounded-none text-[14px] font-medium py-3 border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:font-semibold data-[state=active]:shadow-none text-muted-foreground hover:text-foreground transition-colors">
                Neighborhood
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6 space-y-8">
              <div className="grid md:grid-cols-3 gap-4">
                <SummaryCard
                  title="Better value"
                  winner={comparisons.financial.filter(c => c.winner === 1).length > comparisons.financial.filter(c => c.winner === 2).length ? 1 : 2}
                  property1={property1}
                  property2={property2}
                />
                <SummaryCard
                  title="More space"
                  winner={comparisons.size.filter(c => c.winner === 1).length > comparisons.size.filter(c => c.winner === 2).length ? 1 : 2}
                  property1={property1}
                  property2={property2}
                />
                <SummaryCard
                  title="Better location"
                  winner={comparisons.neighborhood.filter(c => c.winner === 1).length > comparisons.neighborhood.filter(c => c.winner === 2).length ? 1 : 2}
                  property1={property1}
                  property2={property2}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <ComparisonChart data={chartData.financial} title="Financial" subtitle="Price shown in thousands" />
                <ComparisonChart data={chartData.scores} title="Location scores" subtitle="All scores out of 100" />
              </div>
            </TabsContent>

            <TabsContent value="financial" className="mt-6 space-y-6">
              <ComparisonChart data={chartData.financial} title="Financial metrics" subtitle="Price shown in thousands" />
              <ComparisonTable items={comparisons.financial} />
            </TabsContent>

            <TabsContent value="size" className="mt-6 space-y-6">
              <ComparisonChart data={chartData.size} title="Size comparison" subtitle="Square footage in hundreds" />
              <ComparisonTable items={comparisons.size} />
            </TabsContent>

            <TabsContent value="area" className="mt-6 space-y-6">
              <ComparisonChart data={chartData.scores} title="Neighborhood scores" subtitle="All scores out of 100" />
              <ComparisonTable items={comparisons.neighborhood} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

function PropertyHeader({
  property,
  index,
  onRemove,
  onReplace,
  accent,
}: {
  property: Property
  index: number
  onRemove: (index: number) => void
  onReplace?: (index: number) => void
  accent: 'ink' | 'lime'
}) {
  return (
    <article className="border-2 border-ink bg-card">
      <div className="flex items-center justify-between border-b border-ink/15 px-4 py-3 bg-foreground text-background">
        <div className="flex items-center gap-2.5">
          <span
            className={`w-2 h-2 rotate-45 ${
              accent === 'lime' ? 'bg-accent' : 'bg-background'
            }`}
          />
          <span className="text-sm font-medium">
            <span className="font-display italic mr-1.5">No.</span>
            {index + 1}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {onReplace && (
            <button
              onClick={() => onReplace(index)}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-sm hover:bg-background hover:text-foreground transition-colors"
              title="Re-paste source"
            >
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25">
                <path d="M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Re-paste
            </button>
          )}
          <button
            onClick={() => onRemove(index)}
            className="p-1.5 rounded-sm hover:bg-destructive transition-colors"
            aria-label="Remove property"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.25">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-display text-2xl text-foreground leading-tight tracking-tight text-balance">
          {property.address}
        </h3>
        <p className="text-sm text-muted-foreground italic">
          {[property.city, property.state, property.zipCode].filter(Boolean).join(', ')}
        </p>
        <p className="font-display text-3xl text-foreground mt-3 leading-none">
          {formatCurrency(property.price)}
        </p>
        <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground italic">
          <span>{property.bedrooms} beds</span>
          <span className="text-foreground/25">/</span>
          <span>{property.bathrooms} baths</span>
          <span className="text-foreground/25">/</span>
          <span>{formatNumber(property.sqft)} sqft</span>
        </div>
      </div>
    </article>
  )
}

function SummaryCard({
  title,
  winner,
  property1,
  property2,
}: {
  title: string
  winner: 1 | 2
  property1: Property
  property2: Property
}) {
  const winningProperty = winner === 1 ? property1 : property2

  return (
    <div className="border border-ink/20 bg-card overflow-hidden">
      <div className="border-b border-ink/15 bg-muted px-4 py-2.5">
        <span className="font-display italic text-base text-foreground">{title}</span>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span
            className={`w-2 h-2 rotate-45 ${
              winner === 1 ? 'bg-foreground' : 'bg-accent'
            }`}
          />
          <span className="text-sm text-muted-foreground italic">
            Property {winner} wins
          </span>
        </div>
        <p className="font-display text-xl text-foreground leading-tight truncate">
          {winningProperty.address.split(',')[0]}
        </p>
      </div>
    </div>
  )
}

function ComparisonTable({ items }: { items: ComparisonItem[] }) {
  const formatValue = (value: string | number | null | undefined, format?: string) => {
    if (value === null || value === undefined) return '—'
    if (format === 'currency') return formatCurrency(value as number)
    if (format === 'number') return formatNumber(value as number)
    return String(value)
  }

  return (
    <div className="border border-ink/20 bg-card overflow-hidden">
      <div className="grid grid-cols-[1.4fr_1fr_1fr] border-b border-ink/15 bg-foreground text-background">
        <div className="px-4 py-3 text-sm font-medium">
          <span className="font-display italic mr-1.5">the</span>
          Metric
        </div>
        <div className="px-4 py-3 text-sm font-medium border-l border-background/15 flex items-center gap-2">
          <span className="w-2 h-2 rotate-45 bg-background" />
          First property
        </div>
        <div className="px-4 py-3 text-sm font-medium border-l border-background/15 flex items-center gap-2">
          <span className="w-2 h-2 rotate-45 bg-accent" />
          Second property
        </div>
      </div>
      <div className="divide-soft">
        {items.map((item, idx) => (
          <div key={idx} className="grid grid-cols-[1.4fr_1fr_1fr]">
            <div className="px-4 py-3 text-sm text-muted-foreground border-r border-ink/15 flex items-center">
              {item.label}
            </div>
            <div
              className={`px-4 py-3 font-display text-lg flex items-center justify-between gap-2 border-r border-ink/15 ${
                item.winner === 1 ? 'bg-accent/25 text-foreground' : 'text-foreground/80'
              }`}
            >
              <span>{formatValue(item.value1, item.format)}</span>
              {item.winner === 1 && (
                <span className="text-xs font-semibold italic text-foreground/80">
                  &mdash; wins
                </span>
              )}
            </div>
            <div
              className={`px-4 py-3 font-display text-lg flex items-center justify-between gap-2 ${
                item.winner === 2 ? 'bg-accent/25 text-foreground' : 'text-foreground/80'
              }`}
            >
              <span>{formatValue(item.value2, item.format)}</span>
              {item.winner === 2 && (
                <span className="text-xs font-semibold italic text-foreground/80">
                  &mdash; wins
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
