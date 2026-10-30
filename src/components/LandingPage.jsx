import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Zap,
  Cpu,
  ChevronRight,
} from 'lucide-react';
import Background3D from './Background3D';
import { ZentraSparkle } from './GeminiIcons';

// Brand icons as clean inline SVGs
const GoogleIcon = () => (
  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.87c2.27-2.09 3.67-5.17 3.67-9.15z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.87-3.05c-1.08.72-2.45 1.16-4.06 1.16-3.13 0-5.78-2.11-6.73-4.96H1.27v3.15C3.25 21.3 7.33 24 12 24z"
    />
    <path
      fill="#FBBC05"
      d="M5.27 14.24A7.18 7.18 0 0 1 4.89 12c0-.78.14-1.54.38-2.24V6.61H1.27A11.96 11.96 0 0 0 0 12c0 1.92.45 3.74 1.27 5.39l4-3.15z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.25 2.7 1.27 6.61l4 3.15c.95-2.85 3.6-4.96 6.73-4.96z"
    />
  </svg>
);

const DiscordIcon = () => (
  <svg className="w-4 h-4 shrink-0 fill-[#5865F2]" viewBox="0 0 24 24">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
  </svg>
);

const GEMINI_FEATURED_PROMPTS = [
  {
    title: 'Multimodal Deep Dive',
    prompt: 'Explain how Google Gemini achieves ultra-low latency multimodal reasoning with token streaming.',
    category: 'Architecture',
  },
  {
    title: 'Production Code Fix',
    prompt: 'Help me debug a React 18 useEffect dependency loop with AbortController for clean streaming chat cancellation.',
    category: 'Engineering',
  },
  {
    title: 'GTM Strategy Briefing',
    prompt: 'Draft a 90-day go-to-market plan for an AI audio and reasoning workspace targeting fast-scaling engineering teams.',
    category: 'Strategy',
  },
  {
    title: 'Executive Speech Drafting',
    prompt: 'Write a powerful 3-minute keynote opening on human-in-the-loop AI for technical leaders.',
    category: 'Writing',
  },
];

