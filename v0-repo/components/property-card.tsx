'use client'

import { useState } from 'react'
import { Property } from '@/lib/property-schema'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MortgageCalculator } from '@/components/mortgage-calculator'
import { NeighborhoodInsights } from '@/components/neighborhood-insights'
import { PriceHistory } from '@/components/price-history'
import { formatCurrency, formatNumber } from '@/lib/format'

interface PropertyCardProps {
  property: Property
  onRemove: () => void
}

export function PropertyCard({ property, onRemove }: PropertyCardProps) {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-0">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-semibold text-foreground truncate">
              {property.address}
            </h2>
            <p className="text-muted-foreground text-sm">
              {property.city}, {property.state} {property.zipCode}
            </p>
          </div>
          <button
            onClick={onRemove}
            className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
            aria-label="Remove property"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="flex items-baseline gap-3 mt-4">
          <span className="text-3xl font-bold text-foreground">
            {formatCurrency(property.price)}
          </span>
          {property.pricePerSqFt && (
            <span className="text-sm text-muted-foreground">
              {formatCurrency(property.pricePerSqFt)}/sqft
            </span>
          )}
        </div>

        {/* Quick Stats */}
        <div className="flex flex-wrap gap-4 mt-4 pb-4 border-b border-border">
          {property.bedrooms > 0 && (
            <Stat icon="bed" value={property.bedrooms} label="Beds" />
          )}
          {property.bathrooms > 0 && (
            <Stat icon="bath" value={property.bathrooms} label="Baths" />
          )}
          {property.sqft > 0 && (
            <Stat icon="sqft" value={formatNumber(property.sqft)} label="Sqft" />
          )}
          {property.yearBuilt && property.yearBuilt > 0 && (
            <Stat icon="calendar" value={property.yearBuilt} label="Built" />
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
            <TabsTrigger value="neighborhood">Area</TabsTrigger>
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4 space-y-4">
            <div className="grid gap-4">
              <DetailSection title="Property Details">
                <DetailRow label="Property Type" value={property.propertyType} />
                {property.lotSize && (
                  <DetailRow label="Lot Size" value={`${formatNumber(property.lotSize)} sqft`} />
                )}
                {property.stories && (
                  <DetailRow label="Stories" value={property.stories} />
                )}
                {property.parkingSpaces && (
                  <DetailRow label="Parking" value={`${property.parkingSpaces} spaces`} />
                )}
              </DetailSection>

              <DetailSection title="Features">
                <div className="flex flex-wrap gap-2">
                  {property.hasPool && <FeatureBadge>Pool</FeatureBadge>}
                  {property.hasGarage && <FeatureBadge>Garage</FeatureBadge>}
                  {property.hasBasement && <FeatureBadge>Basement</FeatureBadge>}
                  {property.heatingType && <FeatureBadge>{property.heatingType} Heating</FeatureBadge>}
                  {property.coolingType && <FeatureBadge>{property.coolingType} Cooling</FeatureBadge>}
                </div>
              </DetailSection>

              {property.description && (
                <DetailSection title="Description">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {property.description.slice(0, 300)}
                    {property.description.length > 300 && '...'}
                  </p>
                </DetailSection>
              )}

              {property.daysOnMarket !== null && (
                <div className="flex items-center gap-2 p-3 bg-secondary rounded-lg">
                  <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm text-muted-foreground">
                    <strong className="text-foreground">{property.daysOnMarket}</strong> days on market
                  </span>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="financial" className="mt-4 space-y-4">
            <div className="grid gap-4">
              <DetailSection title="Costs">
                {property.estimatedMortgage && (
                  <DetailRow 
                    label="Est. Monthly Payment" 
                    value={formatCurrency(property.estimatedMortgage)} 
                    highlight 
                  />
                )}
                {property.propertyTax && (
                  <DetailRow 
                    label="Property Tax (Annual)" 
                    value={formatCurrency(property.propertyTax)} 
                  />
                )}
                {property.hoaFees && (
                  <DetailRow 
                    label="HOA Fees (Monthly)" 
                    value={formatCurrency(property.hoaFees)} 
                  />
                )}
              </DetailSection>

              <DetailSection title="Valuations">
                <DetailRow label="List Price" value={formatCurrency(property.price)} />
                {property.zestimate && (
                  <DetailRow label="Zestimate" value={formatCurrency(property.zestimate)} />
                )}
                {property.rentEstimate && (
                  <DetailRow label="Rent Estimate" value={`${formatCurrency(property.rentEstimate)}/mo`} />
                )}
              </DetailSection>

              {property.priceHistory && property.priceHistory.length > 0 && (
                <PriceHistory history={property.priceHistory} />
              )}
            </div>
          </TabsContent>

          <TabsContent value="neighborhood" className="mt-4">
            <NeighborhoodInsights property={property} />
          </TabsContent>

          <TabsContent value="calculator" className="mt-4">
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
            className="flex items-center justify-center gap-2 w-full mt-6 py-3 bg-secondary text-secondary-foreground rounded-lg font-medium text-sm hover:bg-secondary/80 transition-colors"
          >
            View on Zillow
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        )}
        
        {/* Data accuracy note */}
        <p className="mt-4 text-xs text-muted-foreground text-center">
          Scores and estimates are approximations based on available data
        </p>
      </CardContent>
    </Card>
  )
}

function Stat({ icon, value, label }: { icon: string; value: string | number; label: string }) {
  const icons: Record<string, React.ReactNode> = {
    bed: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v11a2 2 0 002 2h14a2 2 0 002-2V7M3 7l9-4 9 4M3 7h18M9 20v-4a2 2 0 012-2h2a2 2 0 012 2v4" />
      </svg>
    ),
    bath: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 14h16v3a3 3 0 01-3 3H7a3 3 0 01-3-3v-3zm0 0V6a2 2 0 012-2h2a2 2 0 012 2v2" />
      </svg>
    ),
    sqft: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
      </svg>
    ),
    calendar: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-muted-foreground">{icons[icon]}</span>
      <span className="font-semibold text-foreground">{value}</span>
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
  )
}

function DetailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-sm font-medium text-foreground mb-3">{title}</h4>
      {children}
    </div>
  )
}

function DetailRow({ label, value, highlight }: { label: string; value: string | number; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={`text-sm font-medium ${highlight ? 'text-primary' : 'text-foreground'}`}>
        {value}
      </span>
    </div>
  )
}

function FeatureBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="px-3 py-1 bg-accent text-accent-foreground text-xs font-medium rounded-full">
      {children}
    </span>
  )
}
