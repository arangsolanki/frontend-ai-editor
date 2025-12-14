# Project Folder Structure

```
frontend-task-chq/
│
├── app/                                    # Next.js App Router directory
│   ├── api/                               # API routes (backend endpoints)
│   │   └── continue/                      # AI continuation endpoint
│   │       └── route.ts                   # POST /api/continue handler
│   │
│   ├── globals.css                        # Global styles, ProseMirror CSS
│   ├── layout.tsx                         # Root layout component
│   └── page.tsx                           # Home page (main editor page)
│
├── components/                             # React components
│   └── Editor/                            # Editor-related components
│       ├── Editor.tsx                     # Main editor component (ProseMirror + XState)
│       └── EditorToolbar.tsx              # Toolbar with Continue Writing button
│
├── lib/                                    # Core business logic and utilities
│   ├── types.ts                           # TypeScript type definitions
│   ├── aiService.ts                       # AI integration (OpenAI/Hugging Face)
│   ├── editorMachine.ts                   # XState state machine definition
│   └── prosemirrorSetup.ts                # ProseMirror configuration & helpers
│
├── public/                                 # Static assets (served at /)
│   └── (empty - add images, fonts, etc.)
│
├── node_modules/                           # Dependencies (auto-generated)
│
├── .next/                                  # Next.js build output (auto-generated)
│
├── .env.local                              # Environment variables (API keys) - CREATE THIS
│
├── .eslintrc.json                         # ESLint configuration
├── .gitignore                             # Git ignore rules
├── next.config.js                         # Next.js configuration
├── package.json                           # Project metadata & dependencies
├── package-lock.json                      # Locked dependency versions
├── postcss.config.js                      # PostCSS configuration (for Tailwind)
├── tailwind.config.ts                     # Tailwind CSS configuration
├── tsconfig.json                          # TypeScript configuration
│
├── README.md                              # Main project documentation
├── RESEARCH.md                            # Technology research & analysis
├── ARCHITECTURE.md                        # Architecture documentation
├── SETUP_GUIDE.md                         # Step-by-step setup instructions
├── FOLDER_STRUCTURE.md                    # This file
└── VIDEO_WALKTHROUGH_SCRIPT.md            # Video presentation script
```

## Detailed File Descriptions

### `/app` Directory (Next.js App Router)

**`/app/page.tsx`**
- Main application page
- Renders the Editor component
- Includes header, features section, tech stack
- Provides overall layout and information

**`/app/layout.tsx`**
- Root layout component
- Defines HTML structure
- Imports global CSS
- Sets metadata (title, description)

**`/app/globals.css`**
- Global CSS styles
- Tailwind directives
- ProseMirror editor styles
- Custom animations
- Dark mode styles
- Scrollbar customization

**`/app/api/continue/route.ts`**
- Next.js API route
- Handles POST requests to `/api/continue`
- Validates request body
- Calls AI service
- Returns JSON response
- Includes error handling

### `/components` Directory

**`/components/Editor/Editor.tsx`** (Main Editor Component)
- Wraps ProseMirror editor
- Integrates XState state machine
- Manages editor lifecycle
- Handles AI text generation requests
- Displays loading and error states
- ~150 lines of code

Key responsibilities:
- Initialize ProseMirror on mount
- Sync editor content with React state
- Handle "Continue Writing" button clicks
- Make API calls to `/api/continue`
- Insert AI-generated text into editor
- Manage state machine events

**`/components/Editor/EditorToolbar.tsx`** (Toolbar Component)
- UI controls for the editor
- "Continue Writing" button
- Reset/clear button
- Loading states
- Disabled states when no text
- ~100 lines of code

Props:
- `onContinueWriting: () => void` - Handler for continue button
- `onReset: () => void` - Handler for reset button
- `isLoading: boolean` - Loading state
- `disabled: boolean` - Disable state

### `/lib` Directory (Core Logic)

**`/lib/types.ts`** (Type Definitions)
- TypeScript interfaces and types
- AI provider types (`'openai' | 'huggingface'`)
- Request/response interfaces
- State machine context and events
- ~80 lines of code

Key types:
- `AIProvider` - AI service provider
- `ContinueWritingRequest` - API request
- `ContinueWritingResponse` - API response
- `EditorContext` - XState context
- `EditorEvent` - XState events

**`/lib/aiService.ts`** (AI Integration)
- AI service abstraction
- OpenAI API integration
- Hugging Face API integration
- Provider switching logic
- Error handling
- ~180 lines of code

Key functions:
- `continueWriting()` - Main entry point
- `continueWithOpenAI()` - OpenAI implementation
- `continueWithHuggingFace()` - HF implementation
- `isAIConfigured()` - Configuration check

**`/lib/editorMachine.ts`** (XState Machine)
- State machine definition
- State transitions
- Actions (setCurrentText, setError, etc.)
- Guards (rate limiting, validation)
- ~120 lines of code

States:
- `idle` - Ready for input
- `loading` - AI request in progress
- `success` - AI text generated
- `error` - Request failed

Events:
- `CONTINUE_WRITING` - Trigger AI generation
- `SUCCESS` - AI succeeded
- `ERROR` - AI failed
- `RESET` - Reset machine

**`/lib/prosemirrorSetup.ts`** (ProseMirror Config)
- ProseMirror schema setup
- Editor state creation
- Plugin configuration
- Helper functions
- ~150 lines of code

Key functions:
- `createEditorState()` - Initialize state
- `createEditorView()` - Create view
- `insertTextAtEnd()` - Append text
- `getTextContent()` - Extract text
- `createKeymap()` - Keyboard shortcuts

