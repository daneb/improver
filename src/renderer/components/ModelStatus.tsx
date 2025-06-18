import React from 'react'

interface ModelStatusProps {
  enabled: boolean
  status: 'checking' | 'available' | 'unavailable'
  onToggle: (enabled: boolean) => void
  onRetry: () => void
}

export function ModelStatus({ enabled, status, onToggle, onRetry }: ModelStatusProps) {
  const getStatusIcon = () => {
    if (!enabled) {
      return (
        <div className="w-2 h-2 bg-gray-500 rounded-full" />
      )
    }
    
    switch (status) {
      case 'checking':
        return (
          <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
        )
      case 'available':
        return (
          <div className="w-2 h-2 bg-green-500 rounded-full" />
        )
      case 'unavailable':
        return (
          <div className="w-2 h-2 bg-red-500 rounded-full" />
        )
    }
  }

  const getStatusText = () => {
    if (!enabled) return 'Offline Mode'
    
    switch (status) {
      case 'checking':
        return 'Checking...'
      case 'available':
        return 'Ollama Ready'
      case 'unavailable':
        return 'Ollama Not Found'
    }
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 text-sm">
        {getStatusIcon()}
        <span className="text-gray-400">{getStatusText()}</span>
      </div>
      
      <div className="flex items-center gap-2">
        {enabled && status === 'unavailable' && (
          <button
            onClick={onRetry}
            className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
            title="Retry connection"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        )}
        
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => onToggle(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-500"></div>
          <span className="ml-2 text-xs text-gray-400">AI Mode</span>
        </label>
      </div>
    </div>
  )
}
