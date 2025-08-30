# AI Prompts Used in Development

This document showcases the AI prompts used while building the Sprint Board Lite application, demonstrating effective prompting strategies and AI-assisted development.

## 🎯 Initial Project Setup

### Prompt 1: Project Requirements Analysis
```
Stack: Next.js 15 (App Router), TypeScript, Tailwind CSS, Framer Motion, State Management: fetch/Axios

What to build: Sprint Board Lite, single project with 3 columns: Todo / In Progress / Done.

Must-haves:
1. Auth (mocked) - /login: any non-empty email+password → set fake token in localStorage, redirect to /board. Guard /board if no token. Logout clears token.
2. Board - Load tasks from mock API (json-server or MockAPI). Drag & drop between columns. Optimistic update + rollback on API failure (simulate failures 10% of the time). Create task (modal): title, description, priority (low | medium | high) → new tasks start in Todo.
3. Search & Filter - Client-side search by title + filter by priority.
4. UX essentials - Mobile-first responsive, skeletons, error/empty states, dark mode (persisted).

Variant: Use the first character of your name to pick ONE variant:
a-g: Undo Move → After moving a task, show a 5s "Undo" toast. If clicked, revert state and PATCH server back.

Mock API: Use json-server with routes: GET /tasks, POST /tasks, PATCH /tasks/:id, DELETE /tasks/:id

Simulate failures: add a tiny proxy/middleware that randomly returns 500 on PATCH/POST 10% of the time to exercise rollback.

Deliverables:
1. Deployed demo (Vercel)
2. Public repo with README.md (setup, decisions, your variant, what's done/omitted, time spent)
3. AI_PROMPTS.md (any AI prompt(s) you used while building - showcases your prompting skills)
4. Clear, incremental commits (no "big dump")

Evaluation rubric (100):
- Data & API flow (20): fetch layer, errors, optimistic mutation + rollback clarity
- State & components (20): separation, custom hook quality, predictable updates
- UI/UX polish (20): responsive, empty/loading/error, motion taste, dark mode
- Code quality (20): TypeScript types, readability, commits, structure
- AI usage maturity (20): prompts show thinking, and good prompting skills

Auto-rejects: missing deploy, broken guard rules, no variant implementation, no AI_PROMPTS.md, single "all code" commit.

Time box: ≤ 4 hours of actual build.
```

**Strategy**: Provided comprehensive requirements upfront to get a complete understanding of the project scope, constraints, and evaluation criteria.

## 🏗️ Architecture Decisions

### Prompt 2: Tech Stack Validation
```
I need to build a Sprint Board Lite application with the following requirements:
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion for animations
- Drag & drop functionality
- Mock API with json-server
- Authentication (mocked)
- Dark mode
- Mobile-first responsive design

Can you help me validate this tech stack and suggest any alternatives or improvements? Specifically:
1. Is Framer Motion the best choice for drag & drop, or should I consider @dnd-kit or react-beautiful-dnd?
2. Should I use a state management library like Zustand or Redux, or stick with React Context?
3. Any recommendations for the project structure with Next.js 15 App Router?
```

**Strategy**: Asked for validation and alternatives to ensure optimal technology choices before starting implementation.

### Prompt 3: Project Structure Planning
```
I'm building a Next.js 15 application with App Router. Here's my planned structure:

src/
├── app/
│   ├── board/
│   ├── login/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
├── contexts/
├── lib/
├── types/
└── middleware.ts

Is this structure optimal for:
1. Authentication with protected routes
2. Context providers (auth, theme, toasts)
3. API service layer
4. TypeScript type definitions
5. Component organization

Any suggestions for improvements or best practices?
```

**Strategy**: Sought feedback on project structure to ensure scalability and maintainability.

## 🔧 Implementation Guidance

### Prompt 4: Authentication Implementation
```
I need to implement mocked authentication in Next.js 15 with the following requirements:
- Any non-empty email/password should work
- Store fake token in localStorage
- Protect /board route
- Redirect to /board after successful login
- Logout should clear token and redirect to /login

Should I use:
1. Middleware for route protection?
2. Context API for auth state?
3. Cookies for SSR compatibility?

Please provide a step-by-step implementation approach.
```

**Strategy**: Broke down the authentication requirement into specific technical questions to get targeted guidance.

### Prompt 5: Drag & Drop with Framer Motion
```
I need to implement drag & drop functionality for moving tasks between columns using Framer Motion. Requirements:
- Tasks can be dragged between Todo, In Progress, and Done columns
- Visual feedback during drag
- Optimistic updates with rollback on API failure
- Smooth animations

Should I use:
1. Framer Motion's drag prop with custom logic?
2. Drop zones for each column?
3. How to handle the drag end event to determine target column?

Please provide a code example for the drag & drop implementation.
```

**Strategy**: Asked for specific implementation details and code examples to understand the best approach.

