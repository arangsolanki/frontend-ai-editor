# Complete Setup Guide

This guide will walk you through setting up the AI Writing Assistant from scratch.

## Prerequisites

### Required Software
- **Node.js** 22.0.0 or higher ([Download](https://nodejs.org/))
- **npm** (comes with Node.js) or **yarn** or **pnpm**
- **Git** (optional, for cloning)

### Required Services
You need **one** of the following:
- **OpenAI Account** with API access (Recommended)
- **Hugging Face Account** with API token (Free tier available)

### System Requirements
- **OS:** macOS, Windows, or Linux
- **RAM:** 4GB minimum
- **Disk Space:** 500MB for dependencies

## Step-by-Step Installation

### 1. Verify Node.js Installation

Open a terminal and run:

```bash
node --version
npm --version
```

You should see version numbers. If not, install Node.js from [nodejs.org](https://nodejs.org/).

### 2. Get the Code

**Option A: Clone from Git (if repository exists)**
```bash
git clone <repository-url>
cd frontend-task-chq
```

**Option B: Download as ZIP**
- Download and extract the ZIP file
- Navigate to the folder in terminal

### 3. Install Dependencies

In the project directory, run:

```bash
npm install
```

This will install all required packages (~300MB). It may take 2-5 minutes.

**Expected output:**
```
added 250 packages, and audited 251 packages in 2m
```

### 4. Configure API Keys

You need to set up **one** AI provider.

#### Option 1: OpenAI (Recommended)

**4.1. Get OpenAI API Key**

1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign up or log in
3. Click your profile → "View API Keys"
4. Click "Create new secret key"
5. Copy the key (starts with `sk-`)

**4.2. Add Billing Information**

1. Go to Settings → Billing
2. Add payment method
3. Add credit ($5 recommended for testing)

**4.3. Create Environment File**

Create a file named `.env.local` in the project root:

```bash
# For macOS/Linux
touch .env.local

# For Windows (PowerShell)
New-Item .env.local
```

**4.4. Add Configuration**

Open `.env.local` and add:

```bash
AI_PROVIDER=openai
OPENAI_API_KEY=sk-your-actual-api-key-here
```

Replace `sk-your-actual-api-key-here` with your real API key.

#### Option 2: Hugging Face (Free Alternative)

**4.1. Get Hugging Face Token**

1. Go to [huggingface.co](https://huggingface.co)
2. Sign up or log in
3. Go to Settings → Access Tokens
4. Click "New token"
5. Give it a name, select "read" role
6. Copy the token (starts with `hf_`)

**4.2. Create Environment File**

Create `.env.local` in the project root (if not already created).

**4.3. Add Configuration**

Open `.env.local` and add:

```bash
AI_PROVIDER=huggingface
HUGGINGFACE_API_KEY=hf_your-actual-token-here
HUGGINGFACE_MODEL=mistralai/Mistral-7B-Instruct-v0.2
```

Replace `hf_your-actual-token-here` with your real token.

### 5. Verify Configuration

Your `.env.local` file should look like **ONE** of these:

**OpenAI Configuration:**
```bash
AI_PROVIDER=openai
OPENAI_API_KEY=sk-abc123xyz...
```

**Hugging Face Configuration:**
```bash
AI_PROVIDER=huggingface
HUGGINGFACE_API_KEY=hf_abc123xyz...
HUGGINGFACE_MODEL=mistralai/Mistral-7B-Instruct-v0.2
```

⚠️ **Important:** Never commit `.env.local` to Git! It contains sensitive keys.

### 6. Start Development Server

Run:

```bash
npm run dev
```

**Expected output:**
```
  ▲ Next.js 15.0.0
  - Local:        http://localhost:3000
  - ready started server on [::]:3000, url: http://localhost:3000
  - Compiling / ...
  - Compiled successfully
```

### 7. Open in Browser

1. Open your browser
2. Go to [http://localhost:3000](http://localhost:3000)
3. You should see the AI Writing Assistant!

## Verification Checklist

✅ **Dependencies installed** - No errors during `npm install`  
✅ **Environment file created** - `.env.local` exists  
✅ **API key configured** - Key added to `.env.local`  
✅ **Server running** - No errors when running `npm run dev`  
✅ **Page loads** - Browser shows the editor  
✅ **AI works** - "Continue Writing" generates text

## Testing the Application

### Basic Test

1. Type some text in the editor:
   ```
   The sun was setting over the mountains, casting a golden glow
   ```

2. Click "Continue Writing" button

3. Wait 2-5 seconds

4. AI-generated text should appear in the editor

### Expected Behavior

- ✅ Loading spinner appears during generation
- ✅ State shows "loading" → "success" → "idle"
- ✅ AI text is added to your text
- ✅ Character count updates
- ✅ You can continue editing

### If It Doesn't Work

See [Troubleshooting](#troubleshooting) section below.

## Troubleshooting

### Issue: "Module not found" errors

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: "OPENAI_API_KEY not configured"

**Problem:** API key not set or `.env.local` not created

**Solution:**
1. Check that `.env.local` exists in project root
2. Verify the file contains your API key
3. Restart the dev server: `Ctrl+C` then `npm run dev`

### Issue: "Failed to get AI response" or 401 error

**Problem:** Invalid or expired API key

**Solution:**
1. Verify your API key is correct
2. For OpenAI: Check that billing is set up
3. For Hugging Face: Verify token has "read" permissions
4. Generate a new key/token and update `.env.local`

### Issue: Page doesn't load (blank screen)

**Check browser console:**
- Press F12 or Cmd+Option+I
- Look for errors in Console tab

**Common fixes:**
1. Clear browser cache
2. Try a different browser
3. Check terminal for build errors

### Issue: Very slow AI generation (Hugging Face)

**Problem:** Cold start on serverless inference

**Solution:**
- First request is slow (10-30 seconds)
- Subsequent requests are faster (2-5 seconds)
- Consider using OpenAI for faster responses

### Issue: Port 3000 already in use

**Error:** `Port 3000 is already in use`

**Solution:**
```bash
# Option 1: Kill the process on port 3000
# macOS/Linux:
lsof -ti:3000 | xargs kill -9

# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Option 2: Use a different port
npm run dev -- -p 3001
```

### Issue: TypeScript errors

**Solution:**
```bash
# Type check
npm run type-check

# If errors persist, try:
rm -rf .next
npm run dev
```

### Issue: Build fails in production

**Solution:**
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
npm start
```

### Issue: Dark mode not working

**Solution:**
- Dark mode follows system preferences
- Change your OS theme to see dark mode
- Or inspect with browser DevTools and toggle

### Still Having Issues?

1. **Check Node version:** Must be 22.0.0+
2. **Check .env.local location:** Must be in project root (same folder as package.json)
3. **Restart everything:**
   ```bash
   # Stop server (Ctrl+C)
   rm -rf .next node_modules
   npm install
   npm run dev
   ```

## Advanced Configuration

### Using Different OpenAI Models

Edit `.env.local`:

```bash
# For GPT-4 (more expensive but better quality)
# Note: Need to modify lib/aiService.ts to use gpt-4 model
AI_PROVIDER=openai
OPENAI_API_KEY=sk-...
```

Then edit `lib/aiService.ts` line ~20:
```typescript
model: 'gpt-4', // Change from 'gpt-3.5-turbo'
```

### Using Different Hugging Face Models

Edit `.env.local`:

```bash
AI_PROVIDER=huggingface
HUGGINGFACE_API_KEY=hf_...
HUGGINGFACE_MODEL=google/flan-t5-xxl  # Or any other model
```

**Good alternative models:**
- `google/flan-t5-xxl` - Fast, good quality
- `meta-llama/Llama-2-7b-chat-hf` - Better quality, slower
- `bigscience/bloom-1b7` - Lightweight, fast

### Adjusting Generation Length

Edit `components/Editor/Editor.tsx` line ~55:

```typescript
body: JSON.stringify({
  text: currentText,
  maxTokens: 200, // Change from 150 (default)
}),
```

More tokens = longer generation = higher cost

### Running on Custom Port

```bash
npm run dev -- -p 8080
```

Then visit `http://localhost:8080`

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

Production build is optimized and faster.

## Development Workflow

### Making Changes

1. **Edit code** in your editor (VS Code recommended)
2. **Save file** - Changes auto-reload
3. **Check browser** - See updates immediately
4. **Check terminal** - Look for errors

### Hot Reload

- Changes to components auto-reload
- Changes to `.env.local` require restart
- Changes to API routes may require restart

### Debugging

**Browser DevTools:**
- F12 or Cmd+Option+I
- Console tab for logs
- Network tab for API calls
- React DevTools extension recommended

**VS Code Debugging:**
- Add breakpoints in code
- Use VS Code's built-in debugger
- See Next.js debugging docs

## Deployment

### Deploy to Vercel (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```

4. **Add environment variables:**
   - Go to Vercel dashboard
   - Project Settings → Environment Variables
   - Add `AI_PROVIDER`, `OPENAI_API_KEY`, etc.

5. **Redeploy:**
   ```bash
   vercel --prod
   ```

### Deploy to Netlify

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Build:**
   ```bash
   npm run build
   ```

3. **Deploy:**
   ```bash
   netlify deploy --prod
   ```

4. **Add environment variables in Netlify dashboard**

### Other Platforms

The app can deploy to:
- AWS Amplify
- Railway
- Render
- Self-hosted server

See Next.js deployment docs for details.

## Security Best Practices

### API Keys
- ✅ Never commit `.env.local` to Git
- ✅ Use environment variables in production
- ✅ Rotate keys regularly
- ✅ Use separate keys for dev/prod

### Rate Limiting
- Consider adding rate limiting middleware
- Implement per-user limits in production
- Monitor API usage

### Input Validation
- Already implemented in API routes
- Consider adding length limits
- Sanitize user input

## Maintenance

### Updating Dependencies

```bash
# Check for updates
npm outdated

# Update all packages
npm update

# Update specific package
npm install package-name@latest
```

### Monitoring Costs

**OpenAI:**
- Check usage: [platform.openai.com/usage](https://platform.openai.com/usage)
- Set monthly limits in dashboard

**Hugging Face:**
- Free tier has rate limits
- Check usage in account settings

## Next Steps

1. ✅ **Read the README** - Full project documentation
2. ✅ **Read ARCHITECTURE.md** - Understand the codebase
3. ✅ **Experiment** - Try different prompts and models
4. ✅ **Customize** - Modify UI and behavior
5. ✅ **Deploy** - Share your app with others

## Getting Help

### Documentation
- This guide (SETUP_GUIDE.md)
- README.md - Project overview
- ARCHITECTURE.md - Technical details
- RESEARCH.md - Technology research

### External Resources
- [Next.js Docs](https://nextjs.org/docs)
- [ProseMirror Guide](https://prosemirror.net/docs/)
- [XState Docs](https://stately.ai/docs/xstate)
- [OpenAI API Docs](https://platform.openai.com/docs)

### Common Questions

**Q: How much does it cost to run?**  
A: With OpenAI, ~$0.002 per request. $5 credit = ~2500 requests.

**Q: Can I use it offline?**  
A: No, it requires internet for AI API calls.

**Q: Can multiple users use it?**  
A: Yes, but all share your API key and costs.

**Q: Is my data private?**  
A: Check OpenAI/HF privacy policies. Data is sent to their APIs.

**Q: Can I self-host the AI model?**  
A: Yes, but it's complex. Requires GPU and significant setup.

---

**You're all set! Happy coding! 🚀**

