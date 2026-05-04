import { formatCurrency } from '@/lib/format'

interface PriceHistoryProps {
  history: Array<{
    date: string
    price: number
    event: string
  }>
}

export function PriceHistory({ history }: PriceHistoryProps) {
  if (!history || history.length === 0) {
    return null
  }

  return (
    <div>
      <h4 className="text-sm font-medium text-foreground mb-3">Price History</h4>
      <div className="space-y-3">
        {history.slice(0, 5).map((item, index) => (
          <div 
            key={index} 
            className="flex items-center justify-between py-2 border-b border-border last:border-0"
          >
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-chart-1" />
              <div>
                <p className="text-sm font-medium text-foreground">{item.event}</p>
                <p className="text-xs text-muted-foreground">{item.date}</p>
              </div>
            </div>
            <span className="text-sm font-semibold text-foreground">
              {formatCurrency(item.price)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
