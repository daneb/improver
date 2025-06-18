import { useState, useEffect } from 'react'
import type { IElectronAPI } from './electron'
import { PromptInput } from './components/PromptInput'
import { ResultsDisplay, type AnalysisResult } from './components/ResultsDisplay'
import { RefinedPrompt } from './components/RefinedPrompt'
import { ModelStatus } from './components/ModelStatus'

function App() {
  const [version, setVersion] = useState<string>('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [currentPrompt, setCurrentPrompt] = useState('')
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [refinedPrompt, setRefinedPrompt] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [modelEnabled, setModelEnabled] = useState(() => {
    // Default to enabled, let the app figure it out
    return localStorage.getItem('modelEnabled') !== 'false'
  })
  const [modelStatus, setModelStatus] = useState<'checking' | 'available' | 'unavailable'>('checking')

  useEffect(() => {
    // Test our Electron API connection
    if (window.electronAPI) {
      window.electronAPI.getVersion().then(setVersion)
    }
    
    // Check model status in background
    checkModelStatus()
  }, [])

  const checkModelStatus = async () => {
    if (!modelEnabled) {
      setModelStatus('unavailable')
      return
    }

    try {
      const status = await window.electronAPI.llm.checkStatus()
      if (status.isRunning && status.availableModels.length > 0) {
        setModelStatus('available')
      } else {
        setModelStatus('unavailable')
      }
    } catch {
      setModelStatus('unavailable')
    }
  }

  const toggleModelMode = (enabled: boolean) => {
    setModelEnabled(enabled)
    localStorage.setItem('modelEnabled', enabled ? 'true' : 'false')
    if (enabled) {
      checkModelStatus()
    } else {
      setModelStatus('unavailable')
    }
  }

  const handleAnalyzePrompt = async (prompt: string) => {
    setIsAnalyzing(true)
    setCurrentPrompt(prompt)
    setError(null)
    
    try {
      const result = await window.electronAPI.llm.analyzePrompt(prompt)
      
      if (result.success) {
        setAnalysisResult(result.analysis)
        setRefinedPrompt(result.refinedPrompt)
        // If we succeeded, update model status
        if (modelEnabled) {
          setModelStatus('available')
        }
      } else {
        setError(result.error || 'Failed to analyze prompt')
        // If model failed, update status
        if (modelEnabled) {
          setModelStatus('unavailable')
        }
      }
    } catch (error) {
      console.error('Analysis failed:', error)
      setError('Failed to analyze prompt. Please ensure Ollama is running.')
      if (modelEnabled) {
        setModelStatus('unavailable')
      }
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleReanalyze = () => {
    if (refinedPrompt) {
      handleAnalyzePrompt(refinedPrompt)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <header className="mb-12">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Improver
              </h1>
              <p className="text-gray-400 mt-2">
                AI-powered prompt engineering assistant for developers
              </p>
              {version && (
                <p className="text-xs text-gray-600 mt-1">Version {version}</p>
              )}
            </div>
            <ModelStatus 
              enabled={modelEnabled}
              status={modelStatus}
              onToggle={toggleModelMode}
              onRetry={checkModelStatus}
            />
          </div>
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
              {modelEnabled && modelStatus === 'unavailable' && (
                <p className="text-red-400 text-sm mt-2">
                  Tip: Make sure Ollama is running with <code className="text-red-300">ollama serve</code>
                </p>
              )}
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
