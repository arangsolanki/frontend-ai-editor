# Architecture Documentation

## System Overview

The AI Writing Assistant is built using a modern, modular architecture that separates concerns across multiple layers:

```
┌─────────────────────────────────────────────────────────────┐
│                        Presentation Layer                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Editor     │  │   Toolbar    │  │    Page      │     │
│  │ Component    │  │  Component   │  │  Component   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                      State Management Layer                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │          XState State Machine (editorMachine)        │  │
│  │  States: idle → loading → success/error → idle       │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                       Business Logic Layer                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ ProseMirror  │  │  AI Service  │  │     API      │     │
│  │    Setup     │  │   (OpenAI/   │  │    Routes    │     │
│  │              │  │   HuggingF)  │  │              │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                        External Services                     │
│  ┌──────────────┐              ┌──────────────┐            │
│  │  OpenAI API  │              │ Hugging Face │            │
│  │  (GPT-3.5/4) │              │     API      │            │
│  └──────────────┘              └──────────────┘            │
└─────────────────────────────────────────────────────────────┘
```

## Layer Breakdown

### 1. Presentation Layer

**Components:**
- `app/page.tsx` - Main application page
- `components/Editor/Editor.tsx` - ProseMirror editor wrapper
- `components/Editor/EditorToolbar.tsx` - User controls

**Responsibilities:**
- Render UI components
- Handle user interactions
- Display loading/error states
- Manage ProseMirror view lifecycle

**Key Patterns:**
- React hooks for state and effects
- Ref management for ProseMirror DOM
- Event handlers for user actions
- Conditional rendering for states

### 2. State Management Layer

**Implementation:** XState State Machine

**Machine Definition:**
```typescript
editorMachine {
  id: 'editor',
  initial: 'idle',
  context: {
    currentText: string,
    generatedText: string | null,
    error: string | null,
    lastRequestTime: number | null,
  },
  states: {
    idle: { /* ready for user input */ },
    loading: { /* AI request in progress */ },
    success: { /* AI text generated */ },
    error: { /* request failed */ },
  }
}
```

**State Transitions:**

```
IDLE STATE
  ├─ Event: CONTINUE_WRITING
  │  └─ Guard: hasText && canMakeRequest
  │     └─ Action: setCurrentText
  │        └─ Transition: → LOADING

LOADING STATE
  ├─ Event: SUCCESS
  │  └─ Action: setGeneratedText
  │     └─ Transition: → SUCCESS
  │
  └─ Event: ERROR
     └─ Action: setError
        └─ Transition: → ERROR

SUCCESS STATE
  └─ After: 100ms
     └─ Transition: → IDLE

ERROR STATE
  ├─ After: 3000ms
  │  └─ Transition: → IDLE
  │
  └─ Event: RESET
     └─ Action: reset
        └─ Transition: → IDLE
```

**Benefits:**
- Prevents impossible states
- Explicit state transitions
- Built-in guards for validation
- Easy to visualize and test

### 3. Business Logic Layer

#### ProseMirror Setup (`lib/prosemirrorSetup.ts`)

**Schema:**
```typescript
editorSchema = new Schema({
  nodes: basicSchema.spec.nodes,  // doc, paragraph, text, etc.
  marks: basicSchema.spec.marks,  // bold, italic, etc.
})
```

**Plugins:**
1. **History Plugin** - Undo/redo functionality
2. **Keymap Plugin** - Keyboard shortcuts
3. **Update Plugin** - Notify React of changes

**Key Functions:**
- `createEditorState()` - Initialize editor
- `createEditorView()` - Create view instance
- `insertTextAtEnd()` - Append AI text
- `getTextContent()` - Extract current text
- `setContent()` - Replace all content

#### AI Service (`lib/aiService.ts`)

