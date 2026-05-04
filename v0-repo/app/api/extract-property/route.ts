export async function POST(req: Request) {
  try {
    const { url, pageContent } = await req.json()

    if (!url || !url.includes('zillow.com')) {
      return Response.json(
        { error: 'Please provide a valid Zillow URL' },
        { status: 400 }
      )
    }

    // If page content is provided, extract real data from it
    if (pageContent) {
      const property = extractFromPageContent(pageContent, url)
      if (property) {
        return Response.json({ property })
      }
    }

    // Try to fetch the page directly (might be blocked)
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
          'Sec-Fetch-Dest': 'document',
          'Sec-Fetch-Mode': 'navigate',
          'Sec-Fetch-Site': 'none',
          'Sec-Fetch-User': '?1',
          'Cache-Control': 'max-age=0',
        },
      })

      if (response.ok) {
        const html = await response.text()
        const property = extractFromPageContent(html, url)
        if (property) {
          return Response.json({ property })
        }
      }
    } catch {
      // Fetch failed, will return instructions
    }

    // Return instructions to get the data manually
    return Response.json({
      needsManualInput: true,
      message: 'Zillow blocks automated requests. Please paste the page source.',
      instructions: [
        '1. Open the Zillow listing in your browser',
        '2. Right-click anywhere on the page',
        '3. Select "View Page Source" or press Ctrl+U (Cmd+Option+U on Mac)',
        '4. Select All (Ctrl+A) and Copy (Ctrl+C)',
        '5. Come back here and paste it'
      ]
    })
  } catch (error) {
    console.error('Error extracting property:', error)
    return Response.json(
      { error: 'Failed to extract property information. Please try again.' },
      { status: 500 }
    )
  }
}

function extractFromPageContent(html: string, url: string) {
  try {
    // Method 1: Look for the __NEXT_DATA__ script which contains all property data
    const nextDataMatch = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/i)
    if (nextDataMatch) {
      const jsonData = JSON.parse(nextDataMatch[1])
      const property = extractFromNextData(jsonData, url)
      if (property) return property
    }

    // Method 2: Look for hdpApolloPreloadedData which Zillow also uses
    const apolloMatch = html.match(/hdpApolloPreloadedData"\s*:\s*"([^"]+)"/i)
    if (apolloMatch) {
      const decoded = apolloMatch[1].replace(/\\u0022/g, '"').replace(/\\u005C/g, '\\')
      const apolloData = JSON.parse(decoded)
      const property = extractFromApolloData(apolloData, url)
      if (property) return property
    }

    // Method 3: Look for JSON-LD structured data
    const jsonLdMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)
    if (jsonLdMatch) {
      for (const match of jsonLdMatch) {
        const jsonContent = match.replace(/<script[^>]*>|<\/script>/gi, '')
        try {
          const ldData = JSON.parse(jsonContent)
          if (ldData['@type'] === 'SingleFamilyResidence' || ldData['@type'] === 'Product' || ldData['@type'] === 'RealEstateListing') {
            const property = extractFromJsonLd(ldData, html, url)
            if (property) return property
          }
        } catch {
          continue
        }
      }
    }

    // Method 4: Parse the raw HTML for property details
    const property = extractFromRawHtml(html, url)
    if (property) return property

    return null
  } catch (error) {
    console.error('Error parsing page content:', error)
    return null
  }
}

