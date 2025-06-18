# Improver

> Transform your AI prompts using proven engineering techniques

Improver is a macOS app that helps developers write better AI prompts. It analyzes your input, recommends appropriate techniques from industry leaders, and generates improved versions - all running privately on your machine.

![GitHub release](https://img.shields.io/github/v/release/daneb/improver)
![Platform](https://img.shields.io/badge/platform-macOS-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## Quick Start

### 1. Install Prerequisites

- **[Ollama](https://ollama.ai)** - Local AI runtime
- **Llama 3.2** - Language model
  ```bash
  ollama pull llama3.2:3b-instruct-fp16
  ```

### 2. Download Improver

Get the latest `.dmg` from [Releases](https://github.com/daneb/improver/releases)

### 3. Start Improving

Launch Improver and transform prompts like:

**Before:**

> "help me build a react app"

**After:**

> "I need to build a React application for a task management system. The app should support user authentication, real-time updates, and work offline. Target deployment is Vercel. Please provide: 1) Project setup with TypeScript, 2) Component architecture, 3) State management strategy, 4) Authentication implementation, 5) Offline capability approach."

## Features

### 🎯 Smart Analysis

- Automatically detects prompt complexity (simple/moderate/complex)
- Recommends the most effective technique for your use case
- Provides alternative approaches to consider

### 📚 Learn As You Go

- Each technique links to comprehensive documentation
- Understand _why_ certain structures work better
- Build prompt engineering skills through practice

### 🔒 Privacy First

- Runs 100% locally using Ollama
- No internet connection required after setup
- Your prompts never leave your machine

### ⚡ Developer Focused

- Clean, minimal dark theme
- Keyboard shortcuts (`Cmd+Enter` to analyze)
- Copy refined prompts with one click

## Techniques

Improver incorporates techniques from two authoritative sources:

**[ThoughtWorks Guide](https://www.thoughtworks.com/insights/blog/generative-ai/improve-ai-outputs-advanced-prompt-techniques)**

- The Lede Structure - Newspaper-style hierarchy
- User Story Format - Agile-inspired framing
- Context-Action-Result - Clear task definition
- Situation-Behavior-Impact - Problem analysis

**[PromptingGuide.ai](https://www.promptingguide.ai/techniques)**

- Chain of Thought - Step-by-step reasoning
- Few-Shot Learning - Learning from examples
- Tree of Thoughts - Exploring solution paths
- Role Prompting - Domain expertise

## Development

```bash
# Clone repository
git clone https://github.com/daneb/improver.git
cd improver

# Install dependencies
npm install

# Run development mode
npm run dev

# Build for distribution
npm run dist:mac
```

### Tech Stack

- **Electron** - Cross-platform desktop apps
- **React** + **TypeScript** - Type-safe UI
- **Tailwind CSS** - Utility-first styling
- **Ollama** - Local LLM integration

### Architecture

- Clean IPC/RPC pattern between processes
- Service layer for business logic
- CLI-based Ollama integration (no HTTP issues)
- Comprehensive error handling with fallbacks

## Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Adding Techniques

1. Edit `src/shared/prompt-techniques.ts`
2. Include documentation links
3. Define usage scenarios
4. Add structural templates

## Roadmap

**v1.0** ✅ Current Release

- Core analysis engine
- 10+ techniques
- Offline operation

**v1.1** 🚧 Next Up

- Prompt history
- Custom techniques
- Export/import

**v2.0** 📋 Future

- Windows/Linux support
- Team collaboration
- API integration

## License

MIT - see [LICENSE](LICENSE)

## Acknowledgments

Built with insights from:

- [ThoughtWorks](https://www.thoughtworks.com) - Advanced prompting techniques
- [PromptingGuide.ai](https://www.promptingguide.ai) - Comprehensive technique library
- [Ollama](https://ollama.ai) - Local LLM infrastructure

---

<p align="center">
  <b>Stop guessing. Start engineering better prompts.</b><br>
  <a href="https://github.com/daneb/improver/releases">Download Now</a> • 
  <a href="https://github.com/daneb/improver/issues">Report Issue</a> • 
  <a href="https://github.com/daneb/improver/discussions">Discussions</a>
</p>
