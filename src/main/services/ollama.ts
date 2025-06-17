import { exec, spawn } from 'child_process'
import { promisify } from 'util'
import { BrowserWindow } from 'electron'
import type { AnalysisResult } from '../../renderer/components/ResultsDisplay'
import * as http from 'http'

const execAsync = promisify(exec)

export class OllamaService {
  private baseUrl = 'http://localhost:11434'
  private model = 'llama3.2:3b-instruct-fp16' // Best for our use case
  
  private makeRequest(path: string, method: string = 'GET', body?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = new URL(path, this.baseUrl)
      
      const options = {
        hostname: url.hostname,
        port: url.port,
        path: url.pathname,
        method: method,
        headers: {
          'Content-Type': 'application/json',
        }
      }

      const req = http.request(options, (res) => {
        let data = ''

        res.on('data', (chunk) => {
          data += chunk
        })

        res.on('end', () => {
          try {
            if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
              const parsed = data ? JSON.parse(data) : {}
              resolve(parsed)
            } else {
              reject(new Error(`HTTP ${res.statusCode}: ${data}`))
            }
          } catch (error) {
            reject(error)
          }
        })
      })

      req.on('error', (error) => {
        reject(error)
      })

      if (body) {
        req.write(JSON.stringify(body))
      }

      req.end()
    })
  }
  
  async checkStatus(): Promise<{
    isInstalled: boolean
    isRunning: boolean
    availableModels: string[]
  }> {
    try {
      const data = await this.makeRequest('/api/tags')
      const models = data.models?.map((m: any) => m.name) || []
      console.log('Ollama is running with models:', models)
      return {
        isInstalled: true,
        isRunning: true,
        availableModels: models
      }
    } catch (error: any) {
      console.log('Ollama not running:', error.message)
      return { isInstalled: false, isRunning: false, availableModels: [] }
    }
  }

  async pullModel(window: BrowserWindow): Promise<void> {
    return new Promise((resolve, reject) => {
      const pullProcess = exec(`ollama pull ${this.model}`)
      
      pullProcess.stdout?.on('data', (data) => {
        // Parse progress from Ollama output
        const progressMatch = data.match(/(\d+)%/)
        if (progressMatch) {
          const progress = parseInt(progressMatch[1])
          window.webContents.send('llm:model-progress', {
            model: this.model,
            progress,
            status: 'downloading'
          })
        }
      })
      
      pullProcess.on('close', (code) => {
        if (code === 0) {
          window.webContents.send('llm:model-progress', {
            model: this.model,
            progress: 100,
            status: 'complete'
          })
          resolve()
        } else {
          reject(new Error(`Model pull failed with code ${code}`))
        }
      })
    })
  }

  async analyzePrompt(prompt: string): Promise<AnalysisResult> {
    const systemPrompt = `You are an expert prompt engineer. Analyze the given prompt and provide structured feedback.

Your response must be valid JSON with this exact structure:
{
  "complexity": "simple" | "moderate" | "complex",
  "technique": "technique name",
  "techniqueDescription": "brief description of why this technique is best",
  "structure": ["step 1", "step 2", "step 3", ...],
  "keyElements": ["element 1", "element 2", ...],
  "improvements": ["improvement 1", "improvement 2", ...] or null
}

Complexity levels:
- simple: Basic tasks, direct questions, simple transformations
- moderate: Multi-step processes, requires reasoning, integration tasks
- complex: System design, architecture, full applications, advanced algorithms

Techniques to consider:
- Direct Prompting: For simple, straightforward tasks
- Chain of Thought (CoT): For problems requiring step-by-step reasoning
- Few-Shot Learning: When examples would help clarify the task
- Tree of Thoughts: For complex problems with multiple solution paths
- Role-Based Prompting: When domain expertise is crucial
- Structured Output Formatting: When specific output format is needed

Provide 3-6 items for structure, 4-8 for keyElements, and 0-3 for improvements.`

    const userPrompt = `Analyze this prompt and provide structured feedback: "${prompt}"`

    try {
      console.log('Sending request to Ollama...')
      
      const requestBody = {
        model: this.model,
        prompt: `${systemPrompt}\n\n${userPrompt}`,
        stream: false,
        format: 'json',
        options: {
          temperature: 0.3,
          top_p: 0.9,
        }
      }

      const data = await this.makeRequest('/api/generate', 'POST', requestBody)
      console.log('Received response from Ollama')
      
      const result = JSON.parse(data.response)
      
      // Validate the response structure
      if (!result.complexity || !result.technique) {
        throw new Error('Invalid response structure from LLM')
      }

      return result
    } catch (error: any) {
      console.error('Error analyzing prompt:', error)
      throw error
    }
  }

  async generateRefinedPrompt(
    originalPrompt: string, 
    analysis: AnalysisResult
  ): Promise<string> {
    const prompt = `Based on this analysis, create an improved version of the original prompt.

Original prompt: "${originalPrompt}"

Analysis:
- Complexity: ${analysis.complexity}
- Recommended technique: ${analysis.technique}
- Structure: ${analysis.structure.join(', ')}
- Key elements: ${analysis.keyElements.join(', ')}

Create a refined prompt that:
1. Follows the ${analysis.technique} technique
2. Includes all key elements
3. Has clear structure
4. Is specific and actionable

Return ONLY the refined prompt, no explanation or markdown.`

    try {
      const requestBody = {
        model: this.model,
        prompt,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9,
        }
      }

      const data = await this.makeRequest('/api/generate', 'POST', requestBody)
      return data.response.trim()
    } catch (error) {
      console.error('Error generating refined prompt:', error)
      throw error
    }
  }
}

export const ollamaService = new OllamaService()
