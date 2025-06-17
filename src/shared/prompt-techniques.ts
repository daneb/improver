// Comprehensive list of prompt engineering techniques with references
export interface PromptTechnique {
  name: string
  description: string
  whenToUse: string
  structure: string[]
  example?: string
  link: string
  source: 'thoughtworks' | 'promptingguide'
}

export const PROMPT_TECHNIQUES: Record<string, PromptTechnique> = {
  // ThoughtWorks Techniques
  'the-lede': {
    name: 'The Lede Structure',
    description: 'Structures prompts like a news article with the most important information first',
    whenToUse: 'When you need comprehensive, well-organized responses with clear context',
    structure: [
      'What: The topic or action',
      'Why: The purpose or goal', 
      'Where: The location or context',
      'When: The timeframe',
      'How: The method',
      'How much: The scale',
      'Why (deeper): The reasoning'
    ],
    link: 'https://www.thoughtworks.com/insights/blog/generative-ai/improve-ai-outputs-advanced-prompt-techniques',
    source: 'thoughtworks'
  },
  'user-story': {
    name: 'User Story Format',
    description: 'Frames requests in the agile user story format to clarify intent and success criteria',
    whenToUse: 'For feature requests, development tasks, or when you need clear acceptance criteria',
    structure: [
      'As a [role/persona]',
      'I want to [action/feature]',
      'So that [benefit/value]',
      'Acceptance criteria: [specific requirements]'
    ],
    link: 'https://www.thoughtworks.com/insights/blog/generative-ai/improve-ai-outputs-advanced-prompt-techniques',
    source: 'thoughtworks'
  },
  'situation-behavior': {
    name: 'Situation-Behavior-Impact',
    description: 'Provides context, describes the situation, and clarifies desired outcomes',
    whenToUse: 'For problem-solving, feedback, or when analyzing cause and effect',
    structure: [
      'Situation: Describe the current context',
      'Behavior: What is happening or needs to happen',
      'Impact: What are the consequences or desired outcomes'
    ],
    link: 'https://www.thoughtworks.com/insights/blog/generative-ai/improve-ai-outputs-advanced-prompt-techniques',
    source: 'thoughtworks'
  },
  'context-action-result': {
    name: 'Context-Action-Result (CAR)',
    description: 'Structures prompts with clear context, required actions, and expected results',
    whenToUse: 'For task-oriented requests where you need specific deliverables',
    structure: [
      'Context: Background information and constraints',
      'Action: Specific tasks to be performed',
      'Result: Expected output format and criteria'
    ],
    link: 'https://www.thoughtworks.com/insights/blog/generative-ai/improve-ai-outputs-advanced-prompt-techniques',
    source: 'thoughtworks'
  },

  // Prompting Guide Techniques
  'zero-shot': {
    name: 'Zero-Shot Prompting',
    description: 'Direct prompting without examples, relying on the model\'s pre-trained knowledge',
    whenToUse: 'For simple, straightforward tasks where the model likely understands the request',
    structure: [
      'Clear, direct instruction',
      'Specify output format if needed'
    ],
    link: 'https://www.promptingguide.ai/techniques/zeroshot',
    source: 'promptingguide'
  },
  'few-shot': {
    name: 'Few-Shot Prompting',
    description: 'Provides examples to demonstrate the desired pattern or format',
    whenToUse: 'When you need specific formatting or when the task benefits from examples',
    structure: [
      'Task description',
      'Example 1: Input → Output',
      'Example 2: Input → Output',
      'Your actual request'
    ],
    link: 'https://www.promptingguide.ai/techniques/fewshot',
    source: 'promptingguide'
  },
  'chain-of-thought': {
    name: 'Chain of Thought (CoT)',
    description: 'Encourages step-by-step reasoning to solve complex problems',
    whenToUse: 'For mathematical problems, logic puzzles, or multi-step reasoning tasks',
    structure: [
      'Problem statement',
      'Request: "Let\'s think step by step"',
      'Or provide example with reasoning steps'
    ],
    link: 'https://www.promptingguide.ai/techniques/cot',
    source: 'promptingguide'
  },
  'self-consistency': {
    name: 'Self-Consistency',
    description: 'Generates multiple reasoning paths and selects the most consistent answer',
    whenToUse: 'For complex reasoning where accuracy is critical',
    structure: [
      'Problem statement',
      'Request multiple solutions',
      'Ask for consensus or most likely answer'
    ],
    link: 'https://www.promptingguide.ai/techniques/consistency',
    source: 'promptingguide'
  },
  'tree-of-thoughts': {
    name: 'Tree of Thoughts (ToT)',
    description: 'Explores multiple reasoning paths in a tree structure for complex problem-solving',
    whenToUse: 'For complex problems with multiple possible approaches',
    structure: [
      'Problem definition',
      'Request exploration of multiple approaches',
      'Evaluation criteria for each path',
      'Selection of best approach'
    ],
    link: 'https://www.promptingguide.ai/techniques/tot',
    source: 'promptingguide'
  },
  'retrieval-augmented': {
    name: 'Retrieval Augmented Generation (RAG)',
    description: 'Combines retrieval of relevant information with generation',
    whenToUse: 'When working with specific documents or knowledge bases',
    structure: [
      'Provide relevant context/documents',
      'Specific question about the context',
      'Request citation of sources'
    ],
    link: 'https://www.promptingguide.ai/techniques/rag',
    source: 'promptingguide'
  },
  'react': {
    name: 'ReAct (Reasoning + Acting)',
    description: 'Combines reasoning with action planning for task completion',
    whenToUse: 'For tasks requiring both planning and execution steps',
    structure: [
      'Task description',
      'Thought: Reasoning about the task',
      'Action: What to do',
      'Observation: Result of action',
      'Repeat until complete'
    ],
    link: 'https://www.promptingguide.ai/techniques/react',
    source: 'promptingguide'
  },
  'role-prompting': {
    name: 'Role Prompting',
    description: 'Assigns a specific role or expertise to the AI for domain-specific responses',
    whenToUse: 'When you need expertise in a specific domain',
    structure: [
      'You are a [specific role/expert]',
      'Your expertise includes [domains]',
      'Task or question',
      'Constraints or style requirements'
    ],
    link: 'https://www.promptingguide.ai/techniques/roles',
    source: 'promptingguide'
  }
}

