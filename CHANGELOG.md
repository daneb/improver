# Changelog

All notable changes to Improver will be documented in this file.

## [1.0.0] - 2024-01-XX

### Initial Release 🎉

#### Features
- **Prompt Analysis** - Automatic complexity detection (simple/moderate/complex)
- **Technique Recommendations** - Smart suggestions from ThoughtWorks and PromptingGuide.ai
- **Refined Prompt Generation** - AI-powered prompt improvement
- **Educational Links** - Direct links to technique documentation
- **Alternative Techniques** - 2-3 alternative approaches for each prompt
- **Quick Tips** - Contextual advice based on prompt complexity
- **Beautiful Dark UI** - Minimal, developer-friendly interface
- **Offline Capable** - Runs entirely locally with Ollama

#### Technical
- Electron + React + TypeScript architecture
- IPC/RPC pattern for clean process separation
- Ollama CLI integration (no HTTP issues)
- Tailwind CSS for styling
- Production-ready error handling

#### Supported Techniques
- The Lede Structure
- User Story Format
- Context-Action-Result (CAR)
- Situation-Behavior-Impact
- Zero-Shot Prompting
- Few-Shot Prompting
- Chain of Thought (CoT)
- Tree of Thoughts (ToT)
- ReAct (Reasoning + Acting)
- Role Prompting

### Known Limitations
- macOS only (Windows/Linux coming soon)
- Requires Ollama with Llama 3.2 model
- No prompt history (yet)

---

## Future Releases

### [1.1.0] - Planned
- Prompt history with search
- Export/import functionality
- Custom technique definitions

### [1.2.0] - Planned
- Windows and Linux support
- Multiple LLM model support
- Batch prompt analysis

### [2.0.0] - Planned
- Team collaboration features
- Cloud sync (optional)
- API for CI/CD integration
