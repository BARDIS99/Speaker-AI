import { useState } from 'react';
import { Menu, ChevronDown, LogOut } from 'lucide-react';
import { ZentraSparkle, GoogleGIcon } from './GeminiIcons';

const ZENTRA_MODELS = [
  {
    id: 'gemini',
    name: 'Zentra 3.8 Flash',
    badge: 'Fastest & Multimodal',
    description: 'Ultra-low latency intelligence with visual reasoning',
    isFree: true,
  },
  {
    id: 'gemini-advanced',
    name: 'Zentra 4 Argon',
    badge: 'Deep Reasoning',
    description: 'Complex math, coding, and multi-step logic',
    isFree: true,
  },
  {
    id: 'gemini-lite',
    name: 'Zentra 3.1 Flash Lite',
    badge: 'Lightweight',
    description: 'Instant response generation for quick queries',
    isFree: true,
  },
];

export default function Header({
  sidebarOpen,
  onToggleSidebar,
  provider,
  setProvider,
  user,
  onSignIn,
  onSignOut,
  onNewChat,
  onOpenApiKeyGuide,
  isKeyConfigured,
}) {
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const selectedModel = ZENTRA_MODELS.find((m) => m.id === provider) || ZENTRA_MODELS[0];

  return (
    <header className="h-16 px-4 bg-gemini-dark/80 backdrop-blur-md border-b border-gemini-border/40 flex items-center justify-between shrink-0 z-30 select-none relative">
      {/* Left: Hamburger menu + Zentra Brand + Model Pill */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-full hover:bg-gemini-surface text-gray-300 hover:text-white transition"
          title="Toggle navigation"
        >
          <Menu size={20} />
        </button>

        {/* Zentra Brand with Gradient Sparkle */}
        <div className="flex items-center gap-2 mr-1 cursor-pointer" onClick={onNewChat}>
          <ZentraSparkle className="w-6 h-6" id="zentra_header_logo" />
          <span className="text-xl font-semibold tracking-tight bg-gradient-to-r from-sky-400 via-indigo-300 to-fuchsia-400 bg-clip-text text-transparent">
            Zentra
          </span>
        </div>

        {/* Zentra Model Selector Pill */}
        <div className="relative">
          <button
            onClick={() => setModelDropdownOpen(!modelDropdownOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gemini-surface/90 hover:bg-gemini-elevated border border-gemini-border text-xs font-medium text-gray-200 transition"
          >
            <span className="text-sky-300 font-medium">{selectedModel.name}</span>
            <ChevronDown size={14} className="text-gray-400" />
          </button>

          {modelDropdownOpen && (
            <div className="absolute left-0 mt-2 w-72 bg-gemini-surface border border-gemini-border rounded-2xl shadow-2xl py-2 z-50 animate-fade-in">
              <div className="px-3.5 py-1.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                Zentra Intelligence Models
              </div>
              {ZENTRA_MODELS.map((m) => {
                const isSelected = (provider === m.id) || (provider === 'gemini' && m.id === 'gemini');
                return (
                  <button
                    key={m.id}
                    onClick={() => {
                      setProvider('gemini');
                      setModelDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2.5 hover:bg-gemini-elevated transition flex items-start justify-between ${
                      isSelected ? 'bg-gemini-elevated/70 text-white' : 'text-gray-300'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-semibold flex items-center gap-1.5 text-white">
                        <span>{m.name}</span>
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />}
                      </div>
                      <div className="text-[11px] text-gray-400 mt-0.5">{m.description}</div>
                    </div>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 font-mono shrink-0">
                      Free Engine
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Right: Free API Key Guide Pill + Google Account */}
      <div className="flex items-center gap-2.5">
        {/* Free API Key Guide Button */}
        <button
          onClick={onOpenApiKeyGuide}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-sky-500/10 via-purple-500/10 to-transparent hover:from-sky-500/20 hover:to-purple-500/20 border border-sky-500/30 text-xs font-medium text-sky-200 transition"
          title="Free AI Key Guide"
        >
          <ZentraSparkle className="w-3.5 h-3.5" id="header_sparkle_pill" />
          <span className="hidden sm:inline">Free API Key Guide</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </button>

        {/* User Account */}
        {user ? (
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="w-8 h-8 rounded-full border border-gemini-border overflow-hidden focus:ring-2 focus:ring-sky-400 transition"
            >
              {user.user_metadata?.avatar_url ? (
                <img src={user.user_metadata.avatar_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                  {(user.email?.[0] || 'Z').toUpperCase()}
                </div>
              )}
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-gemini-surface border border-gemini-border rounded-2xl shadow-2xl py-2 z-50 animate-fade-in">
                <div className="px-4 py-3 border-b border-gemini-border">
                  <div className="text-xs font-semibold text-white truncate">
                    {user.user_metadata?.name || 'Zentra Member'}
                  </div>
                  <div className="text-[11px] text-gray-400 truncate">{user.email || 'Free Tier User'}</div>
                </div>

                <button
                  onClick={() => {
                    onOpenApiKeyGuide();
                    setUserMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-xs text-gray-300 hover:bg-gemini-elevated hover:text-white flex items-center gap-2"
                >
                  <ZentraSparkle className="w-4 h-4" id="user_sparkle_btn" />
                  <span>Free API Key Setup</span>
                </button>

                <button
                  onClick={() => {
                    onSignOut();
                    setUserMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-xs text-red-400 hover:bg-gemini-elevated flex items-center gap-2 border-t border-gemini-border/60"
                >
                  <LogOut size={14} />
                  <span>Sign out</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => onSignIn('google')}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white hover:bg-gray-100 text-gray-900 text-xs font-medium transition shadow-sm"
          >
            <GoogleGIcon className="w-3.5 h-3.5" />
            <span>Sign in</span>
          </button>
        )}
      </div>
    </header>
  );
}