**Architecture:**
```
continueWriting(request, provider)
    ├─ if provider === 'openai'
    │  └─ continueWithOpenAI()
    │     └─ POST https://api.openai.com/v1/chat/completions
    │
    └─ if provider === 'huggingface'
       └─ continueWithHuggingFace()
          └─ POST https://api-inference.huggingface.co/models/{model}
```

**OpenAI Integration:**
- Model: `gpt-3.5-turbo`
- Messages format with system and user roles
- Temperature: 0.7 (balanced creativity)
- Max tokens: 150 (configurable)

**Hugging Face Integration:**
- Default model: `mistralai/Mistral-7B-Instruct-v0.2`
- Serverless inference API
- Free tier available
- Supports multiple open-source models

**Error Handling:**
- API key validation
- Network error handling
- Response validation
- Graceful fallback

#### API Routes (`app/api/continue/route.ts`)

**Endpoints:**

1. **POST /api/continue**
   - Body: `{ text: string, maxTokens?: number }`
   - Response: `{ continuedText: string, provider: string, error?: string }`
   - Validates input
   - Calls AI service
   - Returns formatted response

2. **GET /api/continue**
   - Health check endpoint
   - Returns service status

### 4. External Services

#### OpenAI API
- **Endpoint:** `https://api.openai.com/v1/chat/completions`
- **Auth:** Bearer token in Authorization header
- **Rate Limits:** Tier-based (depends on account)
- **Cost:** ~$0.0015 per 1K tokens (GPT-3.5)

#### Hugging Face API
- **Endpoint:** `https://router.huggingface.co/models/{model}` (updated from legacy endpoint)
- **Auth:** Bearer token in Authorization header
- **Free Tier:** Available with rate limits
- **Cold Start:** First request may be slow

## Data Flow

### User Writes Text
```
1. User types in editor
   ↓
2. ProseMirror updates state
   ↓
3. Update plugin triggers callback
   ↓
4. React state updates (editorContent)
   ↓
5. UI re-renders (character count)
```

### AI Text Generation
```
1. User clicks "Continue Writing"
   ↓
2. Editor.tsx: handleContinueWriting()
   ├─ Get current text from ProseMirror
   ├─ Send CONTINUE_WRITING to XState
   │  └─ Machine transitions: idle → loading
   └─ Fetch POST /api/continue
      ↓
3. API Route: /api/continue/route.ts
   ├─ Validate request
   ├─ Call continueWriting(request, provider)
   │  ↓
4. AI Service: aiService.ts
   ├─ if OpenAI: continueWithOpenAI()
   │  └─ POST to OpenAI API
   ├─ if Hugging Face: continueWithHuggingFace()
   │  └─ POST to HF API
   └─ Return { continuedText, provider }
      ↓
5. API Route returns response
   ↓
6. Editor.tsx receives response
   ├─ if success:
   │  ├─ insertTextAtEnd(view, text)
   │  │  └─ ProseMirror transaction
   │  └─ Send SUCCESS to XState
   │     └─ Machine: loading → success → idle
   └─ if error:
      ├─ Send ERROR to XState
      │  └─ Machine: loading → error → (3s) → idle
      └─ Display error message
```

## Component Communication

### Parent → Child
- Props passing (standard React)
- Callback functions for events

### Child → Parent
- Event callbacks (e.g., `onContinueWriting`)
- No direct state mutation

### Cross-Component State
- XState machine (shared via `useMachine` hook)
- ProseMirror view (shared via ref)

## State Synchronization

### ProseMirror State
- **Source of Truth:** ProseMirror EditorState
- **Synchronization:** One-way (ProseMirror → React)
- **Updates:** Via transactions, not direct mutation

### XState Machine
- **Source of Truth:** XState context
- **Synchronization:** Via send() events
- **Updates:** Immutable state transitions

### React Local State
- **Purpose:** UI-specific state (e.g., character count)
- **Synchronization:** Updated via ProseMirror callbacks
- **Updates:** Via useState hook

## Error Handling Strategy

