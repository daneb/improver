# Contributing to Improver

First off, thanks for taking the time to contribute! 🎉

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples**
- **Include screenshots if applicable**
- **Describe the behavior you observed and expected**
- **Include your system information** (macOS version, Ollama version)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- **Use a clear and descriptive title**
- **Provide a detailed description of the suggested enhancement**
- **Provide specific examples to demonstrate the enhancement**
- **Describe why this enhancement would be useful**

### Pull Requests

1. Fork the repo and create your branch from `main`
2. If you've added code that should be tested, add tests
3. Ensure the test suite passes
4. Make sure your code follows the existing style
5. Issue that pull request!

## Development Process

1. **Setup your environment**
   ```bash
   npm install
   npm run dev
   ```

2. **Make your changes**
   - Follow the TypeScript style guide
   - Use meaningful variable and function names
   - Add comments for complex logic

3. **Test your changes**
   - Manual testing with various prompts
   - Ensure Ollama integration works
   - Check UI responsiveness

4. **Commit your changes**
   - Use clear commit messages
   - Reference issues and pull requests

## Style Guide

### TypeScript
- Use TypeScript strict mode
- Define interfaces for all data structures
- Avoid `any` types

### React
- Use functional components with hooks
- Keep components small and focused
- Use proper prop typing

### Git Commit Messages
- Use present tense ("Add feature" not "Added feature")
- Use imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit first line to 72 characters or less

## Additional Notes

### Adding New Prompt Techniques

To add a new prompting technique:

1. Add it to `src/shared/prompt-techniques.ts`
2. Include proper documentation links
3. Define when to use it
4. Add example structure
5. Update complexity mappings if needed

Thank you for contributing to Improver! 🚀
