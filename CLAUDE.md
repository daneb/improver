# CLAUDE.md - Application Development Template

## Project Overview

### Application Name

> Improver

### One-Line Description

> Uses industry-led techniques to help the developer improve their prompt and make suggestions on alternatives

### Target Audience

> Developers solely.

### Core Value Proposition

> It reduces the developers time (refining and conversing with AI) and cost (reduces tokens) for complex, challenging or deep problem spaces

## Functional Requirements

### Primary Features (Must-Have)

> [List 3-5 core features that are absolutely essential]
>
> 1. Determines the complexity of the problem they are trying to solve through a question using a local model (Llama or Mistral) or a simple heuristic.
> 2. Determines the best strategy/technique to employ for the level of complexity and nature of problem. This should come from: "https://www.thoughtworks.com/insights/blog/generative-ai/improve-ai-outputs-advanced-prompt-techniques".
> 3. Makes a brief suggestion on how the prompt should look (structure) and key elements
> 4. Once the user has completed the prompt, re-evaluates it and makes further suggestions

### Secondary Features (Nice-to-Have)

> [List additional features that would enhance the app but aren't critical for MVP]
>
> 1. Leveraging more techniques and strategies from promptengineering.ai
> 2. To build a custom set of metrics that can determine the quality of the prompt
> 3. To exist as a set of workflow AI Agents (Crew AI)
> 4. Support for other platforms (e.g., mobile, windows, linux) in the future
> 5. Support a history of past prompts and suggestions for user reference
> 6. Support auto-updates for the app to ensure users always have the latest features and improvements
> 7. Tests to ensure the app works as expected and to catch any bugs early
> 8. Expand the audience to include non-developers in the future, with a focus on making the app user-friendly for all skill levels

### User Journey

> [Describe the typical user flow from opening the app to achieving their goal]
>
> 1. User opens the application and sees a simple interface with a prompt input field. It's beautil, clean and minimal.
> 2. They enter their initial prompt or question, and the app analyzes its complexity.
> 3. Next, they receive suggestions on the best strategy to use based on the complexity and nature of their problem.
> 4. Finally, the app provides a brief suggestion on how to structure their prompt and what key elements to include.
> 5. After the user refines their prompt, they can submit it again for further evaluation and suggestions.
> 6. In addition, the app can provide a summary of the improvements made and how they can further enhance their prompt in the future. Specifying other techniques or strategies that could be used.

## Technical Specifications

### Platform Requirements

> [Select all that apply and add any specific requirements]
>
> - [ ] Web Application (runs in browser)
> - [ ] Desktop Application (Windows)
> - [x] Desktop Application (macOS - unsigned/unnotarized is OK)
> - [ ] Desktop Application (Linux)
> - [ ] Other: [specify]

### Data Management

> [How will the application handle data?]
>
> - Data Storage: [Local files]
> - Data Format: [JSON / SQLite]
> - Data Privacy: [All data stays local]

### External Dependencies

> [What external services or APIs does your app need?]
>
> - APIs: [none]
> - Libraries: [Any specific libraries you know you need or "Claude's choice"]
> - Network: [Works offline]

## User Interface Design

### Visual Style

> [Describe the look and feel you want]
>
> - Style: [Minimalist]
> - Color Preference: [Dark theme]
> - Layout: [Single page]

### Key UI Elements

> [Describe important interface components]
>
> - Main Interface: [A landing page with a prompt input field and feedback below it like a chat interface]
> - Input Methods: [Forms]
> - Output/Display: [Tables, Text]

### Responsive Design

> [How should the app adapt to different screen sizes?]
>
> - Desktop: [Full features]

## Distribution Requirements

### Packaging Preferences

> [How do you want to distribute the app?]
>
> - Desktop: [Electron app]
> - Installation: [Simple installer]

### Distribution Method

> [How will users get your app?]
>
> - [ ] Direct download from website
> - [x] GitHub releases
> - [ ] Static hosting (Vercel, Netlify, GitHub Pages)
> - [ ] Share as single file
> - [ ] Other: [specify]

### Update Mechanism

> [How will users get updates?]
>
> - Manual (download new version)
> - Not needed for MVP

## Constraints & Limitations

### Technical Constraints

> - Maximum file size: [100MB]
> - Performance requirements: [App should run smoothly on mid-range hardware]
> - LLM: [Local model like Llama or Mistral]
> - Offline capabilities: [App should work without internet]
> - No Apple Developer license for notarization: Understood ✓

### Development Constraints

> - Timeline: [ASAP for MVP, ideally within 2 weeks]
> - Maintenance: [I will maintain myself. Keep code simple, modular, and well-documented]
> - Documentation needs: [Basic usage]

## Example Use Cases

### Use Case 1

> **Scenario**: [User wants to refactor an application] > **User Action**: [They input their prompt] > **Expected Result**: [The system analyzes the prompt, suggests a strategy, and provides a structured prompt with key elements. Because it's an application refactor, it suggests techniques like "Refactoring by Example" or "Code Review Prompts". Based on the complexity and nature of the problem, it will provide a brief suggestion on how to structure the prompt and what key elements to include, such as "focus on modularity" or "emphasize performance improvements".]

### Use Case 2

> **Scenario**: [User wants to build an application] > **User Action**: [They input their prompt] > **Expected Result**: [Given the complexity of building an application, the system suggests techniques like "User Story Mapping" or "Feature Prioritization". It provides a structured prompt that includes key elements such as "user requirements", "technical constraints", and "success criteria". The app also suggests focusing on user experience and scalability. It will suggest a detailed structure for the prompt, including sections for "user stories", "technical requirements", and "success metrics". It suggest an initial prompt structure as defined here "https://www.thoughtworks.com/insights/blog/generative-ai/improve-ai-outputs-advanced-prompt-techniques". After the user refines their prompt, they can submit it again for further evaluation and suggestions. The app will provide a summary of the improvements made and how they can further enhance their prompt in the future, specifying other techniques or strategies that could be used.]

## Inspiration & References

### Similar Applications

> [List any apps that do something similar or have UI elements you like]
>
> - App 1: [ChatGPT - functions similar in terms of prompt refinement and suggestions but when targeted. But the interface is clean and minimal, which is what I want]
> - App 2: [Claude - has a clean interface and provides suggestions based on the user's input, but I want to focus more on prompt engineering techniques and strategies]

### Design References

> [Any screenshots, links, or descriptions of designs you like?]
>
> - Reference 1: [N/A]
> - Reference 2: [N/A]

## Success Criteria

### MVP Success Metrics

> [How will you know the MVP is successful?]
>
> - [x] [If I can get value from it myself - dogfooding]
> - [x] [If it can help developers refine ther criterion]
> - [x] [If its clean, beautiful, stable and easily installable]
> - [x] [If it can be easily extended with new techniques and strategies in the future]

### User Feedback Plans

> [How will you gather and incorporate user feedback?]
>
> - Testing approach: [Friends/family/collegues/public release on Github]
> - Feedback channels: [Email, GitHub issues]

## Additional Context

### Background

> Focus on simplicity, beauty, and ease of use. The app should be minimalistic and clean, with a focus on helping developers refine their prompts and make suggestions on alternatives. It should be easy to use and understand, even for those who may not be familiar with prompt engineering techniques.
> Given it's dependant on a local model, it should be able to run offline and not require an internet connection. The app should be built using Electron and should be distributable as a simple installer for macOS. It should also be easy to maintain and extend in the future, with a focus on modularity and simplicity in the codebase.

### Special Considerations

> Given the local model, performance is Critical. The app should be able to run smoothly on mid-range hardware and should not require a high-end machine to function properly. It should also be able to handle complex prompts and provide suggestions in a timely manner.

### Questions for Claude

> [Any specific questions you have about feasibility or implementation?]
>
> 1. Please first review the requirements and let me know if you have any questions or concerns about the feasibility of building this app.
> 2. Please determine the best local model to use for this app, considering the requirements and constraints.
