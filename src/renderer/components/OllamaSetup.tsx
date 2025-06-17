import React, { useState, useEffect } from 'react'
import type { LLMStatus } from '../../shared/types'

interface OllamaSetupProps {
  onComplete: () => void
}

export function OllamaSetup({ onComplete }: OllamaSetupProps) {
  const [status, setStatus] = useState<LLMStatus | null>(null)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    checkOllamaStatus()
  }, [])

  const checkOllamaStatus = async () => {
    setIsChecking(true)
    try {
      const llmStatus = await window.electronAPI.llm.checkStatus()
      setStatus(llmStatus)
      
      // If Ollama is running and has the model, we're good to go
      if (llmStatus.isRunning && 
          (llmStatus.availableModels.some(m => m.includes('llama3.2')) || 
           llmStatus.availableModels.some(m => m.includes('llama-3.2')))) {
        // Auto-proceed after a short delay
        setTimeout(onComplete, 500)
      }
    } catch (err) {
      console.error('Error checking Ollama:', err)
    } finally {
      setIsChecking(false)
    }
  }

  if (isChecking) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-8 w-8 mx-auto mb-4 text-blue-500" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-gray-400">Checking Ollama...</p>
        </div>
      </div>
    )
  }

  const isReady = status?.isRunning && status.availableModels.some(m => 
    m.includes('llama3.2') || m.includes('llama-3.2')
  )

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-8">
      <div className="max-w-2xl w-full">
        <div className="bg-gray-900 rounded-lg border border-gray-800 p-8">
          <h2 className="text-2xl font-bold mb-6">Ollama Setup</h2>
          
          {!status?.isRunning ? (
            <div className="space-y-4">
              <p className="text-gray-300">
                Please ensure Ollama is running before using Improver.
              </p>
              
              <div className="bg-gray-800 rounded-lg p-4">
                <p className="text-sm text-gray-400">
                  Start Ollama by opening the Ollama app or running <code className="text-blue-400">ollama serve</code> in your terminal.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={checkOllamaStatus}
                  className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-md font-medium transition-colors"
                >
                  Check Again
                </button>
                
                <button
                  onClick={onComplete}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md font-medium transition-colors"
                >
                  Skip Setup
                </button>
              </div>
            </div>
          ) : !isReady ? (
            <div className="space-y-4">
              <p className="text-gray-300">
                Ollama is running but the Llama 3.2 model is not found.
              </p>
              
              <div className="bg-gray-800 rounded-lg p-4">
                <p className="text-sm text-gray-400 mb-2">
                  Run this command in your terminal to install the model:
                </p>
                <code className="text-green-400 block">
                  ollama pull llama3.2:3b-instruct-fp16
                </code>
              </div>

              <div className="space-y-2 text-sm text-gray-500">
                <p>Available models: {status.availableModels.join(', ') || 'none'}</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={checkOllamaStatus}
                  className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-md font-medium transition-colors"
                >
                  Check Again
                </button>
                
                <button
                  onClick={onComplete}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md font-medium transition-colors"
                >
                  Continue Anyway
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-green-400">
                ✓ Ollama is running with Llama 3.2!
              </p>
              <p className="text-gray-400 text-sm">
                Redirecting to the app...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
