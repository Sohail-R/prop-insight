'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

interface ComparisonChartProps {
  data: Array<{
    name: string
    property1: number
    property2: number
  }>
  title: string
  subtitle?: string
}

export function ComparisonChart({ data, title, subtitle }: ComparisonChartProps) {
  return (
    <div className="border border-ink/20 bg-card overflow-hidden">
      <div className="border-b border-ink/15 px-4 py-2.5 bg-muted flex items-center justify-between">
        <span className="font-display italic text-base text-foreground">{title}</span>
        {subtitle && (
          <span className="text-sm text-muted-foreground italic">{subtitle}</span>
        )}
      </div>

      <div className="h-64 p-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 16, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="2 4" stroke="var(--border-soft)" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: 'var(--muted-foreground)', fontSize: 12, fontFamily: 'var(--font-sans)' }}
              axisLine={{ stroke: 'var(--foreground)', strokeWidth: 1.5 }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: 'var(--muted-foreground)', fontSize: 12, fontFamily: 'var(--font-sans)' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              cursor={{ fill: 'color-mix(in oklch, var(--foreground) 6%, transparent)' }}
              contentStyle={{
                backgroundColor: 'var(--card)',
                border: '1.5px solid var(--foreground)',
                borderRadius: 4,
                fontSize: '13px',
                fontFamily: 'var(--font-sans)',
              }}
              labelStyle={{ color: 'var(--foreground)', fontWeight: 600, fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}
              itemStyle={{ color: 'var(--muted-foreground)' }}
            />
            <Legend
              wrapperStyle={{ paddingTop: '12px' }}
              formatter={value => (
                <span
                  style={{
                    color: 'var(--muted-foreground)',
                    fontSize: '13px',
                    fontFamily: 'var(--font-sans)',
                    fontStyle: 'italic',
                  }}
                >
                  {value === 'property1' ? 'First property' : 'Second property'}
                </span>
              )}
            />
            <Bar dataKey="property1" fill="var(--chart-1)" name="property1" radius={[2, 2, 0, 0]} />
            <Bar dataKey="property2" fill="var(--chart-2)" name="property2" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
