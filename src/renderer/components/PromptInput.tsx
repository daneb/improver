import React, { useState, useRef, useEffect } from 'react'

interface PromptInputProps {
  onSubmit: (prompt: string) => void
  isLoading?: boolean
}

export function PromptInput({ onSubmit, isLoading = false }: PromptInputProps) {
  const [prompt, setPrompt] = useState('')
  const [charCount, setCharCount] = useState(0)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    setCharCount(prompt.length)
  }, [prompt])

  const handleSubmit = () => {
    if (prompt.trim() && !isLoading) {
      onSubmit(prompt.trim())
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      handleSubmit()
    }
  }

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [prompt])

  return (
    <div className="relative">
      <div className="bg-gray-900 rounded-lg border border-gray-800 focus-within:border-blue-500 transition-colors">
        <textarea
          ref={textareaRef}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter your prompt here... What are you trying to build or solve?"
          className="w-full px-4 py-3 bg-transparent text-gray-100 placeholder-gray-500 resize-none focus:outline-none min-h-[120px] max-h-[400px]"
          disabled={isLoading}
        />
        <div className="flex items-center justify-between px-4 py-2 border-t border-gray-800">
          <span className="text-xs text-gray-500">
            {charCount} characters • {(charCount / 4).toFixed(0)} tokens (est.)
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">
              {navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}+Enter
            </span>
            <button
              onClick={handleSubmit}
              disabled={!prompt.trim() || isLoading}
              className="px-4 py-1.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-md text-sm font-medium hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Analyzing...
                </span>
              ) : (
                'Analyze Prompt'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
