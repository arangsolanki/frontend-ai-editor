# AI Writing Assistant

> An intelligent AI-assisted text editor built with ProseMirror, XState, and Next.js for Chronicle's Senior Frontend Engineer interview task.

![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![React](https://img.shields.io/badge/React-18-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Development](#development)
- [Key Implementation Details](#key-implementation-details)
- [Design Decisions](#design-decisions)
- [Future Enhancements](#future-enhancements)

## 🎯 Overview

This project is an AI-assisted text editor that allows users to write text and have AI intelligently continue their writing. It demonstrates proficiency in modern frontend technologies and architectural patterns.

### Functional Requirements ✅

- ✅ Text editor box for user input
- ✅ "Continue Writing" button to trigger AI completion
- ✅ AI seamlessly continues writing inside the editor
- ✅ Modern, intuitive user interface
- ✅ Error handling and loading states

### Technical Requirements ✅

- ✅ **TypeScript** - Fully typed codebase
- ✅ **React** - Component-based architecture
- ✅ **XState** - State machine for editor lifecycle
- ✅ **ProseMirror** - Professional-grade text editor

## ✨ Features

### Core Features
- **AI Text Continuation** - GPT-powered intelligent text generation
- **Rich Text Editing** - ProseMirror-based editor with undo/redo
- **State Management** - XState finite state machine for predictable behavior
- **Real-time Updates** - Instant character count and state indicators
- **Error Handling** - Graceful error messages and recovery

### UX Features
- **Loading States** - Visual feedback during AI generation
- **Dark Mode** - Automatic dark mode support
- **Responsive Design** - Works on all device sizes
- **Keyboard Shortcuts** - Undo (Cmd+Z) and Redo (Cmd+Y)
- **Clear Editor** - Reset button to start fresh

### Technical Features
- **Dual AI Provider Support** - OpenAI and Hugging Face
- **Type Safety** - Comprehensive TypeScript coverage
- **Modular Architecture** - Clean separation of concerns
- **API Routes** - Next.js API routes for backend logic
- **Environment Configuration** - Easy setup with environment variables

## 🛠 Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 18** - UI component library
- **TypeScript 5.6** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework

### Editor & State
- **ProseMirror** - Rich text editor framework
  - `prosemirror-state` - Editor state management
  - `prosemirror-view` - DOM rendering
  - `prosemirror-model` - Document model
  - `prosemirror-schema-basic` - Basic schema
  - `prosemirror-history` - Undo/redo functionality
  - `prosemirror-keymap` - Keyboard shortcuts
  - `prosemirror-commands` - Editor commands
- **XState 5** - State machine library
- **@xstate/react** - React integration for XState

### AI Integration
- **OpenAI API** - GPT-3.5/4 text generation
- **Hugging Face Inference API** - Alternative AI provider

## 🏗 Architecture

### State Management with XState

The application uses a finite state machine to manage the editor lifecycle:

```
┌──────┐  CONTINUE_WRITING    ┌─────────┐
│ idle │ ───────────────────> │ loading │
└──────┘                      └─────────┘
   ↑                            │      │
   │                            │      │
   │         SUCCESS            ↓      │ ERROR
   │      ┌─────────┐                  ↓
   └──────│ success │          ┌───────┐
          └─────────┘          │ error │
                               └───────┘
                                  │
                                  │ (auto reset)
                                  ↓
                               ┌──────┐
                               │ idle │
                               └──────┘
```

**States:**
- **idle**: Ready for user input
- **loading**: AI request in progress
- **success**: AI text generated successfully
- **error**: Request failed with error message

### Component Architecture

```
app/
├── page.tsx              # Main page with editor
├── layout.tsx            # Root layout
└── api/
    └── continue/
        └── route.ts      # AI continuation API endpoint

components/
└── Editor/
    ├── Editor.tsx        # Main editor component (ProseMirror wrapper)
    └── EditorToolbar.tsx # Toolbar with Continue button

lib/
├── types.ts              # TypeScript type definitions
├── aiService.ts          # AI integration (OpenAI/HuggingFace)
├── editorMachine.ts      # XState state machine
└── prosemirrorSetup.ts   # ProseMirror configuration
```

### Data Flow

1. **User writes text** → ProseMirror updates → React state updates
2. **User clicks "Continue Writing"** → XState transitions to `loading`
3. **API request** → `/api/continue` endpoint
4. **AI Service** → Calls OpenAI/Hugging Face API
5. **Response received** → XState transitions to `success`
6. **Text inserted** → ProseMirror transaction → Editor updates
7. **Auto-reset** → XState returns to `idle` state

## 🚀 Getting Started

### Prerequisites

- **Node.js** 22.0.0 or higher
- **npm** or **yarn** or **pnpm**
- **OpenAI API Key** or **Hugging Face API Token**

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd frontend-task-chq
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```bash
# Choose your AI provider: 'openai' or 'huggingface'
AI_PROVIDER=openai

# OpenAI Configuration (if using OpenAI)
OPENAI_API_KEY=your_openai_api_key_here

# Hugging Face Configuration (if using Hugging Face)
# HUGGINGFACE_API_KEY=your_huggingface_token_here
# HUGGINGFACE_MODEL=mistralai/Mistral-7B-Instruct-v0.2
```

4. **Run the development server**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

### Getting API Keys

#### OpenAI (Recommended)
1. Visit [platform.openai.com](https://platform.openai.com)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Add billing information (pay-as-you-go)

#### Hugging Face (Free Tier Available)
1. Visit [huggingface.co](https://huggingface.co)
2. Sign up or log in
3. Go to Settings → Access Tokens
4. Create a new token with read permissions
5. Use serverless inference API (free tier available)

## ⚙️ Configuration

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `AI_PROVIDER` | No | `openai` | AI service provider: `openai` or `huggingface` |
| `OPENAI_API_KEY` | Yes* | - | OpenAI API key |
| `HUGGINGFACE_API_KEY` | Yes** | - | Hugging Face API token |
| `HUGGINGFACE_MODEL` | No | `mistralai/Mistral-7B-Instruct-v0.2` | HF model to use |

\* Required if `AI_PROVIDER=openai`  
\** Required if `AI_PROVIDER=huggingface`

### Switching AI Providers

Edit `.env.local`:

```bash
# For OpenAI
AI_PROVIDER=openai
OPENAI_API_KEY=sk-...

# For Hugging Face
AI_PROVIDER=huggingface
HUGGINGFACE_API_KEY=hf_...
HUGGINGFACE_MODEL=mistralai/Mistral-7B-Instruct-v0.2
```

Restart the development server after changing environment variables.

## 📖 Usage

### Basic Usage

1. **Type your text** in the editor
2. **Click "Continue Writing"** button
3. **Wait** for AI to generate continuation
4. **AI text** appears seamlessly in the editor
5. **Continue editing** or generate more

### Keyboard Shortcuts

- `Cmd+Z` (Mac) / `Ctrl+Z` (Windows/Linux) - Undo
- `Cmd+Y` (Mac) / `Ctrl+Y` (Windows/Linux) - Redo
- `Cmd+Shift+Z` - Alternative Redo

### Tips

- Write at least a few words before using "Continue Writing"
- The AI continues naturally from where you left off
- You can edit AI-generated text like your own
- Use the trash icon to clear and start fresh
- Check the state indicator to see current status

## 📁 Project Structure

```
frontend-task-chq/
├── app/                          # Next.js App Router
│   ├── api/
│   │   └── continue/
│   │       └── route.ts         # AI continuation API endpoint
│   ├── globals.css              # Global styles & ProseMirror CSS
│   ├── layout.tsx               # Root layout component
│   └── page.tsx                 # Home page with editor
│
├── components/                   # React components
│   └── Editor/
│       ├── Editor.tsx           # Main editor (ProseMirror + XState)
│       └── EditorToolbar.tsx    # Toolbar with controls
│
├── lib/                         # Core business logic
│   ├── types.ts                 # TypeScript type definitions
│   ├── aiService.ts             # AI integration layer
│   ├── editorMachine.ts         # XState state machine
│   └── prosemirrorSetup.ts      # ProseMirror configuration
│
├── public/                      # Static assets
│
├── .env.local                   # Environment variables (create this)
├── .eslintrc.json              # ESLint configuration
├── .gitignore                  # Git ignore rules
├── next.config.js              # Next.js configuration
├── package.json                # Dependencies and scripts
├── postcss.config.js           # PostCSS configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
├── RESEARCH.md                 # Research and technical analysis
└── README.md                   # This file
```

### Key Files Explained

#### `/lib/types.ts`
- TypeScript interfaces and types
- AI provider types
- State machine context and events
- API request/response types

#### `/lib/aiService.ts`
- AI integration logic
- OpenAI API client
- Hugging Face API client
- Provider abstraction layer
- Error handling

#### `/lib/editorMachine.ts`
- XState machine definition
- State transitions
- Actions (setCurrentText, setGeneratedText, setError)
- Guards (rate limiting, validation)

#### `/lib/prosemirrorSetup.ts`
- ProseMirror schema setup
- Editor state creation
- Plugin configuration
- Helper functions (insertTextAtEnd, getTextContent)
- Keymap setup (undo/redo)

#### `/components/Editor/Editor.tsx`
- Main editor component
- ProseMirror integration
- XState React hooks
- Event handlers
- Loading/error states

#### `/app/api/continue/route.ts`
- Next.js API route
- Request validation
- AI service invocation
- Response formatting
- Error handling

## 💻 Development

### Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Type check
npm run type-check
```

### Code Style

- **TypeScript** - Strict mode enabled
- **ESLint** - Next.js recommended config
- **Prettier** - (optional, can be added)
- **Naming Conventions**:
  - Components: PascalCase
  - Functions: camelCase
  - Constants: UPPER_SNAKE_CASE
  - Files: PascalCase for components, camelCase for utilities

### Adding New Features

1. **Define types** in `/lib/types.ts`
2. **Create services** in `/lib/`
3. **Build components** in `/components/`
4. **Add API routes** in `/app/api/`
5. **Update documentation**

## 🔍 Key Implementation Details

### ProseMirror Integration

ProseMirror is a complex but powerful editor framework. Key aspects:

- **Schema-based**: Document structure is defined by a schema
- **Immutable state**: Editor state is immutable, changes via transactions
- **Plugin system**: Extensible via plugins
- **Collaborative**: Built for real-time collaboration (not used here)

```typescript
// Creating editor state
const state = EditorState.create({
  doc: schema.nodeFromJSON(/* ... */),
  schema: editorSchema,
  plugins: [history(), keymap(/* ... */), /* ... */],
});

// Updating via transactions
const tr = state.tr.insert(pos, node);
view.dispatch(tr);
```

### XState State Machine

XState provides predictable state management:

- **Explicit states**: No impossible states
- **Clear transitions**: Visual state machine graph
- **Type-safe**: Full TypeScript support
- **Testable**: Easy to test state transitions

```typescript
// Machine definition
export const editorMachine = setup({
  types: { context: {} as EditorContext, events: {} as EditorEvent },
  actions: { /* ... */ },
  guards: { /* ... */ },
}).createMachine({
  id: 'editor',
  initial: 'idle',
  states: { /* ... */ },
});

// Usage in React
const [state, send] = useMachine(editorMachine);
```

### AI Integration

Supports multiple providers with a unified interface:

```typescript
// OpenAI
const response = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${apiKey}` },
  body: JSON.stringify({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
  }),
});

// Hugging Face
const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${apiKey}` },
  body: JSON.stringify({ inputs: prompt }),
});
```

## 🎨 Design Decisions

### 1. **Why Next.js?**
- Integrated backend (API routes) - no separate server needed
- Great developer experience
- Built-in TypeScript support
- Optimized production builds

### 2. **Why XState over Redux/Zustand?**
- Explicit state modeling prevents bugs
- Visual state diagrams for documentation
- Built-in guards and actions
- Perfect for lifecycle management (idle → loading → success/error)

### 3. **Why ProseMirror over Draft.js/Slate?**
- Industry standard (used by Atlassian, NYT, GitLab)
- Powerful transaction system
- Excellent for programmatic text insertion
- Built for complex use cases

### 4. **Dual AI Provider Support**
- OpenAI for quality (but costs money)
- Hugging Face as free alternative
- Easy to switch via environment variables
- Demonstrates abstraction skills

### 5. **Modular Architecture**
- Clear separation: UI, state, services, types
- Easy to test individual modules
- Simple to extend with new features
- Better code organization

### 6. **Type Safety**
- Strict TypeScript mode
- Reduces runtime errors
- Better IDE support
- Self-documenting code

## 🚧 Future Enhancements

### Feature Ideas
- [ ] **Streaming responses** - Show AI text as it's generated
- [ ] **Multiple AI models** - Let users choose model (GPT-4, Claude, etc.)
- [ ] **Text formatting** - Bold, italic, headings
- [ ] **Save/load documents** - Local storage or database
- [ ] **Export** - PDF, Markdown, Word
- [ ] **Prompt customization** - Let users customize AI behavior
- [ ] **Collaborative editing** - Real-time collaboration
- [ ] **Version history** - Track document changes
- [ ] **AI suggestions** - Show suggestions before inserting

### Technical Improvements
- [ ] **Unit tests** - Jest + React Testing Library
- [ ] **E2E tests** - Playwright
- [ ] **Performance** - Code splitting, lazy loading
- [ ] **Analytics** - Track usage patterns
- [ ] **Error reporting** - Sentry integration
- [ ] **Rate limiting** - Prevent API abuse
- [ ] **Caching** - Cache common completions
- [ ] **PWA** - Progressive Web App support

## 🤝 Contributing

This is an interview task submission, but feedback is welcome!

## 📄 License

MIT License - feel free to use this code for learning purposes.

## 👤 Author

**Arang Solanki**
- Interview Task for Chronicle
- Position: Senior Frontend Engineer
- Date: December 2024

## 🙏 Acknowledgments

- **Chronicle** for the interesting challenge
- **ProseMirror** community for excellent documentation
- **XState** team for the powerful state management library
- **OpenAI** for the GPT API
- **Hugging Face** for free AI inference

## 📚 Resources & References

### Official Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [ProseMirror Guide](https://prosemirror.net/docs/guide/)
- [XState Docs](https://stately.ai/docs/xstate)
- [OpenAI API](https://platform.openai.com/docs)
- [Hugging Face Inference](https://huggingface.co/docs/api-inference/)

### Learning Resources
- [ProseMirror Examples](https://prosemirror.net/examples/)
- [XState Visualizer](https://stately.ai/viz)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)

---

**Built with ❤️ using modern web technologies**
