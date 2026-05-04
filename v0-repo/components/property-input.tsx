'use client'

import { useState } from 'react'
import { Spinner } from '@/components/ui/spinner'
import { Button } from '@/components/ui/button'

interface PropertyInputProps {
  onSubmit: (url: string, pageContent?: string) => void
  isLoading: boolean
  propertyCount: number
  needsManualInput?: boolean
  manualInputInstructions?: string[]
  pendingUrl?: string
}

export function PropertyInput({ 
  onSubmit, 
  isLoading, 
  propertyCount,
  needsManualInput,
  manualInputInstructions,
  pendingUrl
}: PropertyInputProps) {
  const [url, setUrl] = useState('')
  const [pageContent, setPageContent] = useState('')
  const [showPasteModal, setShowPasteModal] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (url.trim() && !isLoading) {
      onSubmit(url.trim())
      setUrl('')
    }
  }

  const handlePasteSubmit = () => {
    if (pageContent.trim() && pendingUrl) {
      onSubmit(pendingUrl, pageContent.trim())
      setPageContent('')
      setShowPasteModal(false)
    }
  }

  const isValidZillowUrl = url.includes('zillow.com')

  // Show paste modal when manual input is needed
  if (needsManualInput || showPasteModal) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-start gap-3 mb-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-amber-100 flex-shrink-0">
              <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Zillow blocks automated requests</h3>
              <p className="text-sm text-muted-foreground mt-1">
                No worries - just paste the page source and we&apos;ll extract all the real data.
              </p>
            </div>
          </div>

          {manualInputInstructions && (
            <div className="bg-secondary rounded-lg p-4 mb-4">
              <p className="text-sm font-medium text-foreground mb-2">Quick steps:</p>
              <ol className="text-sm text-muted-foreground space-y-1">
                {manualInputInstructions.map((instruction, i) => (
                  <li key={i}>{instruction}</li>
                ))}
              </ol>
            </div>
          )}

          <textarea
            value={pageContent}
            onChange={(e) => setPageContent(e.target.value)}
            placeholder="Paste the page source here (Ctrl+V / Cmd+V)..."
            className="w-full h-40 p-3 bg-background border border-border rounded-lg text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-ring"
          />

          <div className="flex gap-3 mt-4">
            <Button
              onClick={handlePasteSubmit}
              disabled={!pageContent.trim() || isLoading}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <Spinner className="w-4 h-4 mr-2" />
                  Extracting data...
                </>
              ) : (
                'Extract Property Data'
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setShowPasteModal(false)
                setPageContent('')
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
      <div className="relative">
        <div className="flex items-center gap-3 p-2 bg-card border border-border rounded-xl shadow-sm focus-within:ring-2 focus-within:ring-ring focus-within:border-transparent transition-all">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-secondary flex-shrink-0">
            <svg className="w-5 h-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste a Zillow property link..."
            className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground text-base"
            disabled={isLoading}
          />
          
          <button
            type="submit"
            disabled={isLoading || !url.trim() || !isValidZillowUrl}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium text-sm transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Spinner className="w-4 h-4" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>Analyze</span>
              </>
            )}
          </button>
        </div>
      </div>
      
      <div className="flex items-center justify-center gap-4 mt-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${propertyCount >= 1 ? 'bg-success' : 'bg-border'}`} />
          Property 1
        </span>
        <span className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${propertyCount >= 2 ? 'bg-success' : 'bg-border'}`} />
          Property 2
        </span>
      </div>
      
      {url && !isValidZillowUrl && (
        <p className="text-center text-sm text-destructive mt-2">
          Please enter a valid Zillow URL
        </p>
      )}
    </form>
  )
}
