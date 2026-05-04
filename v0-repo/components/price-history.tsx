import { formatCurrency } from '@/lib/format'

interface PriceHistoryProps {
  history: Array<{
    date: string
    price: number
    event: string
  }>
}

export function PriceHistory({ history }: PriceHistoryProps) {
  if (!history || history.length === 0) return null

  return (
    <div>
      <h4 className="font-display italic text-lg text-foreground mb-2 flex items-center gap-2">
        <span className="inline-block w-1.5 h-1.5 rotate-45 bg-accent" />
        Price history
      </h4>
      <div className="border border-ink/20 bg-card divide-soft">
        {history.slice(0, 5).map((item, index) => (
          <div key={index} className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rotate-45 bg-foreground" />
              <div>
                <p className="text-sm font-medium text-foreground">{item.event}</p>
                <p className="text-xs text-muted-foreground mt-0.5 italic">{item.date}</p>
              </div>
            </div>
            <span className="font-display text-lg text-foreground leading-none">
              {formatCurrency(item.price)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
