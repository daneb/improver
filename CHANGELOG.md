# Changelog

All notable changes to Improver will be documented in this file.

## [1.0.6] - 2024-01-XX

### Fixed
- **Improved Ollama Detection** - More robust detection with proper timeouts
- **Better Error Handling** - Gracefully handles when Ollama is not available
- **Shell Spawning** - Uses shell mode for better PATH resolution
- **Quick Check** - Uses `--version` instead of `list` for faster checks

### Changed
- Added debug logging for troubleshooting connection issues
- Improved model list parsing to handle different output formats
- Timeout handling is now more reliable

## [1.0.5] - 2024-01-XX

### Added
- **AI Mode Toggle** - Enable/disable AI features on demand
- **Model Status Indicator** - Visual feedback for Ollama availability
- **Fallback Mode** - Works without Ollama using heuristic analysis
- **Retry Button** - Manually retry Ollama connection

### Removed
- Blocking setup screen - App now starts immediately

### Fixed
- PostCSS and Tailwind configs converted to CommonJS
- GitHub Actions updated to v4

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
