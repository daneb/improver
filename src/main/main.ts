import { app, BrowserWindow, ipcMain } from 'electron'
import * as path from 'path'
import { ollamaService } from './services/ollama'
import { LLM_CHANNELS } from '../shared/types'

let mainWindow: BrowserWindow | null = null

const isDev = !app.isPackaged

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#0a0a0a',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  if (isDev) {
    // In development, load from Vite dev server
    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools()
    
    // Handle loading errors
    mainWindow.webContents.on('did-fail-load', () => {
      console.log('Failed to load, retrying...')
      setTimeout(() => {
        mainWindow?.loadURL('http://localhost:5173')
      }, 1000)
    })
  } else {
    // In production, load the built files
    mainWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'))
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// IPC handlers
ipcMain.handle('app:version', () => {
  return app.getVersion()
})

// LLM handlers
ipcMain.handle(LLM_CHANNELS.CHECK_STATUS, async () => {
  return await ollamaService.checkStatus()
})

ipcMain.handle(LLM_CHANNELS.DOWNLOAD_MODEL, async (event) => {
  const window = BrowserWindow.fromWebContents(event.sender)
  if (window) {
    await ollamaService.pullModel(window)
  }
})

ipcMain.handle(LLM_CHANNELS.ANALYZE_PROMPT, async (_, prompt: string) => {
  try {
    const analysis = await ollamaService.analyzePrompt(prompt)
    const refinedPrompt = await ollamaService.generateRefinedPrompt(prompt, analysis)
    return { analysis, refinedPrompt }
  } catch (error) {
    console.error('Error in prompt analysis:', error)
    throw error
  }
})
