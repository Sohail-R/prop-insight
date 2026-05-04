import { Property } from '@/lib/property-schema'

interface NeighborhoodInsightsProps {
  property: Property
}

export function NeighborhoodInsights({ property }: NeighborhoodInsightsProps) {
  return (
    <div className="space-y-6">
      {/* Disclaimer */}
      <div className="flex items-center gap-2 p-3 bg-accent/50 rounded-lg">
        <svg className="w-4 h-4 text-muted-foreground flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-xs text-muted-foreground">
          Scores are estimates based on location and price. Visit Zillow for official Walk Score data.
        </p>
      </div>
      
      {/* Scores */}
      <div className="grid grid-cols-3 gap-3">
        <ScoreCard 
          label="Walk Score" 
          score={property.walkScore} 
          icon="walk"
        />
        <ScoreCard 
          label="Transit Score" 
          score={property.transitScore} 
          icon="transit"
        />
        <ScoreCard 
          label="Bike Score" 
          score={property.bikeScore} 
          icon="bike"
        />
      </div>

      {/* School Rating */}
      {property.schoolRating && (
        <div className="p-4 bg-secondary rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-card flex items-center justify-center">
                <svg className="w-5 h-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">School Rating</p>
                <p className="text-xs text-muted-foreground">Nearby schools average</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-2xl font-bold text-foreground">{property.schoolRating}</span>
              <span className="text-sm text-muted-foreground">/10</span>
            </div>
          </div>
          <div className="mt-3 h-2 bg-card rounded-full overflow-hidden">
            <div 
              className="h-full bg-chart-1 rounded-full transition-all"
              style={{ width: `${property.schoolRating * 10}%` }}
            />
          </div>
        </div>
      )}

      {/* Crime Index */}
      {property.crimeIndex && (
        <div className="p-4 bg-secondary rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-card flex items-center justify-center">
              <svg className="w-5 h-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Crime Level</p>
              <p className="text-xs text-muted-foreground">Area safety assessment</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              property.crimeIndex === 'Low' 
                ? 'bg-success/10 text-success' 
                : property.crimeIndex === 'Medium'
                ? 'bg-warning/10 text-warning'
                : 'bg-destructive/10 text-destructive'
            }`}>
              {property.crimeIndex}
            </span>
          </div>
        </div>
      )}

      {/* No Data State */}
      {!property.walkScore && !property.transitScore && !property.bikeScore && !property.schoolRating && !property.crimeIndex && (
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-secondary mb-3">
            <svg className="w-6 h-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <p className="text-sm text-muted-foreground">
            Neighborhood data not available for this property
          </p>
        </div>
      )}
    </div>
  )
}

function ScoreCard({ label, score, icon }: { label: string; score: number | null; icon: string }) {
  const icons: Record<string, React.ReactNode> = {
    walk: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zm-8 7v6m4-6v6m0-6a4 4 0 00-4 0m4 0a4 4 0 014 0m-4 0V9" />
      </svg>
    ),
    transit: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 18l4 4 4-4M8 6l4-4 4 4M3 12h18" />
      </svg>
    ),
    bike: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
      </svg>
    ),
  }

  const getScoreColor = (score: number | null) => {
    if (score === null) return 'text-muted-foreground'
    if (score >= 70) return 'text-success'
    if (score >= 50) return 'text-warning'
    return 'text-destructive'
  }

  return (
    <div className="p-3 bg-secondary rounded-xl text-center">
      <div className="flex items-center justify-center text-muted-foreground mb-2">
        {icons[icon]}
      </div>
      <p className={`text-2xl font-bold ${getScoreColor(score)}`}>
        {score ?? '--'}
      </p>
      <p className="text-xs text-muted-foreground mt-1">{label}</p>
    </div>
  )
}
