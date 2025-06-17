import type { AnalysisResult } from './components/ResultsDisplay'
import type { LLMStatus, ModelDownloadProgress } from '../shared/types'

export interface IElectronAPI {
  getVersion: () => Promise<string>
  llm: {
    checkStatus: () => Promise<LLMStatus & { error?: string }>
    downloadModel: () => Promise<{ success: boolean }>
    analyzePrompt: (prompt: string) => Promise<{
      success: boolean
      analysis?: AnalysisResult
      refinedPrompt?: string
      error?: string
    }>
    onModelProgress: (callback: (progress: ModelDownloadProgress) => void) => () => void
  }
}

declare global {
  interface Window {
    electronAPI: IElectronAPI
  }
}
