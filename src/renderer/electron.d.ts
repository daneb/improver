import type { AnalysisResult } from './components/ResultsDisplay'
import type { LLMStatus, ModelDownloadProgress } from '../shared/types'

export interface IElectronAPI {
  getVersion: () => Promise<string>
  llm: {
    checkStatus: () => Promise<LLMStatus>
    downloadModel: () => Promise<void>
    analyzePrompt: (prompt: string) => Promise<{
      analysis: AnalysisResult
      refinedPrompt: string
    }>
    onModelProgress: (callback: (progress: ModelDownloadProgress) => void) => () => void
  }
}

declare global {
  interface Window {
    electronAPI: IElectronAPI
  }
}
