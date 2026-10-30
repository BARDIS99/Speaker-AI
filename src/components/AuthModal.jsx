import React from 'react';
import { X, Sparkles } from 'lucide-react';
import { ZentraSparkle } from './GeminiIcons';

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

export default function AuthModal({ isOpen, onClose, onSignIn, title = 'Sign in to Zentra' }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in select-none">
      <div className="bg-gemini-surface/95 border border-gemini-border rounded-3xl max-w-sm w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition"
          title="Close"
        >
          <X size={18} />
        </button>

        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gemini-elevated border border-gemini-border/70 flex items-center justify-center mx-auto shadow-sm">
            <ZentraSparkle className="w-7 h-7" id="auth_modal_sparkle" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">{title}</h2>
          <p className="text-xs text-gray-400">
            Sign in to sync your conversation history and models
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => {
              onSignIn('google');
              onClose();
            }}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-2xl bg-white hover:bg-gray-100 text-gray-900 font-medium text-sm transition shadow-sm hover:scale-[1.01] active:scale-[0.99]"
          >
            <GoogleIcon />
            <span>Continue with Google</span>
          </button>

          <button
            onClick={() => {
              onSignIn('discord');
              onClose();
            }}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-2xl bg-[#5865F2] hover:bg-[#4752C4] text-white font-medium text-sm transition shadow-sm hover:scale-[1.01] active:scale-[0.99]"
          >
            <DiscordIcon />
            <span>Continue with Discord</span>
          </button>
        </div>

        <div className="mt-5 pt-4 border-t border-gemini-border/50 text-center">
          <p className="text-[11px] text-gray-500">
            Secure session via Supabase OAuth
          </p>
        </div>
      </div>
    </div>
  );
}