export default function LandingPage({ onLaunchChat, onSignIn, user }) {
  const [activePrompt, setActivePrompt] = useState(GEMINI_FEATURED_PROMPTS[0].prompt);

  const handleLaunchWithPrompt = (promptText) => {
    onLaunchChat({
      provider: 'gemini',
      prompt: promptText,
    });
  };

  return (
    <div className="min-h-screen bg-gemini-dark text-gray-100 flex flex-col font-sans selection:bg-indigo-500/30 relative overflow-x-hidden">
      {/* 4. Shared Interactive 3D Animated Background (Three.js) identical to chat page */}
      <Background3D isStreaming={false} />

      {/* 1. Top Bar */}
      <header className="h-16 border-b border-white/10 glass-strong sticky top-0 z-40 px-6 lg:px-12 flex items-center justify-between gap-8">
        <div className="flex items-center gap-2.5 whitespace-nowrap shrink-0">
          <ZentraSparkle className="w-6 h-6" id="landing_brand_sparkle" />
          <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-sky-400 via-indigo-300 to-fuchsia-400 bg-clip-text text-transparent">
            Zentra
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
          <a href="#capabilities" className="hover:text-white transition-colors">Capabilities</a>
          <a href="#gemini-tap" className="hover:text-sky-300 transition-colors flex items-center gap-1.5">
            <Sparkles size={14} className="text-sky-400" /> Prompts
          </a>
          <a href="#personas" className="hover:text-white transition-colors">Personas</a>
          <a href="#signup" className="hover:text-white transition-colors">Sign in</a>
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onLaunchChat({ provider: 'gemini' })}
            className="px-4 py-2 text-xs sm:text-sm font-medium text-white bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 rounded-full transition-all shadow-md shadow-sky-500/20 flex items-center gap-2"
          >
            <span>Launch Studio</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative z-10 pt-12 pb-20 px-6 lg:px-12 max-w-7xl mx-auto w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Proposition & Auth */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-xs font-medium text-sky-300">
              <Sparkles size={14} className="text-sky-400 animate-pulse" />
              <span>Multi-Provider Intelligence Platform</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white text-balance leading-[1.12]">
              Intelligence that speaks with <span className="bg-gradient-to-r from-sky-400 via-indigo-300 to-fuchsia-400 bg-clip-text text-transparent">precision</span>.
            </h1>

            <p className="text-base sm:text-lg text-gray-300 max-w-2xl leading-relaxed">
              Real-time conversational intelligence with low-latency streaming, live key verification, multi-persona voice reasoning, and 3D ambient particle visualization.
            </p>

            {/* 5. Prominent Sign In with Google and Discord ONLY (GitHub & X removed) */}
            <div className="pt-2 pb-2">
              <div className="text-xs uppercase tracking-wider font-semibold text-gray-400 mb-3">
                Sign in with your account
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md">
                <button
                  onClick={() => onSignIn('google')}
                  className="flex items-center justify-center gap-2.5 px-4 py-3 rounded-2xl bg-white hover:bg-gray-100 text-gray-900 text-sm font-semibold transition-all hover:scale-[1.01] active:scale-[0.99] shadow-md shadow-white/5"
                  title="Continue with Google"
                >
                  <GoogleIcon />
                  <span>Continue with Google</span>
                </button>
                <button
                  onClick={() => onSignIn('discord')}
                  className="flex items-center justify-center gap-2.5 px-4 py-3 rounded-2xl bg-[#5865F2] hover:bg-[#4752C4] text-white text-sm font-semibold transition-all hover:scale-[1.01] active:scale-[0.99] shadow-md shadow-[#5865F2]/25"
                  title="Continue with Discord"
                >
                  <DiscordIcon />
                  <span>Continue with Discord</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs text-gray-400 pt-1">
              <span>Google & Discord OAuth</span>
              <span aria-hidden="true">·</span>
              <span>Live Provider Status Check</span>
              <span aria-hidden="true">·</span>
              <span>Persistent Chat History</span>
            </div>
          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border border-gemini-border shadow-2xl bg-gemini-surface/80 backdrop-blur-xl">
              <img
                src="/src/assets/images/hero_ai_workspace_1793354640825.jpg"
                alt="Zentra Studio Workspace"
                className="w-full h-auto object-cover aspect-[16/9] lg:aspect-[4/3]"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gemini-dark via-gemini-dark/40 to-transparent" />
              
              {/* Overlay card */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-gemini-surface/90 backdrop-blur-xl border border-gemini-border">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                    <span className="text-xs font-semibold text-white">Zentra 3.8 Flash</span>
                  </div>
                  <span className="text-[11px] text-sky-300 font-mono">Stream Active</span>
                </div>
                <p className="text-xs text-gray-300 line-clamp-2">
                  "Multimodal reasoning ready. Streaming live token answers across code, science, and creative strategy."
                </p>
                <div className="mt-3 flex items-center justify-between pt-2 border-t border-gemini-border/60">
                  <span className="text-[11px] text-gray-400">Default Model</span>
                  <button
                    onClick={() => handleLaunchWithPrompt(activePrompt)}
                    className="text-xs text-sky-400 hover:text-sky-300 font-medium flex items-center gap-1"
                  >
                    Open Studio <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Featured Prompts */}
        <div id="gemini-tap" className="mt-20 pt-10 border-t border-white/10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-400 uppercase tracking-wider mb-2">
                <Sparkles size={14} />
                <span>Quick Prompts</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                Tap Prompts & Load Instantly
              </h2>
              <p className="text-sm text-gray-400 max-w-2xl mt-1">
                Select any curated prompt below. Tapping it automatically opens the studio text box and focuses the prompt for immediate streaming.
              </p>
            </div>
            <button
              onClick={() => handleLaunchWithPrompt('Hello Zentra! Introduce your capabilities.')}
              className="px-4 py-2 rounded-full bg-gradient-to-r from-sky-500 to-indigo-600 hover:opacity-95 text-white text-xs sm:text-sm font-medium transition-all flex items-center gap-2 shrink-0 self-start md:self-auto shadow-md shadow-sky-500/20"
            >
              <span>Tap to Launch Zentra</span>
              <Sparkles size={14} />
            </button>
          </div>

          {/* Interactive Tap Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {GEMINI_FEATURED_PROMPTS.map((item, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setActivePrompt(item.prompt);
                  handleLaunchWithPrompt(item.prompt);
                }}
                className="group p-5 rounded-2xl bg-gemini-surface/80 hover:bg-gemini-elevated/90 backdrop-blur-md border border-gemini-border/70 hover:border-sky-500/40 transition-all cursor-pointer flex flex-col justify-between hover:-translate-y-1 shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-2.5">
                    <span className="text-sky-400 font-medium">{item.category}</span>
                    <span className="text-[11px] font-mono opacity-60">Tap to load</span>
                  </div>
                  <h3 className="text-sm font-semibold text-white group-hover:text-sky-300 transition-colors mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-300 line-clamp-3 leading-relaxed">
                    "{item.prompt}"
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-medium text-sky-400 group-hover:text-sky-300">
                  <span className="flex items-center gap-1.5">
                    <Zap size={13} />
                    <span>Default to text box</span>
                  </span>
                  <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Capabilities Bento Grid */}
        <div id="capabilities" className="mt-24 pt-10 border-t border-white/10">
          <div className="mb-10 text-center max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Engineered for Real-Time Dialogue
            </h2>
            <p className="text-sm text-gray-400">
              High-fidelity visual aesthetics combined with server-authoritative streaming AI.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 rounded-3xl bg-gemini-surface/85 backdrop-blur-xl border border-gemini-border p-6 sm:p-8 flex flex-col justify-between overflow-hidden relative shadow-xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center z-10">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-sky-500/10 border border-sky-500/20 text-xs font-medium text-sky-300">
                    <Cpu size={14} /> High-Speed Neural Core
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">
                    Zentra 3.8 Flash Native Speed
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                    Direct server-side integration utilizing the official Google GenAI SDK. Streams token responses with zero client exposure of secret credentials.
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={() => handleLaunchWithPrompt('Compare quantum computing versus classical computing architectures.')}
                      className="px-4 py-2 rounded-full bg-gradient-to-r from-sky-500 to-indigo-600 hover:opacity-95 text-white text-xs font-medium transition-all inline-flex items-center gap-2 shadow-md shadow-sky-500/25"
                    >
                      <span>Try Zentra Stream</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
                <div className="rounded-2xl overflow-hidden border border-gemini-border/70">
                  <img
                    src="/src/assets/images/bento_gemini_speed_1793354640568.jpg"
                    alt="Neural Processor Speed"
                    className="w-full h-auto object-cover aspect-[4/3]"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </div>

            <div id="personas" className="rounded-3xl bg-gemini-surface/85 backdrop-blur-xl border border-gemini-border p-6 flex flex-col justify-between shadow-xl">
              <div>
                <div className="rounded-2xl overflow-hidden border border-gemini-border/70 mb-4">
                  <img
                    src="/src/assets/images/bento_persona_waves_1793354640434.jpg"
                    alt="Persona Audio Waves"
                    className="w-full h-auto object-cover aspect-[4/3]"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  5 Tailored Personas
                </h3>
                <p className="text-xs text-gray-300 leading-relaxed mb-4">
                  Switch between Tutor, Coding Helper, Business Advisor, Writing Coach, and Default Assistant with custom prompts.
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-2">
                {['Tutor', 'Coding', 'Business', 'Writing'].map((p) => (
                  <span key={p} className="text-xs px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-gray-300">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 5. Complete Sign-In Section: Google & Discord ONLY */}
        <div id="signup" className="mt-24 rounded-3xl bg-gemini-surface/90 backdrop-blur-2xl border border-sky-500/30 p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Get Started with Zentra
            </h2>
            <p className="text-sm sm:text-base text-gray-300">
              Sign in with your Google or Discord account to begin chatting, check provider key health, and save conversations.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto pt-2">
              <button
                onClick={() => onSignIn('google')}
                className="flex items-center justify-center gap-2.5 px-4 py-3 rounded-2xl bg-white hover:bg-gray-100 text-gray-900 text-sm font-semibold transition-all hover:scale-[1.01] shadow-md shadow-white/5"
              >
                <GoogleIcon />
                <span>Continue with Google</span>
              </button>
              <button
                onClick={() => onSignIn('discord')}
                className="flex items-center justify-center gap-2.5 px-4 py-3 rounded-2xl bg-[#5865F2] hover:bg-[#4752C4] text-white text-sm font-semibold transition-all hover:scale-[1.01] shadow-md shadow-[#5865F2]/25"
              >
                <DiscordIcon />
                <span>Continue with Discord</span>
              </button>
            </div>

            <div className="pt-4">
              <button
                onClick={() => onLaunchChat({ provider: 'gemini' })}
                className="inline-flex items-center gap-2 text-xs text-sky-300 hover:text-white underline underline-offset-4 transition"
              >
                Continue directly as guest in Zentra Studio
                <ArrowRight size={12} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Footer */}
      <footer className="border-t border-white/10 glass-strong py-8 px-6 lg:px-12 mt-auto relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-200">Zentra</span>
            <span>· AI Reasoning Workspace</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#capabilities" className="hover:text-gray-300 transition">Capabilities</a>
            <a href="#gemini-tap" className="hover:text-gray-300 transition">Prompts</a>
            <a href="#personas" className="hover:text-gray-300 transition">Personas</a>
            <button onClick={() => onLaunchChat({ provider: 'gemini' })} className="text-sky-400 hover:text-sky-300 font-medium">
              Open Studio
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
