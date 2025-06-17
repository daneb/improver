import { ipcMain } from 'electron'
import { ollamaService } from './ollama'
import { LLM_CHANNELS } from '../../shared/types'

/**
 * Initialize all IPC handlers for LLM operations
 * This provides a clean RPC interface between renderer and main process
 */
export function initializeLLMHandlers() {
  // Check Ollama status
  ipcMain.handle(LLM_CHANNELS.CHECK_STATUS, async () => {
    try {
      return await ollamaService.checkStatus()
    } catch (error) {
      console.error('Error checking Ollama status:', error)
      return {
        isInstalled: false,
        isRunning: false,
        availableModels: [],
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  })

  // Analyze prompt
  ipcMain.handle(LLM_CHANNELS.ANALYZE_PROMPT, async (_, prompt: string) => {
    try {
      console.log('IPC: Analyzing prompt...')
      const analysis = await ollamaService.analyzePrompt(prompt)
      const refinedPrompt = await ollamaService.generateRefinedPrompt(prompt, analysis)
      
      return {
        success: true,
        analysis,
        refinedPrompt
      }
    } catch (error) {
      console.error('Error in prompt analysis:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  })

  // Download model - not needed with CLI approach
  ipcMain.handle(LLM_CHANNELS.DOWNLOAD_MODEL, async () => {
    // This is now handled by telling users to run ollama pull
    return { success: true }
  })

  console.log('LLM IPC handlers initialized')
}

/**
 * Clean up handlers when app is closing
 */
export function cleanupLLMHandlers() {
  ipcMain.removeHandler(LLM_CHANNELS.CHECK_STATUS)
  ipcMain.removeHandler(LLM_CHANNELS.ANALYZE_PROMPT)
  ipcMain.removeHandler(LLM_CHANNELS.DOWNLOAD_MODEL)
}