### Layers of Error Handling

1. **Input Validation** (Frontend)
   - Check for empty text
   - Validate before API call
   - Show user-friendly alerts

2. **API Validation** (API Route)
   - Validate request body
   - Check API key configuration
   - Return 400/500 status codes

3. **Service Layer** (AI Service)
   - Try-catch around API calls
   - Parse API error responses
   - Return standardized error format

4. **State Machine** (XState)
   - Error state with timeout
   - Auto-recovery to idle state
   - Error context storage

5. **UI Display** (Components)
   - Error banner with message
   - Graceful degradation
   - Clear error messaging

## Performance Considerations

### Optimizations
1. **React Rendering**
   - Minimal re-renders (refs for ProseMirror)
   - Conditional rendering for loading states

2. **ProseMirror**
   - Efficient transaction handling
   - No unnecessary state recreation

3. **API Calls**
   - Rate limiting via XState guard
   - Request timeout handling

4. **Bundle Size**
   - Tree-shaking for unused code
   - Dynamic imports where applicable

### Bottlenecks
1. **AI API Latency** - 1-5 seconds typical
2. **Cold Start** - Hugging Face serverless
3. **Network** - Depends on user connection

## Security Considerations

### API Keys
- Stored in environment variables (server-side only)
- Never exposed to client
- Next.js API routes act as proxy

### Input Validation
- Sanitize user input
- Limit text length
- Rate limiting on API routes

### CORS
- API routes only accessible from same domain
- Can add CORS headers if needed

## Testing Strategy (Future)

### Unit Tests
- `lib/aiService.ts` - Mock API responses
- `lib/editorMachine.ts` - Test state transitions
- `lib/prosemirrorSetup.ts` - Test helper functions

### Integration Tests
- API routes with mocked AI services
- Component integration with XState

### E2E Tests
- Complete user flows
- Error handling scenarios
- Different AI providers

## Scalability Considerations

### Horizontal Scaling
- Next.js app can scale via multiple instances
- Stateless design (no server-side sessions)
- API routes are serverless-ready

### Vertical Scaling
- AI API calls are rate-limited
- Can add Redis for caching
- Can implement request queuing

### Future Improvements
1. **Caching Layer** - Cache common completions
2. **WebSocket** - Real-time streaming responses
3. **Database** - Store user documents
4. **CDN** - Static asset distribution
5. **Load Balancing** - Multiple server instances

## Deployment Architecture

### Recommended Stack
```
┌─────────────────────┐
│   Vercel/Netlify    │  ← Next.js app hosting
└─────────────────────┘
          ↓
┌─────────────────────┐
│   Next.js App       │  ← API routes + frontend
└─────────────────────┘
          ↓
┌─────────────────────┐
│   OpenAI/HF API     │  ← External AI service
└─────────────────────┘
```

### Environment Setup
- **Development:** Local with `.env.local`
- **Staging:** Vercel preview deployments
- **Production:** Vercel production with environment variables

## Monitoring & Observability

### Metrics to Track (Future)
1. **Performance**
   - API response times
   - AI generation latency
   - Page load times

2. **Usage**
   - Requests per day
   - Text generation success rate
   - Error rates

3. **Business**
   - Active users
   - AI provider costs
   - Feature usage

### Tools
- **Vercel Analytics** - Built-in
- **Sentry** - Error tracking
- **LogRocket** - Session replay
- **Custom Dashboard** - API usage stats

## Conclusion

This architecture prioritizes:
- ✅ **Modularity** - Clear separation of concerns
- ✅ **Type Safety** - TypeScript throughout
- ✅ **Maintainability** - Well-documented and organized
- ✅ **Scalability** - Stateless, serverless-ready
- ✅ **Testability** - Pure functions, isolated modules
- ✅ **User Experience** - Fast, responsive, intuitive

The design allows for easy extension with new features while maintaining code quality and reliability.