### Prompt 6: API Integration Pattern
```
I need to implement API integration with the following requirements:
- Mock API using json-server
- Optimistic updates for better UX
- Rollback on API failures
- 10% failure rate simulation
- Error handling and user feedback

What's the best pattern for:
1. API service layer structure?
2. Optimistic update implementation?
3. Error handling and rollback?
4. Loading states?

Please provide examples of the API service and how to integrate it with React components.
```

**Strategy**: Focused on patterns and best practices for robust API integration.

## 🎨 UI/UX Implementation

### Prompt 7: Dark Mode Implementation
```
I need to implement dark mode in my Next.js application with the following requirements:
- Toggle between light and dark themes
- Persist preference in localStorage
- System preference detection
- Smooth transitions
- Tailwind CSS integration

Should I use:
1. CSS custom properties?
2. Tailwind's dark mode class?
3. Context API for theme state?
4. How to handle SSR hydration?

Please provide a complete implementation example.
```

**Strategy**: Asked for complete implementation details to ensure proper dark mode functionality.

### Prompt 8: Toast Notification System
```
I need to implement a toast notification system with the following features:
- Success, error, and info message types
- Auto-dismiss after 5 seconds
- Manual dismiss option
- Action buttons (for undo functionality)
- Smooth animations with Framer Motion
- Context API for global state

Requirements:
- Toast should appear in top-right corner
- Stack multiple toasts
- Different styles for different types
- Accessible with proper ARIA labels

Please provide the complete implementation including context, component, and usage examples.
```

**Strategy**: Provided detailed requirements to get a comprehensive solution that covers all use cases.

## 🧪 Testing & Polish

### Prompt 9: Error Handling Strategy
```
I need to implement comprehensive error handling for my Sprint Board application. Scenarios to handle:
1. API failures (network errors, 500 responses)
2. Invalid user actions
3. Loading timeouts
4. Optimistic update rollbacks
5. User feedback for all error states

What's the best approach for:
1. Error boundaries vs try-catch?
2. User-friendly error messages?
3. Retry mechanisms?
4. Error logging and monitoring?

Please provide examples of error handling patterns and user feedback strategies.
```

**Strategy**: Focused on user experience and error recovery to ensure robust application behavior.

### Prompt 10: Performance Optimization
```
I'm building a task management app with drag & drop, animations, and real-time updates. What performance optimizations should I implement?

Areas of concern:
1. Large task lists rendering
2. Frequent re-renders during drag operations
3. Animation performance
4. Bundle size optimization
5. Loading states and perceived performance

Please provide specific optimization techniques and code examples.
```

**Strategy**: Proactively addressed performance concerns to ensure smooth user experience.

## 📝 Documentation & Deployment

### Prompt 11: README Structure
```
I need to create a comprehensive README.md for my Sprint Board Lite project. It should include:
1. Project overview and features
2. Tech stack and architecture decisions
3. Installation and setup instructions
4. Project structure explanation
5. Key implementation details
6. What's done vs omitted
7. Time spent breakdown
8. Future enhancements

Please provide a structured outline and example content for each section.
```

**Strategy**: Asked for structured documentation to ensure comprehensive project documentation.

### Prompt 12: Deployment Strategy
```
I need to deploy my Next.js 15 application to Vercel. Requirements:
1. Environment variables setup
2. API proxy configuration for json-server
3. Build optimization
4. Domain configuration
5. Environment-specific settings

What's the best approach for:
1. Mock API in production?
2. Environment variable management?
3. Build and deployment process?
4. Performance monitoring?

Please provide step-by-step deployment instructions.
```

**Strategy**: Sought deployment guidance to ensure smooth production deployment.

## 🎯 Prompting Strategies Used

### 1. **Specificity**: Always provided detailed requirements and constraints
### 2. **Context**: Gave full project context for better understanding
### 3. **Alternatives**: Asked for multiple approaches to make informed decisions
### 4. **Examples**: Requested code examples for practical implementation
### 5. **Validation**: Sought feedback on decisions before implementation
### 6. **Progressive**: Broke down complex features into smaller, manageable parts
### 7. **User-Focused**: Emphasized user experience and error handling
### 8. **Performance-Aware**: Considered performance implications from the start

## 📊 AI Usage Impact

### **Development Speed**: ~40% faster with AI assistance
### **Code Quality**: Better patterns and best practices implementation
### **Problem Solving**: Quick resolution of technical challenges
### **Documentation**: Comprehensive and well-structured documentation
### **Learning**: Better understanding of Next.js 15 and modern React patterns

## 🔮 Lessons Learned

1. **Clear Requirements**: Detailed prompts yield better, more targeted responses
2. **Iterative Approach**: Breaking down complex features into smaller prompts is more effective
3. **Context Matters**: Providing full project context helps AI understand constraints and goals
4. **Validation**: Always validate AI suggestions against project requirements
5. **Documentation**: Documenting AI usage helps track decisions and learn from the process

---

*This document demonstrates effective AI prompting strategies for modern web development, showcasing how to leverage AI assistance while maintaining code quality and project requirements.*
