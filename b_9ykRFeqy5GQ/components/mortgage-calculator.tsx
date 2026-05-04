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

    // Monthly principal & interest
    const monthlyPI =
      monthlyRate === 0
        ? loanAmount / numPayments
        : (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
          (Math.pow(1 + monthlyRate, numPayments) - 1)

    // Monthly property tax
    const monthlyTax = propertyTax / 12

    // Total monthly payment
    const totalMonthly = monthlyPI + monthlyTax + hoaFees

    // Total interest over life of loan
    const totalInterest = monthlyPI * numPayments - loanAmount

    return {
      downPayment,
      loanAmount,
      monthlyPI,
      monthlyTax,
      totalMonthly,
      totalInterest,
    }
  }, [price, downPaymentPercent, interestRate, loanTerm, propertyTax, hoaFees])

  return (
    <div className="space-y-6">
      {/* Results Summary */}
      <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
        <p className="text-sm text-muted-foreground mb-1">Estimated Monthly Payment</p>
        <p className="text-3xl font-bold text-foreground">
          {formatCurrency(calculations.totalMonthly)}
        </p>
      </div>

      {/* Payment Breakdown */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-foreground">Payment Breakdown</h4>
        <div className="space-y-2">
          <BreakdownRow 
            label="Principal & Interest" 
            value={formatCurrency(calculations.monthlyPI)}
            color="bg-chart-1"
          />
          <BreakdownRow 
            label="Property Tax" 
            value={formatCurrency(calculations.monthlyTax)}
            color="bg-chart-2"
          />
          {hoaFees > 0 && (
            <BreakdownRow 
              label="HOA Fees" 
              value={formatCurrency(hoaFees)}
              color="bg-chart-3"
            />
          )}
        </div>
      </div>

      {/* Sliders */}
      <div className="space-y-4">
        <SliderInput
          label="Down Payment"
          value={downPaymentPercent}
          onChange={setDownPaymentPercent}
          min={0}
          max={100}
          step={5}
          suffix="%"
          secondaryValue={formatCurrency(calculations.downPayment)}
        />

        <SliderInput
          label="Interest Rate"
          value={interestRate}
          onChange={setInterestRate}
          min={1}
          max={15}
          step={0.125}
          suffix="%"
        />

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Loan Term</span>
          </div>
          <div className="flex gap-2">
            {[15, 20, 30].map((term) => (
              <button
                key={term}
                onClick={() => setLoanTerm(term)}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  loanTerm === term
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                {term} years
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="pt-4 border-t border-border space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Loan Amount</span>
          <span className="font-medium text-foreground">{formatCurrency(calculations.loanAmount)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Total Interest</span>
          <span className="font-medium text-foreground">{formatCurrency(calculations.totalInterest)}</span>
        </div>
      </div>
    </div>
  )
}

function BreakdownRow({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className={`w-3 h-3 rounded-full ${color}`} />
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <span className="text-sm font-medium text-foreground">{value}</span>
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
        <span className="text-sm font-medium text-foreground">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground">
            {value}{suffix}
          </span>
          {secondaryValue && (
            <span className="text-xs text-muted-foreground">({secondaryValue})</span>
          )}
        </div>
      </div>
      <input
        type="range"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        max={max}
        step={step}
        className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
      />
    </div>
  )
}
