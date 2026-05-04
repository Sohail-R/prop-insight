'use client'

import { useState, useMemo } from 'react'
import { formatCurrency } from '@/lib/format'

interface MortgageCalculatorProps {
  price: number
  propertyTax?: number
  hoaFees?: number
}

export function MortgageCalculator({ price, propertyTax = 0, hoaFees = 0 }: MortgageCalculatorProps) {
  const [downPaymentPercent, setDownPaymentPercent] = useState(20)
  const [interestRate, setInterestRate] = useState(6.5)
  const [loanTerm, setLoanTerm] = useState(30)

  const calculations = useMemo(() => {
    const downPayment = price * (downPaymentPercent / 100)
    const loanAmount = price - downPayment
    const monthlyRate = interestRate / 100 / 12
    const numPayments = loanTerm * 12
    const monthlyPI =
      monthlyRate === 0
        ? loanAmount / numPayments
        : (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
          (Math.pow(1 + monthlyRate, numPayments) - 1)
    const monthlyTax = propertyTax / 12
    const totalMonthly = monthlyPI + monthlyTax + hoaFees
    const totalInterest = monthlyPI * numPayments - loanAmount

    return { downPayment, loanAmount, monthlyPI, monthlyTax, totalMonthly, totalInterest }
  }, [price, downPaymentPercent, interestRate, loanTerm, propertyTax, hoaFees])

  return (
    <div className="space-y-6">
      {/* Result */}
      <div className="border border-ink/20 bg-accent/30">
        <div className="border-b border-ink/15 px-4 py-2.5 bg-foreground text-background">
          <span className="text-sm font-medium">
            <span className="font-display italic mr-1.5">Your</span>
            estimated monthly payment
          </span>
        </div>
        <div className="p-5">
          <p className="font-display text-5xl text-foreground leading-none">
            {formatCurrency(calculations.totalMonthly)}
          </p>
        </div>
      </div>

      {/* Breakdown */}
      <div>
        <h4 className="font-display italic text-lg text-foreground mb-2 flex items-center gap-2">
          <span className="inline-block w-1.5 h-1.5 rotate-45 bg-accent" />
          Breakdown
        </h4>
        <div className="border border-ink/20 bg-card divide-soft">
          <BreakdownRow label="Principal &amp; interest" value={formatCurrency(calculations.monthlyPI)} />
          <BreakdownRow label="Property tax" value={formatCurrency(calculations.monthlyTax)} />
          {hoaFees > 0 && <BreakdownRow label="HOA fees" value={formatCurrency(hoaFees)} />}
        </div>
      </div>

      {/* Sliders */}
      <div className="space-y-5">
        <SliderInput
          label="Down payment"
          value={downPaymentPercent}
          onChange={setDownPaymentPercent}
          min={0}
          max={100}
          step={5}
          suffix="%"
          secondaryValue={formatCurrency(calculations.downPayment)}
        />
        <SliderInput
          label="Interest rate"
          value={interestRate}
          onChange={setInterestRate}
          min={1}
          max={15}
          step={0.125}
          suffix="%"
        />

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Loan term</span>
          </div>
          <div className="flex border border-ink/30 rounded-sm overflow-hidden">
            {[15, 20, 30].map((term, i) => (
              <button
                key={term}
                onClick={() => setLoanTerm(term)}
                className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                  i > 0 ? 'border-l border-ink/15' : ''
                } ${loanTerm === term ? 'bg-foreground text-background' : 'bg-card text-foreground hover:bg-muted'}`}
              >
                {term} years
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loan info */}
      <div className="border-t border-ink/15 pt-4 space-y-2">
        <InfoRow label="Loan amount" value={formatCurrency(calculations.loanAmount)} />
        <InfoRow label="Total interest" value={formatCurrency(calculations.totalInterest)} />
      </div>
    </div>
  )
}

function BreakdownRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="font-display text-lg text-foreground leading-none">{value}</span>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="font-display text-base text-foreground">{value}</span>
    </div>
  )
}

function SliderInput({
  label,
  value,
  onChange,
  min,
  max,
  step,
  suffix,
  secondaryValue,
}: {
  label: string
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  step: number
  suffix?: string
  secondaryValue?: string
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-muted-foreground">{label}</span>
        <div className="flex items-baseline gap-2">
          <span className="font-display text-xl text-foreground leading-none">
            {value}
            {suffix}
          </span>
          {secondaryValue && (
            <span className="text-sm text-muted-foreground italic">
              ({secondaryValue})
            </span>
          )}
        </div>
      </div>
      <input
        type="range"
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        min={min}
        max={max}
        step={step}
        className="w-full h-1 bg-foreground/30 appearance-none cursor-pointer accent-foreground rounded-full"
      />
    </div>
  )
}
