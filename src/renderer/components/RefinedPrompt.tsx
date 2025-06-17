import React, { useState } from 'react'

interface RefinedPromptProps {
  originalPrompt: string
  refinedPrompt: string
  onReanalyze?: () => void
}

export function RefinedPrompt({ originalPrompt, refinedPrompt, onReanalyze }: RefinedPromptProps) {
  const [copied, setCopied] = useState(false)
  const [showOriginal, setShowOriginal] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(refinedPrompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
      <div className="border-b border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Refined Prompt</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowOriginal(!showOriginal)}
              className="text-sm text-gray-400 hover:text-gray-300 transition-colors"
            >
              {showOriginal ? 'Show Refined' : 'Show Original'}
            </button>
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-800 hover:bg-gray-700 rounded-md transition-colors"
            >
              {copied ? (
                <>
                  <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="relative">
          <pre className="whitespace-pre-wrap text-sm text-gray-300 font-mono leading-relaxed">
            {showOriginal ? originalPrompt : refinedPrompt}
          </pre>
          {showOriginal && (
            <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center">
              <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">Original Prompt</span>
            </div>
          )}
        </div>
      </div>

      {onReanalyze && (
        <div className="border-t border-gray-800 px-6 py-4">
          <button
            onClick={onReanalyze}
            className="w-full px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md text-sm font-medium transition-colors"
          >
            Re-analyze with Improvements
          </button>
        </div>
      )}
    </div>
  )
}
