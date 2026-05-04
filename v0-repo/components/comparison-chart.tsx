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
    <div className="p-4 bg-secondary/50 rounded-xl">
      <div className="mb-4">
        <h4 className="text-sm font-medium text-foreground">{title}</h4>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
        )}
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="var(--border)" 
              vertical={false}
            />
            <XAxis 
              dataKey="name" 
              tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
              axisLine={{ stroke: 'var(--border)' }}
              tickLine={false}
            />
            <YAxis 
              tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              labelStyle={{ color: 'var(--foreground)', fontWeight: 500 }}
              itemStyle={{ color: 'var(--muted-foreground)' }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              formatter={(value) => (
                <span style={{ color: 'var(--muted-foreground)', fontSize: '12px' }}>
                  {value === 'property1' ? 'Property 1' : 'Property 2'}
                </span>
              )}
            />
            <Bar 
              dataKey="property1" 
              fill="var(--chart-1)" 
              radius={[4, 4, 0, 0]}
              name="property1"
            />
            <Bar 
              dataKey="property2" 
              fill="var(--chart-2)" 
              radius={[4, 4, 0, 0]}
              name="property2"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