### Configuration Files

**`package.json`**
- Project metadata
- Dependencies list
- Scripts (dev, build, start, lint)
- Node engine requirement

**`tsconfig.json`**
- TypeScript compiler options
- Strict mode enabled
- Path aliases (@/*)
- Module resolution

**`next.config.js`**
- Next.js configuration
- React strict mode
- SWC minification

**`tailwind.config.ts`**
- Tailwind CSS configuration
- Content paths
- Theme extensions
- Custom animations

**`.eslintrc.json`**
- ESLint configuration
- Next.js recommended rules

**`.gitignore`**
- Ignored files/folders
- node_modules
- .next build
- .env files
- OS files

### Documentation Files

**`README.md`** (~500 lines)
- Project overview
- Features list
- Tech stack
- Getting started guide
- Configuration instructions
- Usage examples
- Architecture overview
- Design decisions
- Future enhancements

**`RESEARCH.md`** (~400 lines)
- Technology research
- ProseMirror analysis
- XState evaluation
- AI provider comparison
- Design decisions rationale
- Best practices
- References

**`ARCHITECTURE.md`** (~500 lines)
- System architecture
- Layer breakdown
- Data flow diagrams
- Component communication
- State synchronization
- Error handling strategy
- Performance considerations
- Security considerations

**`SETUP_GUIDE.md`** (~600 lines)
- Step-by-step setup
- Prerequisites
- Installation instructions
- API key configuration
- Troubleshooting guide
- Advanced configuration
- Deployment instructions

**`VIDEO_WALKTHROUGH_SCRIPT.md`** (This file, ~300 lines)
- Video script
- Recording tips
- Timeline structure
- Talking points

## File Size Summary

| Category | Files | Total Lines | Percentage |
|----------|-------|-------------|------------|
| Components | 2 | ~250 | 10% |
| Core Logic | 4 | ~530 | 20% |
| API Routes | 1 | ~60 | 2% |
| Styles | 1 | ~100 | 4% |
| Config | 6 | ~150 | 6% |
| Documentation | 5 | ~2400 | 58% |
| **Total** | **19** | **~4100** | **100%** |

## Component Dependency Graph

```
page.tsx
  └─→ Editor.tsx
       ├─→ EditorToolbar.tsx
       ├─→ editorMachine.ts
       │    └─→ types.ts
       ├─→ prosemirrorSetup.ts
       │    └─→ types.ts
       └─→ /api/continue
            └─→ aiService.ts
                 └─→ types.ts
```

## Import Flow

```typescript
// page.tsx
import Editor from '@/components/Editor/Editor';

// Editor.tsx
import { EditorView } from 'prosemirror-view';
import { useMachine } from '@xstate/react';
import { editorMachine } from '@/lib/editorMachine';
import { createEditorState, insertTextAtEnd } from '@/lib/prosemirrorSetup';
import EditorToolbar from './EditorToolbar';

// editorMachine.ts
import { setup, assign } from 'xstate';
import type { EditorContext, EditorEvent } from './types';

// aiService.ts
import { AIProvider, ContinueWritingRequest } from './types';

// route.ts
import { continueWriting } from '@/lib/aiService';
import { AIProvider } from '@/lib/types';
```

## Directory Naming Conventions

- **Lowercase with hyphens** for route folders (Next.js convention)
- **PascalCase** for component folders
- **camelCase** for utility folders
- **UPPERCASE** for documentation files (README, etc.)

## File Naming Conventions

- **PascalCase.tsx** for React components
- **camelCase.ts** for utilities and services
- **route.ts** for API routes (Next.js convention)
- **layout.tsx, page.tsx** for Next.js special files

## Adding New Features

### Adding a New Component
```
1. Create file: components/NewFeature/NewFeature.tsx
2. Define types in lib/types.ts (if needed)
3. Import and use in page.tsx or other components
```

### Adding a New API Route
```
1. Create folder: app/api/new-route/
2. Create file: app/api/new-route/route.ts
3. Export GET, POST, etc. functions
4. Call from components using fetch()
```

### Adding a New Utility
```
1. Create file: lib/newUtility.ts
2. Export functions
3. Import where needed
```

## Build Output

After running `npm run build`:

```
.next/
├── cache/              # Build cache
├── server/             # Server bundles
│   ├── app/           # App routes
│   └── pages/         # Pages API
├── static/            # Static files
│   ├── chunks/        # Code chunks
│   └── css/           # CSS bundles
└── trace              # Performance traces
```

## Development Files (Not in Production)

- `.next/` - Build output
- `node_modules/` - Dependencies
- `.env.local` - Local environment variables
- `*.log` - Log files
- `tsconfig.tsbuildinfo` - TypeScript build info

## Version Control

Files tracked in Git:
- ✅ All source code (.tsx, .ts, .css)
- ✅ Configuration files
- ✅ Documentation files
- ✅ package.json, package-lock.json

Files NOT tracked (in .gitignore):
- ❌ node_modules/
- ❌ .next/
- ❌ .env.local
- ❌ Build artifacts

## Code Organization Principles

1. **Separation of Concerns** - UI, state, logic, types separated
2. **Single Responsibility** - Each file has one clear purpose
3. **Dependency Direction** - Higher layers depend on lower layers
4. **Type Safety** - Types defined centrally in lib/types.ts
5. **Modularity** - Easy to add/remove/modify features

## Total Project Size

- **Source Code:** ~1,000 lines
- **Documentation:** ~2,400 lines
- **Dependencies:** ~250 packages, ~300MB
- **Build Output:** ~50MB

---

This structure provides a clean, maintainable codebase that's easy to navigate and extend.

