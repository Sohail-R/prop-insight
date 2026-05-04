'use client'

import { useState, useMemo } from 'react'
import { Property } from '@/lib/property-schema'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatCurrency, formatNumber } from '@/lib/format'
import { ComparisonChart } from '@/components/comparison-chart'
import { ExportComparison } from '@/components/export-comparison'

interface ComparisonViewProps {
  property1: Property
  property2: Property
  onRemove: (index: number) => void
}

interface ComparisonItem {
  label: string
  value1: string | number | null | undefined
  value2: string | number | null | undefined
  winner: 1 | 2 | 'tie' | null
  format?: 'currency' | 'number' | 'text'
  lowerIsBetter?: boolean
}

export function ComparisonView({ property1, property2, onRemove }: ComparisonViewProps) {
  const [activeTab, setActiveTab] = useState('overview')

  const comparisons = useMemo(() => {
    const compare = (
      v1: number | null | undefined,
      v2: number | null | undefined,
      lowerIsBetter = false
    ): 1 | 2 | 'tie' | null => {
      if (v1 === null || v1 === undefined || v2 === null || v2 === undefined) return null
      if (v1 === v2) return 'tie'
      if (lowerIsBetter) return v1 < v2 ? 1 : 2
      return v1 > v2 ? 1 : 2
    }

    const financial: ComparisonItem[] = [
      {
        label: 'List Price',
        value1: property1.price,
        value2: property2.price,
        winner: compare(property1.price, property2.price, true),
        format: 'currency',
        lowerIsBetter: true,
      },
      {
        label: 'Price per Sqft',
        value1: property1.pricePerSqFt,
        value2: property2.pricePerSqFt,
        winner: compare(property1.pricePerSqFt, property2.pricePerSqFt, true),
        format: 'currency',
        lowerIsBetter: true,
      },
      {
        label: 'Est. Mortgage',
        value1: property1.estimatedMortgage,
        value2: property2.estimatedMortgage,
        winner: compare(property1.estimatedMortgage, property2.estimatedMortgage, true),
        format: 'currency',
        lowerIsBetter: true,
      },
      {
        label: 'Property Tax',
        value1: property1.propertyTax,
        value2: property2.propertyTax,
        winner: compare(property1.propertyTax, property2.propertyTax, true),
        format: 'currency',
        lowerIsBetter: true,
      },
      {
        label: 'HOA Fees',
        value1: property1.hoaFees,
        value2: property2.hoaFees,
        winner: compare(property1.hoaFees, property2.hoaFees, true),
        format: 'currency',
        lowerIsBetter: true,
      },
      {
        label: 'Rent Estimate',
        value1: property1.rentEstimate,
        value2: property2.rentEstimate,
        winner: compare(property1.rentEstimate, property2.rentEstimate),
        format: 'currency',
      },
    ]

    const size: ComparisonItem[] = [
      {
        label: 'Bedrooms',
        value1: property1.bedrooms,
        value2: property2.bedrooms,
        winner: compare(property1.bedrooms, property2.bedrooms),
        format: 'number',
      },
      {
        label: 'Bathrooms',
        value1: property1.bathrooms,
        value2: property2.bathrooms,
        winner: compare(property1.bathrooms, property2.bathrooms),
        format: 'number',
      },
      {
        label: 'Square Feet',
        value1: property1.sqft,
        value2: property2.sqft,
        winner: compare(property1.sqft, property2.sqft),
        format: 'number',
      },
      {
        label: 'Lot Size',
        value1: property1.lotSize,
        value2: property2.lotSize,
        winner: compare(property1.lotSize, property2.lotSize),
        format: 'number',
      },
      {
        label: 'Year Built',
        value1: property1.yearBuilt,
        value2: property2.yearBuilt,
        winner: compare(property1.yearBuilt, property2.yearBuilt),
        format: 'number',
      },
    ]

    const neighborhood: ComparisonItem[] = [
      {
        label: 'Walk Score',
        value1: property1.walkScore,
        value2: property2.walkScore,
        winner: compare(property1.walkScore, property2.walkScore),
        format: 'number',
      },
      {
        label: 'Transit Score',
        value1: property1.transitScore,
        value2: property2.transitScore,
        winner: compare(property1.transitScore, property2.transitScore),
        format: 'number',
      },
      {
        label: 'Bike Score',
        value1: property1.bikeScore,
        value2: property2.bikeScore,
        winner: compare(property1.bikeScore, property2.bikeScore),
        format: 'number',
      },
      {
        label: 'School Rating',
        value1: property1.schoolRating,
        value2: property2.schoolRating,
        winner: compare(property1.schoolRating, property2.schoolRating),
        format: 'number',
      },
      {
        label: 'Days on Market',
        value1: property1.daysOnMarket,
        value2: property2.daysOnMarket,
        winner: compare(property1.daysOnMarket, property2.daysOnMarket, true),
        format: 'number',
        lowerIsBetter: true,
      },
    ]

    return { financial, size, neighborhood }
  }, [property1, property2])

  const chartData = useMemo(() => ({
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
  }), [property1, property2])

  return (
    <div className="space-y-6">
      {/* Property Headers */}
      <div className="grid md:grid-cols-2 gap-4">
        <PropertyHeader property={property1} index={0} onRemove={onRemove} colorClass="bg-chart-1" />
        <PropertyHeader property={property2} index={1} onRemove={onRemove} colorClass="bg-chart-2" />
      </div>

      {/* Export Button */}
      <div className="flex justify-end">
        <ExportComparison property1={property1} property2={property2} comparisons={comparisons} />
      </div>

      {/* Comparison Content */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Side-by-Side Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="financial">Financial</TabsTrigger>
              <TabsTrigger value="size">Size</TabsTrigger>
              <TabsTrigger value="area">Area</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6 space-y-8">
              {/* Quick Summary */}
              <div className="grid md:grid-cols-3 gap-4">
                <SummaryCard 
                  title="Better Value" 
                  winner={comparisons.financial.filter(c => c.winner === 1).length > comparisons.financial.filter(c => c.winner === 2).length ? 1 : 2}
                  property1={property1}
                  property2={property2}
                />
                <SummaryCard 
                  title="More Space" 
                  winner={comparisons.size.filter(c => c.winner === 1).length > comparisons.size.filter(c => c.winner === 2).length ? 1 : 2}
                  property1={property1}
                  property2={property2}
                />
                <SummaryCard 
                  title="Better Location" 
                  winner={comparisons.neighborhood.filter(c => c.winner === 1).length > comparisons.neighborhood.filter(c => c.winner === 2).length ? 1 : 2}
                  property1={property1}
                  property2={property2}
                />
              </div>

              {/* All Charts */}
              <div className="grid md:grid-cols-2 gap-6">
                <ComparisonChart 
                  data={chartData.financial} 
                  title="Financial Comparison"
                  subtitle="Price shown in thousands"
                />
                <ComparisonChart 
                  data={chartData.scores} 
                  title="Location Scores"
                  subtitle="All scores out of 100"
                />
              </div>
            </TabsContent>

            <TabsContent value="financial" className="mt-6 space-y-6">
              <ComparisonChart 
                data={chartData.financial} 
                title="Financial Metrics"
                subtitle="Price shown in thousands"
              />
              <ComparisonTable items={comparisons.financial} />
            </TabsContent>

            <TabsContent value="size" className="mt-6 space-y-6">
              <ComparisonChart 
                data={chartData.size} 
                title="Size Comparison"
                subtitle="Square footage shown in hundreds"
              />
              <ComparisonTable items={comparisons.size} />
            </TabsContent>

            <TabsContent value="area" className="mt-6 space-y-6">
              <ComparisonChart 
                data={chartData.scores} 
                title="Neighborhood Scores"
                subtitle="All scores out of 100"
              />
              <ComparisonTable items={comparisons.neighborhood} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

function PropertyHeader({ 
  property, 
  index, 
  onRemove, 
  colorClass 
}: { 
  property: Property
  index: number
  onRemove: (index: number) => void
  colorClass: string
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ${colorClass}`} />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">{property.address}</h3>
            <p className="text-sm text-muted-foreground">
              {property.city}, {property.state} {property.zipCode}
            </p>
            <p className="text-lg font-bold text-foreground mt-1">
              {formatCurrency(property.price)}
            </p>
            <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
              <span>{property.bedrooms} bd</span>
              <span>{property.bathrooms} ba</span>
              <span>{formatNumber(property.sqft)} sqft</span>
            </div>
          </div>
          <button
            onClick={() => onRemove(index)}
            className="p-1.5 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
            aria-label="Remove property"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </CardContent>
    </Card>
  )
}

function SummaryCard({ 
  title, 
  winner, 
  property1, 
  property2 
}: { 
  title: string
  winner: 1 | 2
  property1: Property
  property2: Property
}) {
  const winningProperty = winner === 1 ? property1 : property2

  return (
    <div className="p-4 bg-secondary rounded-xl">
      <p className="text-sm text-muted-foreground mb-1">{title}</p>
      <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${winner === 1 ? 'bg-chart-1' : 'bg-chart-2'}`} />
        <p className="font-medium text-foreground truncate">
          {winningProperty.address.split(',')[0]}
        </p>
      </div>
    </div>
  )
}

function ComparisonTable({ items }: { items: ComparisonItem[] }) {
  const formatValue = (value: string | number | null | undefined, format?: string) => {
    if (value === null || value === undefined) return '--'
    if (format === 'currency') return formatCurrency(value as number)
    if (format === 'number') return formatNumber(value as number)
    return String(value)
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <table className="w-full">
        <thead className="bg-secondary">
          <tr>
            <th className="text-left text-sm font-medium text-muted-foreground py-3 px-4">Metric</th>
            <th className="text-center text-sm font-medium py-3 px-4">
              <div className="flex items-center justify-center gap-2">
                <span className="w-3 h-3 rounded-full bg-chart-1" />
                <span className="text-foreground">Property 1</span>
              </div>
            </th>
            <th className="text-center text-sm font-medium py-3 px-4">
              <div className="flex items-center justify-center gap-2">
                <span className="w-3 h-3 rounded-full bg-chart-2" />
                <span className="text-foreground">Property 2</span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {items.map((item, idx) => (
            <tr key={idx} className="hover:bg-secondary/50 transition-colors">
              <td className="py-3 px-4 text-sm text-muted-foreground">{item.label}</td>
              <td className={`py-3 px-4 text-sm text-center font-medium ${
                item.winner === 1 ? 'text-success bg-success/5' : 'text-foreground'
              }`}>
                {formatValue(item.value1, item.format)}
                {item.winner === 1 && (
                  <svg className="w-4 h-4 inline-block ml-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </td>
              <td className={`py-3 px-4 text-sm text-center font-medium ${
                item.winner === 2 ? 'text-success bg-success/5' : 'text-foreground'
              }`}>
                {formatValue(item.value2, item.format)}
                {item.winner === 2 && (
                  <svg className="w-4 h-4 inline-block ml-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
