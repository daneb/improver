const { contextBridge, ipcRenderer } = require('electron')

// Import shared types
const { LLM_CHANNELS } = require('../shared/types')

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  getVersion: () => ipcRenderer.invoke('app:version'),
  
  // LLM operations
  llm: {
    checkStatus: () => ipcRenderer.invoke(LLM_CHANNELS.CHECK_STATUS),
    downloadModel: () => ipcRenderer.invoke(LLM_CHANNELS.DOWNLOAD_MODEL),
    analyzePrompt: (prompt) => ipcRenderer.invoke(LLM_CHANNELS.ANALYZE_PROMPT, prompt),
    onModelProgress: (callback) => {
      ipcRenderer.on(LLM_CHANNELS.MODEL_PROGRESS, (_, progress) => callback(progress))
      return () => ipcRenderer.removeAllListeners(LLM_CHANNELS.MODEL_PROGRESS)
    }
  }
})

// TypeScript types will be defined in a separate .d.ts file
