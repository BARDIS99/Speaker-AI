import { useState } from 'react';
import { Sparkles, ChevronDown, LogOut, User, Home, ArrowLeft } from 'lucide-react';

const PERSONAS = [
  { id: 'default', name: 'Default' },
  { id: 'tutor', name: 'Tutor' },
  { id: 'coding', name: 'Coding' },
  { id: 'business', name: 'Business' },
  { id: 'writing', name: 'Writing' },
];

const GoogleIcon = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.87c2.27-2.09 3.67-5.17 3.67-9.15z" />
    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.87-3.05c-1.08.72-2.45 1.16-4.06 1.16-3.13 0-5.78-2.11-6.73-4.96H1.27v3.15C3.25 21.3 7.33 24 12 24z" />
    <path fill="#FBBC05" d="M5.27 14.24A7.18 7.18 0 0 1 4.89 12c0-.78.14-1.54.38-2.24V6.61H1.27A11.96 11.96 0 0 0 0 12c0 1.92.45 3.74 1.27 5.39l4-3.15z" />
    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.25 2.7 1.27 6.61l4 3.15c.95-2.85 3.6-4.96 6.73-4.96z" />
  </svg>
);

const GithubIcon = () => (
  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

const XIcon = () => (
  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const DiscordIcon = () => (
  <svg className="w-3.5 h-3.5 fill-[#5865F2]" viewBox="0 0 24 24">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
  </svg>
);

export default function Header({
  models,
  provider,
  setProvider,
  persona,
  setPersona,
  bgTheme,
  setBgTheme,
  user,
  onSignIn,
  onSignOut,
  onNewChat,
  onOpenLanding,
  onGeminiTap,
}) {
  const [modelOpen, setModelOpen] = useState(false);
  const [personaOpen, setPersonaOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  const currentModel = models.find((m) => m.id === provider);

  return (
    <header className="h-14 glass border-b border-white/10 flex items-center justify-between px-4 shrink-0 z-20">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenLanding}
          className="flex items-center gap-2 text-left hover:opacity-85 transition"
          title="Back to Landing Page"
        >
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
            <Sparkles className="text-white w-4 h-4" />
          </div>
          <span className="font-bold text-base tracking-tight hidden sm:inline text-white">Speaker AI</span>
        </button>

        <button
          onClick={onOpenLanding}
          className="text-xs px-2.5 py-1 rounded-lg glass hover:bg-white/10 border border-white/10 transition flex items-center gap-1.5 text-gray-300"
          title="Return to Home"
        >
          <Home size={13} />
          <span className="hidden md:inline">Home</span>
        </button>

        <button
          onClick={onNewChat}
          className="text-xs px-2.5 py-1 rounded-lg bg-indigo-600/80 hover:bg-indigo-500 text-white font-medium transition"
        >
          New Chat
        </button>
      </div>

      <div className="flex items-center gap-2">
        {/* Google Gemini Quick-Tap Switcher */}
        <button
          onClick={() => {
            setProvider('gemini');
            onGeminiTap?.();
          }}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition ${
            provider === 'gemini'
              ? 'bg-indigo-600/30 border-indigo-500/50 text-indigo-300 shadow-sm'
              : 'glass border-white/10 text-gray-400 hover:text-white'
          }`}
          title="Select Google Gemini 2.5 Flash and populate text box"
        >
          <Sparkles size={13} className="text-indigo-400" />
          <span className="hidden sm:inline">Google Gemini</span>
        </button>

        {/* Model selector */}
        <div className="relative">
          <button
            onClick={() => setModelOpen(!modelOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg glass text-xs font-medium hover:bg-white/10 transition text-gray-200"
          >
            <span className="max-w-[90px] truncate">{currentModel?.name || 'Model'}</span>
            <ChevronDown size={13} />
          </button>
          {modelOpen && (
            <div className="absolute right-0 mt-1 w-52 glass-strong rounded-xl shadow-xl py-1 z-50 border border-white/10">
              {models.map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    setProvider(m.id);
                    setModelOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs hover:bg-white/10 flex justify-between items-center ${
                    provider === m.id ? 'text-indigo-400 font-semibold' : 'text-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    {m.id === 'gemini' && <Sparkles size={12} className="text-indigo-400" />}
                    <span>{m.name}</span>
                  </div>
                  {!m.available && <span className="text-[10px] text-red-400">No key</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Persona */}
        <div className="relative hidden md:block">
          <button
            onClick={() => setPersonaOpen(!personaOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg glass text-xs font-medium hover:bg-white/10 transition text-gray-200"
          >
            <span>{PERSONAS.find((p) => p.id === persona)?.name || 'Persona'}</span>
            <ChevronDown size={13} />
          </button>
          {personaOpen && (
            <div className="absolute right-0 mt-1 w-40 glass-strong rounded-xl shadow-xl py-1 z-50 border border-white/10">
              {PERSONAS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setPersona(p.id);
                    setPersonaOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs hover:bg-white/10 ${
                    persona === p.id ? 'text-indigo-400 font-semibold' : 'text-gray-200'
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Theme */}
        <select
          value={bgTheme}
          onChange={(e) => setBgTheme(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs focus:outline-none text-gray-300"
          title="Background 3D theme"
        >
          <option value="blue" className="bg-gray-900">Blue</option>
          <option value="green" className="bg-gray-900">Green</option>
          <option value="sunset" className="bg-gray-900">Sunset</option>
        </select>

        {/* User / Sign In */}
        {user ? (
          <div className="relative">
            <button onClick={() => setUserOpen(!userOpen)} className="flex items-center gap-2 pl-1">
              {user.user_metadata?.avatar_url ? (
                <img src={user.user_metadata.avatar_url} alt="" className="w-7 h-7 rounded-full border border-white/20" />
              ) : (
                <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                  <User size={14} />
                </div>
              )}
            </button>
            {userOpen && (
              <div className="absolute right-0 mt-1 w-48 glass-strong rounded-xl shadow-xl py-1 z-50 border border-white/10">
                <div className="px-3 py-2 text-xs border-b border-white/10 truncate text-gray-300">
                  {user.email || 'guest@speaker.ai'}
                </div>
                <button
                  onClick={() => {
                    onSignOut();
                    setUserOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-white/10 flex items-center gap-2 text-red-400"
                >
                  <LogOut size={13} /> Sign out
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <button
              onClick={() => onSignIn('google')}
              className="p-1.5 rounded-lg glass hover:bg-white/10 transition"
              title="Sign in with Google"
            >
              <GoogleIcon />
            </button>
            <button
              onClick={() => onSignIn('github')}
              className="p-1.5 rounded-lg glass hover:bg-white/10 transition text-white"
              title="Sign in with GitHub"
            >
              <GithubIcon />
            </button>
            <button
              onClick={() => onSignIn('x')}
              className="p-1.5 rounded-lg glass hover:bg-white/10 transition text-white"
              title="Sign in with X"
            >
              <XIcon />
            </button>
            <button
              onClick={() => onSignIn('discord')}
              className="p-1.5 rounded-lg glass hover:bg-white/10 transition"
              title="Sign in with Discord"
            >
              <DiscordIcon />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
