import React from 'react'

export interface AnalysisResult {
  complexity: 'simple' | 'moderate' | 'complex'
  technique: string
  techniqueDescription: string
  structure: string[]
  keyElements: string[]
  improvements?: string[]
}

interface ResultsDisplayProps {
  result: AnalysisResult | null
  isLoading?: boolean
}

const complexityColors = {
  simple: 'from-green-500 to-emerald-500',
  moderate: 'from-yellow-500 to-orange-500',
  complex: 'from-red-500 to-pink-500',
}

const complexityLabels = {
  simple: 'Simple',
  moderate: 'Moderate',
  complex: 'Complex',
}

export function ResultsDisplay({ result, isLoading }: ResultsDisplayProps) {
  if (isLoading) {
    return (
      <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <svg className="animate-spin h-8 w-8 mx-auto mb-4 text-blue-500" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <p className="text-gray-400">Analyzing your prompt...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!result) {
    return null
  }

  return (
    <div className="space-y-4">
      {/* Complexity Badge */}
      <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
        <h3 className="text-lg font-semibold mb-3">Complexity Analysis</h3>
        <div className="flex items-center gap-4">
          <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${complexityColors[result.complexity]} text-white`}>
            {complexityLabels[result.complexity]}
          </span>
          <p className="text-gray-400 text-sm">
            Your prompt requires {result.complexity === 'simple' ? 'basic' : result.complexity === 'moderate' ? 'intermediate' : 'advanced'} techniques for optimal results.
          </p>
        </div>
      </div>

      {/* Recommended Technique */}
      <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
        <h3 className="text-lg font-semibold mb-3">Recommended Technique</h3>
        <div className="space-y-3">
          <h4 className="text-blue-400 font-medium">{result.technique}</h4>
          <p className="text-gray-300 text-sm leading-relaxed">{result.techniqueDescription}</p>
        </div>
      </div>

      {/* Prompt Structure */}
      <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
        <h3 className="text-lg font-semibold mb-3">Suggested Structure</h3>
        <ol className="space-y-2">
          {result.structure.map((item, index) => (
            <li key={index} className="flex gap-3">
              <span className="text-purple-400 font-mono text-sm">{index + 1}.</span>
              <span className="text-gray-300 text-sm">{item}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Key Elements */}
      <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
        <h3 className="text-lg font-semibold mb-3">Key Elements to Include</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {result.keyElements.map((element, index) => (
            <div key={index} className="flex items-start gap-2">
              <svg className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-gray-300 text-sm">{element}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Improvements (if any) */}
      {result.improvements && result.improvements.length > 0 && (
        <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
          <h3 className="text-lg font-semibold mb-3">Suggested Improvements</h3>
          <ul className="space-y-2">
            {result.improvements.map((improvement, index) => (
              <li key={index} className="flex items-start gap-2">
                <svg className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-gray-300 text-sm">{improvement}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
