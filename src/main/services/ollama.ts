import { spawn } from 'child_process'
import type { AnalysisResult } from '../../renderer/components/ResultsDisplay'

interface OllamaResponse {
  model: string
  created_at: string
  response: string
  done: boolean
}

export class OllamaService {
  private model = 'llama3.2:3b-instruct-fp16'
  
  /**
   * Check if Ollama is available by running a simple command
   */
  async checkStatus(): Promise<{
    isInstalled: boolean
    isRunning: boolean
    availableModels: string[]
  }> {
    return new Promise((resolve) => {
      const process = spawn('ollama', ['list'])
      let output = ''
      let errorOutput = ''

      process.stdout.on('data', (data) => {
        output += data.toString()
      })

      process.stderr.on('data', (data) => {
        errorOutput += data.toString()
      })

      process.on('close', (code) => {
        if (code === 0) {
          // Parse the model list
          const lines = output.split('\n').filter(line => line.trim())
          // Skip the header line
          const models = lines.slice(1).map(line => {
            const parts = line.split(/\s+/)
            return parts[0] // Model name is the first column
          }).filter(Boolean)

          resolve({
            isInstalled: true,
            isRunning: true,
            availableModels: models
          })
        } else {
          console.log('Ollama not available:', errorOutput)
          resolve({
            isInstalled: false,
            isRunning: false,
            availableModels: []
          })
        }
      })

      process.on('error', () => {
        resolve({
          isInstalled: false,
          isRunning: false,
          availableModels: []
        })
      })
    })
  }

  /**
   * Run a prompt through Ollama using the CLI
   */
  private async runPrompt(prompt: string, options: { temperature?: number } = {}): Promise<string> {
    return new Promise((resolve, reject) => {
      const args = ['run', this.model, '--verbose']
      
      console.log('Running ollama with prompt...')
      const process = spawn('ollama', args)
      let output = ''
      let errorOutput = ''
      let isComplete = false

      process.stdout.on('data', (data) => {
        const chunk = data.toString()
        output += chunk
      })

      process.stderr.on('data', (data) => {
        errorOutput += data.toString()
      })

      process.on('close', (code) => {
        if (code === 0 && output) {
          resolve(output.trim())
        } else {
          reject(new Error(`Ollama process failed: ${errorOutput || 'Unknown error'}`))
        }
      })

      process.on('error', (error) => {
        reject(error)
      })

      // Send the prompt to stdin
      process.stdin.write(prompt)
      process.stdin.end()
    })
  }

  /**
   * Analyze a prompt using Ollama
   */
  async analyzePrompt(prompt: string): Promise<AnalysisResult> {
    const systemPrompt = `You are an expert prompt engineer. Analyze the given prompt and provide structured feedback.

Your response must be ONLY valid JSON (no markdown, no explanation) with this exact structure:
{
  "complexity": "simple" | "moderate" | "complex",
  "technique": "technique name",
  "techniqueDescription": "brief description of why this technique is best",
  "structure": ["step 1", "step 2", "step 3"],
  "keyElements": ["element 1", "element 2"],
  "improvements": ["improvement 1"] or null
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

    const fullPrompt = `${systemPrompt}

Analyze this prompt and respond with JSON only: "${prompt}"`

    try {
      console.log('Analyzing prompt with Ollama CLI...')
      const response = await this.runPrompt(fullPrompt)
      
      // Extract JSON from the response
      // Ollama might include extra text, so we need to find the JSON
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('No JSON found in response')
      }

      const result = JSON.parse(jsonMatch[0])
      
      // Validate the response structure
      if (!result.complexity || !result.technique) {
        throw new Error('Invalid response structure from LLM')
      }

      console.log('Analysis complete')
      return result
    } catch (error) {
      console.error('Error analyzing prompt:', error)
      // Return a fallback analysis
      return this.getFallbackAnalysis(prompt)
    }
  }

  /**
   * Generate a refined prompt
   */
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

Return ONLY the refined prompt text, no explanation or markdown.`

    try {
      const response = await this.runPrompt(prompt)
      return response.trim()
    } catch (error) {
      console.error('Error generating refined prompt:', error)
      // Return a basic refined version
      return this.generateBasicRefinedPrompt(originalPrompt, analysis)
    }
  }

  /**
   * Fallback analysis when LLM fails
   */
  private getFallbackAnalysis(prompt: string): AnalysisResult {
    const wordCount = prompt.split(' ').length
    const hasCodeTerms = /\b(build|create|implement|refactor|optimize|debug|design|develop)\b/i.test(prompt)
    const hasSystemTerms = /\b(system|application|architecture|api|database|service)\b/i.test(prompt)

    let complexity: 'simple' | 'moderate' | 'complex' = 'simple'
    if (wordCount > 30 || hasCodeTerms) complexity = 'moderate'
    if (wordCount > 60 || hasSystemTerms) complexity = 'complex'

    const techniques = {
      simple: {
        technique: 'Direct Prompting',
        techniqueDescription: 'For straightforward tasks, a clear and concise prompt works best.',
        structure: [
          'State your request clearly',
          'Specify the expected output',
          'Include any constraints'
        ],
        keyElements: [
          'Clear objective',
          'Output format',
          'Relevant context',
          'Success criteria'
        ]
      },
      moderate: {
        technique: 'Chain of Thought',
        techniqueDescription: 'Break down your request into logical steps for better reasoning.',
        structure: [
          'Provide context and background',
          'Break down the problem',
          'Specify reasoning steps',
          'Define output format'
        ],
        keyElements: [
          'Step-by-step breakdown',
          'Clear reasoning path',
          'Intermediate checkpoints',
          'Examples if applicable',
          'Error handling',
          'Performance requirements'
        ]
      },
      complex: {
        technique: 'Tree of Thoughts with Role-Based Prompting',
        techniqueDescription: 'Combine expertise with systematic exploration of solutions.',
        structure: [
          'Define the AI role and expertise',
          'Provide comprehensive context',
          'Outline solution approaches',
          'Specify evaluation criteria',
          'Request structured analysis',
          'Include refinement steps'
        ],
        keyElements: [
          'Domain expertise',
          'Comprehensive requirements',
          'Architecture considerations',
          'Multiple solution paths',
          'Trade-off analysis',
          'Scalability factors',
          'Testing strategies',
          'Documentation needs'
        ]
      }
    }

    return {
      complexity,
      ...techniques[complexity],
      improvements: null
    }
  }

  /**
   * Generate a basic refined prompt when LLM fails
   */
  private generateBasicRefinedPrompt(
    originalPrompt: string,
    analysis: AnalysisResult
  ): string {
    const intro = analysis.complexity === 'complex' 
      ? 'As an expert software architect, I need your help with the following:'
      : analysis.complexity === 'moderate'
      ? 'I need assistance with the following task:'
      : ''

    return `${intro}

${originalPrompt}

Please structure your response to include:
${analysis.structure.map((s, i) => `${i + 1}. ${s}`).join('\n')}

Key requirements:
${analysis.keyElements.slice(0, 4).map(e => `- ${e}`).join('\n')}

Provide a detailed, actionable response.`.trim()
  }
}

export const ollamaService = new OllamaService()
