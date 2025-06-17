import { useState, useEffect } from 'react'
import type { IElectronAPI } from './electron'
import { PromptInput } from './components/PromptInput'
import { ResultsDisplay, type AnalysisResult } from './components/ResultsDisplay'
import { RefinedPrompt } from './components/RefinedPrompt'
import { OllamaSetup } from './components/OllamaSetup'

function App() {
  const [version, setVersion] = useState<string>('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [currentPrompt, setCurrentPrompt] = useState('')
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [refinedPrompt, setRefinedPrompt] = useState('')
  const [isSetupComplete, setIsSetupComplete] = useState(() => {
    // Check if we should skip setup via env var or localStorage
    return localStorage.getItem('skipOllamaSetup') === 'true'
  })
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Test our Electron API connection
    if (window.electronAPI) {
      window.electronAPI.getVersion().then(setVersion)
    }
  }, [])

  const handleAnalyzePrompt = async (prompt: string) => {
    setIsAnalyzing(true)
    setCurrentPrompt(prompt)
    setError(null)
    
    try {
      const result = await window.electronAPI.llm.analyzePrompt(prompt)
      setAnalysisResult(result.analysis)
      setRefinedPrompt(result.refinedPrompt)
    } catch (error) {
      console.error('Analysis failed:', error)
      setError('Failed to analyze prompt. Please ensure Ollama is running.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleReanalyze = () => {
    if (refinedPrompt) {
      handleAnalyzePrompt(refinedPrompt)
    }
  }

  // Show setup screen if Ollama is not ready
  if (!isSetupComplete) {
    return (
      <OllamaSetup 
        onComplete={() => {
          setIsSetupComplete(true)
          // Remember the choice
          localStorage.setItem('skipOllamaSetup', 'true')
        }} 
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <header className="mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Improver
          </h1>
          <p className="text-gray-400 mt-2">
            AI-powered prompt engineering assistant for developers
          </p>
          {version && (
            <p className="text-xs text-gray-600 mt-1">Version {version}</p>
          )}
        </header>
        
        <main className="space-y-8">
          {/* Prompt Input Section */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Enter Your Prompt</h2>
            <PromptInput 
              onSubmit={handleAnalyzePrompt}
              isLoading={isAnalyzing}
            />
          </section>

          {/* Error Display */}
          {error && (
            <div className="bg-red-900/20 border border-red-800 rounded-lg p-4">
              <p className="text-red-400">{error}</p>
            </div>
          )}

          {/* Results Section */}
          {(isAnalyzing || analysisResult) && (
            <section className="space-y-6">
              <h2 className="text-xl font-semibold">Analysis Results</h2>
              <ResultsDisplay 
                result={analysisResult}
                isLoading={isAnalyzing}
              />
              
              {analysisResult && refinedPrompt && !isAnalyzing && (
                <RefinedPrompt
                  originalPrompt={currentPrompt}
                  refinedPrompt={refinedPrompt}
                  onReanalyze={handleReanalyze}
                />
              )}
            </section>
          )}
        </main>
      </div>
    </div>
  )
}

export default App
