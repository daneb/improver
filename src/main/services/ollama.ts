import { spawn } from 'child_process'
import type { AnalysisResult } from '../../renderer/components/ResultsDisplay'
import { PROMPT_TECHNIQUES, getTechniquesByComplexity, getRelatedTechniques, type PromptTechnique } from '../../shared/prompt-techniques'

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
      // Set a timeout for the entire check
      const timeout = setTimeout(() => {
        console.log('Ollama check timed out')
        resolve({
          isInstalled: false,
          isRunning: false,
          availableModels: []
        })
      }, 3000) // 3 second total timeout

      const process = spawn('ollama', ['list'], {
        shell: true // Use shell to handle PATH better
      })
      let output = ''
      let errorOutput = ''

      process.stdout.on('data', (data) => {
        output += data.toString()
      })

      process.stderr.on('data', (data) => {
        errorOutput += data.toString()
      })

      process.on('close', (code) => {
        clearTimeout(timeout)
        if (code === 0) {
          // Parse the model list
          const lines = output.split('\n').filter(line => line.trim())
          // Skip the header line if present
          const models = lines
            .filter(line => !line.toLowerCase().includes('name') && line.length > 0)
            .map(line => {
              const parts = line.split(/\s+/)
              return parts[0] // Model name is the first column
            })
            .filter(Boolean)

          console.log('Ollama check successful, models:', models)
          resolve({
            isInstalled: true,
            isRunning: true,
            availableModels: models
          })
        } else {
          console.log('Ollama not available:', errorOutput || 'Exit code ' + code)
          resolve({
            isInstalled: false,
            isRunning: false,
            availableModels: []
          })
        }
      })

      process.on('error', (err) => {
        clearTimeout(timeout)
        console.log('Ollama spawn error:', err.message)
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
    // First, do a quick connectivity check
    const isAvailable = await this.quickCheck()
    if (!isAvailable) {
      console.log('Ollama not available, using fallback analysis')
      return this.getFallbackAnalysis(prompt)
    }

    const systemPrompt = `You are an expert prompt engineer. Analyze the given prompt and provide structured feedback.

Your response must be ONLY valid JSON (no markdown, no explanation) with this exact structure:
{
  "complexity": "simple" | "moderate" | "complex",
  "recommendedTechnique": "technique-key",
  "whyThisTechnique": "brief explanation of why this technique fits",
  "alternativeTechniques": ["technique-key-1", "technique-key-2"],
  "improvements": ["specific improvement 1", "specific improvement 2"] or null,
  "tips": ["helpful tip 1", "helpful tip 2"]
}

Available technique keys:
${Object.keys(PROMPT_TECHNIQUES).join(', ')}

Complexity levels:
- simple: Basic tasks, direct questions, simple transformations
- moderate: Multi-step processes, requires reasoning, integration tasks  
- complex: System design, architecture, full applications, advanced algorithms

Choose techniques based on:
- Task complexity and requirements
- Need for examples (few-shot)
- Need for reasoning (chain-of-thought, tree-of-thoughts)
- Need for structure (the-lede, user-story)
- Domain expertise needed (role-prompting)`

    const fullPrompt = `${systemPrompt}

Analyze this prompt and respond with JSON only: "${prompt}"`

    try {
      console.log('Analyzing prompt with Ollama CLI...')
      const response = await this.runPrompt(fullPrompt)
      
      // Extract JSON from the response
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('No JSON found in response')
      }

      const llmResult = JSON.parse(jsonMatch[0])
      
      // Map the LLM response to our AnalysisResult format
      const primaryTechnique = PROMPT_TECHNIQUES[llmResult.recommendedTechnique] || 
        this.getFallbackTechnique(llmResult.complexity || 'moderate')
      
      const alternativeTechniques = (llmResult.alternativeTechniques || [])
        .map((key: string) => PROMPT_TECHNIQUES[key])
        .filter(Boolean)
      
      // If no alternatives provided, use related techniques
      if (alternativeTechniques.length === 0) {
        alternativeTechniques.push(...getRelatedTechniques(llmResult.recommendedTechnique).slice(0, 2))
      }
      
      const result: AnalysisResult = {
        complexity: llmResult.complexity || 'moderate',
        technique: primaryTechnique.name,
        techniqueDescription: llmResult.whyThisTechnique || primaryTechnique.whenToUse,
        techniqueLink: primaryTechnique.link,
        structure: primaryTechnique.structure,
        keyElements: this.extractKeyElements(prompt, llmResult.complexity),
        improvements: llmResult.improvements,
        alternativeTechniques: alternativeTechniques.map((t: PromptTechnique) => ({
          name: t.name,
          description: t.description,
          link: t.link
        })),
        tips: llmResult.tips || this.getDefaultTips(llmResult.complexity)
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
   * Quick check if Ollama is responsive
   */
  private async quickCheck(): Promise<boolean> {
    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        // If we haven't resolved by now, assume it's not available
        try {
          process.kill('SIGTERM')
        } catch {}
        resolve(false)
      }, 2000)

      const process = spawn('ollama', ['--version'], {
        shell: true
      })
      
      process.on('exit', (code) => {
        clearTimeout(timeout)
        resolve(code === 0)
      })
      
      process.on('error', () => {
        clearTimeout(timeout)
        resolve(false)
      })
    })
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
   * Extract key elements based on prompt content
   */
  private extractKeyElements(prompt: string, complexity: string): string[] {
    const elements = []
    
    // Check for specific patterns
    if (prompt.match(/\b(api|endpoint|rest|graphql)\b/i)) {
      elements.push('API design considerations', 'Endpoint specifications')
    }
    if (prompt.match(/\b(build|create|develop|implement)\b/i)) {
      elements.push('Clear deliverables', 'Technical requirements')
    }
    if (prompt.match(/\b(optimize|improve|enhance|refactor)\b/i)) {
      elements.push('Performance metrics', 'Current state analysis')
    }
    if (prompt.match(/\b(debug|fix|solve|troubleshoot)\b/i)) {
      elements.push('Error context', 'Expected behavior')
    }
    
    // Add complexity-specific elements
    if (complexity === 'complex') {
      elements.push('Architecture decisions', 'Scalability requirements', 'Testing strategy')
    } else if (complexity === 'moderate') {
      elements.push('Step-by-step approach', 'Success criteria')
    }
    
    // Add general best practices
    elements.push('Specific constraints', 'Desired output format')
    
    return [...new Set(elements)].slice(0, 8)
  }

  /**
   * Get default tips based on complexity
   */
  private getDefaultTips(complexity: string): string[] {
    const tips = {
      simple: [
        'Keep it concise and direct',
        'Specify the exact output format you need'
      ],
      moderate: [
        'Break down complex requirements into steps',
        'Provide context about your use case',
        'Consider adding examples of desired output'
      ],
      complex: [
        'Define clear boundaries and constraints',
        'Specify evaluation criteria for success',
        'Consider breaking into multiple smaller prompts'
      ]
    }
    
    return tips[complexity as keyof typeof tips] || tips.moderate
  }

  /**
   * Get fallback technique based on complexity
   */
  private getFallbackTechnique(complexity: string): PromptTechnique {
    const techniques = getTechniquesByComplexity(complexity as any)
    return techniques[0] || PROMPT_TECHNIQUES['chain-of-thought']
  }

  /**
   * Get fallback analysis when LLM fails
   */
  getFallbackAnalysis(prompt: string): AnalysisResult {
    const wordCount = prompt.split(' ').length
    const hasCodeTerms = /\b(build|create|implement|refactor|optimize|debug|design|develop)\b/i.test(prompt)
    const hasSystemTerms = /\b(system|application|architecture|api|database|service)\b/i.test(prompt)

    let complexity: 'simple' | 'moderate' | 'complex' = 'simple'
    if (wordCount > 30 || hasCodeTerms) complexity = 'moderate'
    if (wordCount > 60 || hasSystemTerms) complexity = 'complex'

    const techniques = getTechniquesByComplexity(complexity)
    const primaryTechnique = techniques[0]
    const alternativeTechniques = techniques.slice(1, 3)

    return {
      complexity,
      technique: primaryTechnique.name,
      techniqueDescription: primaryTechnique.whenToUse,
      techniqueLink: primaryTechnique.link,
      structure: primaryTechnique.structure,
      keyElements: this.extractKeyElements(prompt, complexity),
      improvements: [
        'Add more specific requirements',
        'Include examples of desired output',
        'Specify any constraints or limitations'
      ].slice(0, complexity === 'simple' ? 1 : 2),
      alternativeTechniques: alternativeTechniques.map(t => ({
        name: t.name,
        description: t.description,
        link: t.link
      })),
      tips: this.getDefaultTips(complexity)
    }
  }

  /**
   * Generate a basic refined prompt when LLM fails
   */
  generateBasicRefinedPrompt(
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
