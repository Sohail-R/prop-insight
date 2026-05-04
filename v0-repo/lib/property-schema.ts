import { z } from 'zod'

export const propertySchema = z.object({
  // Basic Info
  address: z.string().describe('Full street address of the property'),
  city: z.string().describe('City name'),
  state: z.string().describe('State abbreviation'),
  zipCode: z.string().describe('ZIP code'),
  
  // Financial
  price: z.number().describe('Listing price in USD'),
  pricePerSqFt: z.number().nullable().describe('Price per square foot'),
  estimatedMortgage: z.number().nullable().describe('Estimated monthly mortgage payment'),
  propertyTax: z.number().nullable().describe('Annual property tax'),
  hoaFees: z.number().nullable().describe('Monthly HOA fees if applicable'),
  zestimate: z.number().nullable().describe('Zillow estimated value'),
  rentEstimate: z.number().nullable().describe('Estimated monthly rent'),
  
  // Property Details
  bedrooms: z.number().describe('Number of bedrooms'),
  bathrooms: z.number().describe('Number of bathrooms'),
  sqft: z.number().describe('Total square footage'),
  lotSize: z.number().nullable().describe('Lot size in square feet'),
  yearBuilt: z.number().nullable().describe('Year the property was built'),
  propertyType: z.string().describe('Type of property (Single Family, Condo, Townhouse, etc.)'),
  stories: z.number().nullable().describe('Number of stories'),
  parkingSpaces: z.number().nullable().describe('Number of parking spaces'),
  
  // Features
  hasPool: z.boolean().nullable().describe('Whether property has a pool'),
  hasGarage: z.boolean().nullable().describe('Whether property has a garage'),
  hasBasement: z.boolean().nullable().describe('Whether property has a basement'),
  heatingType: z.string().nullable().describe('Type of heating system'),
  coolingType: z.string().nullable().describe('Type of cooling system'),
  
  // Market Data
  daysOnMarket: z.number().nullable().describe('Days the property has been listed'),
  priceHistory: z.array(z.object({
    date: z.string(),
    price: z.number(),
    event: z.string(),
  })).describe('Price change history'),
  
  // Neighborhood
  walkScore: z.number().nullable().describe('Walk Score (0-100)'),
  transitScore: z.number().nullable().describe('Transit Score (0-100)'),
  bikeScore: z.number().nullable().describe('Bike Score (0-100)'),
  schoolRating: z.number().nullable().describe('Average nearby school rating (1-10)'),
  crimeIndex: z.string().nullable().describe('Crime level (Low, Medium, High)'),
  
  // Additional
  description: z.string().nullable().describe('Property description'),
  imageUrl: z.string().nullable().describe('Main property image URL'),
  listingUrl: z.string().describe('Original Zillow listing URL'),
})

export type Property = z.infer<typeof propertySchema>

export interface ComparisonMetric {
  label: string
  property1Value: string | number | null
  property2Value: string | number | null
  winner: 1 | 2 | 'tie' | null
  category: 'financial' | 'size' | 'features' | 'neighborhood'
}
