// IPC channel names for LLM operations
export const LLM_CHANNELS = {
  CHECK_STATUS: 'llm:check-status',
  ANALYZE_PROMPT: 'llm:analyze-prompt',
  DOWNLOAD_MODEL: 'llm:download-model',
  MODEL_PROGRESS: 'llm:model-progress',
} as const

export interface LLMStatus {
  isInstalled: boolean
  isRunning: boolean
  availableModels: string[]
  currentModel?: string
}

export interface ModelDownloadProgress {
  model: string
  progress: number
  status: 'downloading' | 'complete' | 'error'
  error?: string
}