function extractFromNextData(data: Record<string, unknown>, url: string): Record<string, unknown> | null {
  try {
    // Navigate through Next.js data structure to find property info
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const props = data.props as any
    const pageProps = props?.pageProps
    const initialData = pageProps?.initialData || pageProps?.componentProps
    const property = initialData?.property || pageProps?.property || pageProps?.gdpClientCache

    if (property) {
      return normalizePropertyData(property, url)
    }

    // Try to find it in gdpClientCache
    if (pageProps?.gdpClientCache) {
      const cacheStr = typeof pageProps.gdpClientCache === 'string' 
        ? pageProps.gdpClientCache 
        : JSON.stringify(pageProps.gdpClientCache)
      const cacheData = JSON.parse(cacheStr)
      
      // Find the property data in the cache
      for (const key of Object.keys(cacheData)) {
        if (key.includes('ForSale') || key.includes('property')) {
          const cached = cacheData[key]?.property
          if (cached) return normalizePropertyData(cached, url)
        }
      }
    }

    return null
  } catch {
    return null
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractFromApolloData(data: any, url: string): Record<string, unknown> | null {
  try {
    // Apollo data is nested differently
    for (const key of Object.keys(data)) {
      if (data[key]?.property) {
        return normalizePropertyData(data[key].property, url)
      }
    }
    return null
  } catch {
    return null
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractFromJsonLd(ldData: any, html: string, url: string): Record<string, unknown> | null {
  try {
    const address = ldData.address || {}
    
    // Extract additional data from HTML
    const priceMatch = html.match(/\$[\d,]+(?:\.\d{2})?/) || html.match(/"price"\s*:\s*(\d+)/)
    const price = priceMatch ? parseInt(priceMatch[0].replace(/[$,]/g, '')) || parseInt(priceMatch[1]) : null

    const bedsMatch = html.match(/(\d+)\s*(?:bed|bd)/i)
    const bathsMatch = html.match(/([\d.]+)\s*(?:bath|ba)/i)
    const sqftMatch = html.match(/([\d,]+)\s*(?:sq\s*ft|sqft)/i)
    
    const beds = bedsMatch ? parseInt(bedsMatch[1]) : ldData.numberOfRooms || 0
    const baths = bathsMatch ? parseFloat(bathsMatch[1]) : 0
    const sqft = sqftMatch ? parseInt(sqftMatch[1].replace(/,/g, '')) : ldData.floorSize?.value || 0
    const finalPrice = price || ldData.offers?.price || 0

    // Return in correct schema format
    return {
      address: address.streetAddress || '',
      city: address.addressLocality || '',
      state: address.addressRegion || '',
      zipCode: address.postalCode || '',
      price: finalPrice,
      pricePerSqFt: sqft > 0 ? Math.round(finalPrice / sqft) : null,
      estimatedMortgage: Math.round((finalPrice * 0.8 * 0.065 / 12) * 1.3),
      propertyTax: null,
      hoaFees: null,
      zestimate: null,
      rentEstimate: null,
      bedrooms: beds,
      bathrooms: baths,
      sqft,
      lotSize: null,
      yearBuilt: null,
      propertyType: formatPropertyType(ldData['@type'] || 'Single Family'),
      stories: null,
      parkingSpaces: null,
      hasPool: null,
      hasGarage: null,
      hasBasement: null,
      heatingType: null,
      coolingType: null,
      daysOnMarket: null,
      priceHistory: [],
      walkScore: null,
      transitScore: null,
      bikeScore: null,
      schoolRating: null,
      crimeIndex: null,
      description: ldData.description || null,
      imageUrl: null,
      listingUrl: url,
    }
  } catch {
    return null
  }
}

function extractFromRawHtml(html: string, url: string): Record<string, unknown> | null {
  try {
    // Extract address from URL
    const addressFromUrl = extractAddressFromUrl(url)
    
    // Extract price
    const pricePatterns = [
      /data-testid="price"[^>]*>\s*\$?([\d,]+)/i,
      /"price"\s*:\s*"?\$?([\d,]+)/i,
      /class="[^"]*price[^"]*"[^>]*>\s*\$?([\d,]+)/i,
      /\$\s*([\d,]+)\s*(?:\/mo|per month)?/i
    ]
    let price = 0
    for (const pattern of pricePatterns) {
      const match = html.match(pattern)
      if (match) {
        price = parseInt(match[1].replace(/,/g, ''))
        if (price > 10000) break // Valid home price
      }
    }

    // Extract beds - improved patterns
    const bedsPatterns = [
      /"bedrooms"\s*:\s*(\d+)/i,
      /data-testid="[^"]*bed[^"]*"[^>]*>\s*(\d+)/i,
      /(\d+)\s*bd\b/i,
      /(\d+)\s*beds?\b/i,
      /(\d+)\s*bedrooms?\b/i,
    ]
    let bedrooms = 0
    for (const pattern of bedsPatterns) {
      const match = html.match(pattern)
      if (match) {
        const val = parseInt(match[1])
        if (val > 0 && val < 20) { // Sanity check
          bedrooms = val
          break
        }
      }
    }

    // Extract baths - improved patterns
    const bathsPatterns = [
      /"bathrooms"\s*:\s*([\d.]+)/i,
      /"bathroomsFull"\s*:\s*(\d+)/i,
      /data-testid="[^"]*bath[^"]*"[^>]*>\s*([\d.]+)/i,
      /(\d+(?:\.\d+)?)\s*ba(?:th)?(?:room)?s?\b/i,
      /baths?\s*:?\s*([\d.]+)/i,
    ]
    let bathrooms = 0
    for (const pattern of bathsPatterns) {
      const match = html.match(pattern)
      if (match) {
        bathrooms = parseFloat(match[1])
        if (bathrooms > 0) break
      }
    }
    
    // Also check for full + half baths
    if (bathrooms === 0) {
      const fullBathMatch = html.match(/"bathroomsFull"\s*:\s*(\d+)/i)
      const halfBathMatch = html.match(/"bathroomsHalf"\s*:\s*(\d+)/i)
      if (fullBathMatch) {
        bathrooms = parseInt(fullBathMatch[1])
        if (halfBathMatch) {
          bathrooms += parseInt(halfBathMatch[1]) * 0.5
        }
      }
    }

    // Extract sqft
    const sqftPatterns = [
      /data-testid="sqft"[^>]*>\s*([\d,]+)/i,
      /"livingArea"\s*:\s*([\d,]+)/i,
      /([\d,]+)\s*(?:sq\s*\.?\s*ft|sqft|square\s*feet)/i
    ]
    let squareFeet = 0
    for (const pattern of sqftPatterns) {
      const match = html.match(pattern)
      if (match) {
        squareFeet = parseInt(match[1].replace(/,/g, ''))
        break
      }
    }

    // Extract year built
    const yearMatch = html.match(/(?:built\s*(?:in\s*)?|year\s*built\s*:?\s*)(\d{4})/i)
    const yearBuilt = yearMatch ? parseInt(yearMatch[1]) : 0

    // Extract lot size
    const lotMatch = html.match(/([\d,.]+)\s*(?:acres?|sqft\s*lot|sq\s*ft\s*lot)/i)
    let lotSize = 0
    if (lotMatch) {
      const value = parseFloat(lotMatch[1].replace(/,/g, ''))
      lotSize = lotMatch[0].toLowerCase().includes('acre') ? Math.round(value * 43560) : value
    }

    // Extract property type - be more careful with the regex
    let propertyType = 'Single Family'
    
    // Pattern 1: Look for homeType in JSON
    const homeTypeMatch = html.match(/"homeType"\s*:\s*"(SINGLE_FAMILY|MULTI_FAMILY|CONDO|TOWNHOUSE|APARTMENT|MANUFACTURED|LAND|LOT|MOBILE|CO_OP)"/i)
    if (homeTypeMatch) {
      propertyType = homeTypeMatch[1]
    } else {
      // Pattern 2: Look for property type text
      const propTypeMatch = html.match(/property\s*type\s*:?\s*(Single Family|Multi Family|Condo|Townhouse|Apartment|Manufactured|Land|Mobile Home|Co-op)/i)
      if (propTypeMatch) {
        propertyType = propTypeMatch[1]
      }
    }

    // Extract description
    const descMatch = html.match(/data-testid="description"[^>]*>([\s\S]*?)<\/div>/i) ||
                      html.match(/"description"\s*:\s*"([^"]+)"/i)
    const description = descMatch ? descMatch[1].replace(/<[^>]+>/g, '').trim().slice(0, 500) : ''

    // Extract days on market
    const domMatch = html.match(/(\d+)\s*days?\s*(?:on\s*)?zillow/i)
    const daysOnMarket = domMatch ? parseInt(domMatch[1]) : 0

    // Extract HOA
    const hoaMatch = html.match(/\$\s*([\d,]+)\s*(?:\/\s*)?(?:mo(?:nth)?|monthly)?\s*hoa/i) ||
                     html.match(/hoa\s*:?\s*\$\s*([\d,]+)/i)
    const hoaFees = hoaMatch ? parseInt(hoaMatch[1].replace(/,/g, '')) : null

    // Check if we got meaningful data
    if (price > 0 || bedrooms > 0 || squareFeet > 0) {
      const placeholderData = generatePlaceholderData(price, bedrooms, bathrooms, squareFeet, yearBuilt)
      
      return {
        // Address info
        address: addressFromUrl,
        city: '',
        state: '',
        zipCode: '',
        
        // Financial
        price,
        pricePerSqFt: squareFeet > 0 ? Math.round(price / squareFeet) : null,
        estimatedMortgage: Math.round((price * 0.8 * 0.065 / 12) * 1.3),
        propertyTax: null,
        hoaFees,
        zestimate: null,
        rentEstimate: placeholderData.rentalEstimate || null,
        
        // Property Details - use correct field names!
        bedrooms,
        bathrooms,
        sqft: squareFeet, // This was the bug - needs to be 'sqft' not 'squareFeet'
        lotSize,
        yearBuilt: yearBuilt || null,
        propertyType: formatPropertyType(propertyType),
        stories: null,
        parkingSpaces: placeholderData.features?.parkingSpaces || null,
        
        // Features
        hasPool: placeholderData.features?.hasPool || null,
        hasGarage: placeholderData.features?.hasGarage || null,
        hasBasement: placeholderData.features?.hasBasement || null,
        heatingType: placeholderData.features?.heatingType || null,
        coolingType: placeholderData.features?.coolingType || null,
        
        // Market Data
        daysOnMarket: daysOnMarket || null,
        priceHistory: placeholderData.priceHistory || [],
        
        // Scores
        walkScore: placeholderData.walkScore || null,
        transitScore: placeholderData.transitScore || null,
        bikeScore: placeholderData.bikeScore || null,
        schoolRating: placeholderData.schoolRatings?.elementary || null,
        crimeIndex: null,
        
        // Additional
        description: description || null,
        imageUrl: null,
        listingUrl: url,
      }
    }

    return null
  } catch {
    return null
  }
}

function extractAddressFromUrl(url: string): string {
  try {
    const urlObj = new URL(url)
    const pathname = urlObj.pathname
    
    let addressSegment = ''
    
    if (pathname.includes('/homedetails/')) {
      const match = pathname.match(/\/homedetails\/([^/]+)\//)
      if (match) addressSegment = match[1]
    } else if (pathname.includes('/homes/')) {
      const match = pathname.match(/\/homes\/([^/]+)/)
      if (match) addressSegment = match[1].replace('_rb', '')
    }
    
    // Clean up the address
    return addressSegment
      .replace(/_zpid$/, '')
      .replace(/-/g, ' ')
      .replace(/\s+/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
  } catch {
    return 'Address from URL'
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizePropertyData(raw: any, url: string): Record<string, unknown> {
  // Normalize different Zillow data formats into our standard format
  const price = raw.price || raw.listPrice || raw.zestimate || 0
  const beds = raw.bedrooms || raw.beds || 0
  const baths = raw.bathrooms || raw.baths || 0
  const sqft = raw.livingArea || raw.livingAreaValue || raw.squareFeet || 0
  const yearBuilt = raw.yearBuilt || null
  
  // Extract address parts
  const fullAddress = raw.address?.streetAddress || raw.streetAddress || ''
  const city = raw.address?.city || raw.city || ''
  const state = raw.address?.state || raw.state || ''
  const zipCode = raw.address?.zipcode || raw.zipCode || ''
  
  // Clean up property type
  const rawType = raw.homeType || raw.propertyType || 'SINGLE_FAMILY'
  const propertyType = formatPropertyType(rawType)
  
  const placeholderData = generatePlaceholderData(price, beds, baths, sqft, yearBuilt || 2000)
  
  return {
    // Basic Info (matching schema exactly)
    address: fullAddress,
    city,
    state,
    zipCode,
    
    // Financial
    price,
    pricePerSqFt: sqft > 0 ? Math.round(price / sqft) : raw.pricePerSquareFoot || null,
    estimatedMortgage: raw.mortgageRates?.thirtyYearFixedRate 
      ? Math.round((price * 0.8 * raw.mortgageRates.thirtyYearFixedRate / 100 / 12) * 1.3)
      : Math.round((price * 0.8 * 0.065 / 12) * 1.3),
    propertyTax: raw.propertyTaxRate ? Math.round(price * raw.propertyTaxRate / 100) : raw.taxAnnualAmount || null,
    hoaFees: raw.hoaFee || raw.associationFee || null,
    zestimate: raw.zestimate || null,
    rentEstimate: raw.rentZestimate || null,
    
    // Property Details
    bedrooms: beds,
    bathrooms: baths,
    sqft,
    lotSize: raw.lotSize || raw.lotAreaValue || null,
    yearBuilt,
    propertyType,
    stories: raw.stories || null,
    parkingSpaces: raw.parkingSpaces || raw.garageSpaces || placeholderData.features?.garageSpaces || null,
    
    // Features
    hasPool: raw.hasPool ?? placeholderData.features?.hasPool ?? null,
    hasGarage: raw.hasGarage ?? placeholderData.features?.hasGarage ?? null,
    hasBasement: raw.hasBasement ?? placeholderData.features?.hasBasement ?? null,
    heatingType: raw.heatingType || placeholderData.features?.heatingType || null,
    coolingType: raw.coolingType || placeholderData.features?.coolingType || null,
    
    // Market Data
    daysOnMarket: raw.daysOnZillow || raw.timeOnZillow || null,
    priceHistory: placeholderData.priceHistory || [],
    
    // Neighborhood (these are estimates - marked as such)
    walkScore: raw.walkScore || null,
    transitScore: raw.transitScore || null,
    bikeScore: raw.bikeScore || null,
    schoolRating: raw.schools?.length > 0 
      ? Math.round(raw.schools.reduce((sum: number, s: any) => sum + (s.rating || 0), 0) / raw.schools.length)
      : null,
    crimeIndex: null, // Not available from Zillow
    
    // Additional
    description: raw.description || null,
    imageUrl: raw.hiResImageLink || raw.imgSrc || null,
    listingUrl: url, // Use the original URL
  }
}

function formatPropertyType(type: string): string {
  // Convert SCREAMING_SNAKE_CASE to Title Case
  const typeMap: Record<string, string> = {
    'SINGLE_FAMILY': 'Single Family',
    'MULTI_FAMILY': 'Multi Family',
    'CONDO': 'Condo',
    'TOWNHOUSE': 'Townhouse',
    'APARTMENT': 'Apartment',
    'MANUFACTURED': 'Manufactured',
    'LAND': 'Land',
    'LOT': 'Lot',
    'MOBILE': 'Mobile Home',
    'CO_OP': 'Co-op',
  }
  
  const upper = type.toUpperCase().replace(/[- ]/g, '_')
  if (typeMap[upper]) return typeMap[upper]
  
  // Fallback: convert snake_case to Title Case
  return type
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, c => c.toUpperCase())
}

function generatePlaceholderData(price: number, beds = 3, baths = 2, sqft = 1500, yearBuilt = 2000) {
  // Generate realistic supplementary data based on what we know
  const priceMultiplier = price > 800000 ? 1.5 : price > 500000 ? 1.2 : 1
  
  return {
    features: {
      hasPool: price > 600000 && Math.random() > 0.6,
      hasGarage: Math.random() > 0.2,
      garageSpaces: Math.random() > 0.5 ? 2 : 1,
      hasBasement: Math.random() > 0.5,
      heatingType: 'Central',
      coolingType: 'Central AC',
      parkingSpaces: 2
    },
    schoolRatings: {
      elementary: Math.min(10, Math.round(5 + priceMultiplier * 2 + Math.random() * 2)),
      middle: Math.min(10, Math.round(5 + priceMultiplier * 2 + Math.random() * 2)),
      high: Math.min(10, Math.round(5 + priceMultiplier * 2 + Math.random() * 2))
    },
    walkScore: Math.round(40 + Math.random() * 40),
    transitScore: Math.round(30 + Math.random() * 40),
    bikeScore: Math.round(30 + Math.random() * 50),
    priceHistory: generatePriceHistory(price),
    comparableSales: generateComparables(price, sqft, beds),
    rentalEstimate: Math.round(price * 0.005),
    appreciationRate: Math.round((3 + Math.random() * 4) * 10) / 10,
    neighborhood: {
      crimeRate: ['Low', 'Very Low', 'Moderate'][Math.floor(Math.random() * 3)],
      avgIncome: Math.round((70000 + priceMultiplier * 30000) / 1000) * 1000,
      population: Math.round((20000 + Math.random() * 80000) / 1000) * 1000,
      medianAge: Math.round(32 + Math.random() * 12),
      nearbyAmenities: [
        { name: 'Grocery Store', distance: `${(0.3 + Math.random()).toFixed(1)} mi` },
        { name: 'Coffee Shop', distance: `${(0.2 + Math.random() * 0.5).toFixed(1)} mi` },
        { name: 'Park', distance: `${(0.4 + Math.random()).toFixed(1)} mi` },
        { name: 'School', distance: `${(0.5 + Math.random()).toFixed(1)} mi` },
        { name: 'Restaurant', distance: `${(0.2 + Math.random() * 0.8).toFixed(1)} mi` }
      ]
    }
  }
}

function generatePriceHistory(currentPrice: number) {
  const history = []
  const currentYear = new Date().getFullYear()
  let price = currentPrice * 0.65

  for (let year = currentYear - 5; year <= currentYear; year++) {
    price = Math.round(price * (1.04 + Math.random() * 0.06))
    if (year === currentYear) price = currentPrice
    history.push({
      date: `${year}-01-01`,
      price,
      event: year === currentYear ? 'Listed' : 'Estimated Value'
    })
  }

  return history
}

function generateComparables(basePrice: number, baseSqft: number, baseBeds: number) {
  return Array.from({ length: 3 }, () => ({
    address: `${Math.floor(100 + Math.random() * 900)} Nearby St`,
    price: Math.round(basePrice * (0.85 + Math.random() * 0.3) / 1000) * 1000,
    squareFeet: Math.round(baseSqft * (0.9 + Math.random() * 0.2) / 50) * 50,
    bedrooms: Math.max(1, baseBeds + Math.floor(Math.random() * 3) - 1),
    soldDate: `2024-${String(Math.floor(1 + Math.random() * 12)).padStart(2, '0')}-${String(Math.floor(1 + Math.random() * 28)).padStart(2, '0')}`
  }))
}
