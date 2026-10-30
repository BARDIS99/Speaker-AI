# Speaker AI

Professional AI chat application with multi-provider support, Supabase auth, and Three.js background.

## Features

- Real streaming from Gemini, Groq, OpenRouter, Mistral
- Supabase Auth (Google, GitHub, Discord)
- Persistent chat history with RLS
- Personas, model selector, comparison fallback
- Voice input (Web Speech API), TTS, Markdown, code blocks
- Animated Three.js background with themes
- Glassmorphism dark UI, fully responsive

## Setup

### 1. Install

```bash
cd speaker-ai
npm install
```

### 2. Environment

Copy `.env.example` to `.env` and fill:

```
PORT=3000
GEMINI_API_KEY=your_key
GROQ_API_KEY=your_key
OPENROUTER_API_KEY=your_key
MISTRAL_API_KEY=your_key
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=your_anon_key
```

For frontend (create `.env` or use Vite vars):

```
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### 3. Supabase

1. Create project at supabase.com
2. Run `supabase/schema.sql` in SQL Editor
3. Auth → Providers: enable Google, GitHub, Discord
4. Set redirect URL: `http://localhost:5173` (dev) and your production URL
5. For each OAuth provider, add client ID/secret from their developer consoles

### 4. API Keys

- Gemini: https://aistudio.google.com/apikey
- Groq: https://console.groq.com
- OpenRouter: https://openrouter.ai/keys
- Mistral: https://console.mistral.ai

### 5. Run

Development (client + server):

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3000

Production:

```bash
npm run build
npm start
```

## Project Structure

```
speaker-ai/
├── src/           # React frontend
├── server/        # Express backend
├── supabase/      # SQL schema
├── public/
├── .env.example
└── README.md
```

## Notes

- All AI calls stay on the backend. Keys never reach the browser.
- Auth required for chat. Without Supabase config, UI loads but chat is disabled.
- Fallback: if primary provider fails, automatically tries another available one and notifies user.
- Voice features require browser support (Chrome/Edge best).