// Helper function to get techniques by complexity
export function getTechniquesByComplexity(complexity: 'simple' | 'moderate' | 'complex'): PromptTechnique[] {
  const complexityMap = {
    simple: ['zero-shot', 'role-prompting', 'user-story'],
    moderate: ['few-shot', 'chain-of-thought', 'the-lede', 'context-action-result'],
    complex: ['tree-of-thoughts', 'react', 'self-consistency', 'situation-behavior']
  }
  
  return complexityMap[complexity].map(key => PROMPT_TECHNIQUES[key]).filter(Boolean)
}

// Helper function to get related techniques
export function getRelatedTechniques(primaryTechnique: string): PromptTechnique[] {
  const relations: Record<string, string[]> = {
    'chain-of-thought': ['tree-of-thoughts', 'self-consistency', 'react'],
    'few-shot': ['zero-shot', 'chain-of-thought'],
    'the-lede': ['context-action-result', 'user-story'],
    'user-story': ['situation-behavior', 'the-lede'],
    'tree-of-thoughts': ['chain-of-thought', 'react', 'self-consistency']
  }
  
  const related = relations[primaryTechnique] || []
  return related.map(key => PROMPT_TECHNIQUES[key]).filter(Boolean)
}

// Educational tips for users
export const PROMPTING_TIPS = [
  'Be specific: Vague prompts lead to vague responses',
  'Provide context: Background information helps the AI understand your needs',
  'Specify format: Tell the AI exactly how you want the output structured',
  'Use examples: Show don\'t just tell when you need specific patterns',
  'Iterate: Refine your prompts based on the responses you get',
  'Constrain scope: Set boundaries to keep responses focused',
  'Think step-by-step: Break complex tasks into smaller parts'
]
