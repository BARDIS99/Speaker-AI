import { X, ExternalLink, Key, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { ZentraSparkle } from './GeminiIcons';

export default function GeminiApiKeyModal({ isOpen, onClose, isKeyConfigured }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="bg-gemini-surface/95 border border-gemini-border rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative">
        {/* Header banner */}
        <div className="p-6 border-b border-gemini-border flex items-start justify-between bg-gradient-to-r from-sky-900/30 via-purple-900/20 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gemini-elevated border border-gemini-border flex items-center justify-center shrink-0 shadow-sm">
              <ZentraSparkle className="w-6 h-6" id="modal_zentra_sparkle" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                Zentra Free AI Engine Key
              </h2>
              <p className="text-xs text-gray-400">Powered by Google Gemini's official 100% free tier</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Key status badge */}
          <div className="p-3.5 rounded-2xl bg-gemini-elevated/80 border border-gemini-border flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Key size={18} className="text-sky-300" />
              <div>
                <div className="text-xs font-medium text-white">Zentra AI Engine Status</div>
                <div className="text-[11px] text-gray-400">
                  {isKeyConfigured ? 'GEMINI_API_KEY detected in environment' : 'Waiting for GEMINI_API_KEY'}
                </div>
              </div>
            </div>
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1.5 ${
              isKeyConfigured
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
            }`}>
              {isKeyConfigured ? <CheckCircle2 size={13} /> : <Zap size={13} />}
              {isKeyConfigured ? 'Connected' : 'Free Key Needed'}
            </span>
          </div>

          {/* What is the free key? */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Is Zentra's AI Engine Free?
            </h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              <strong className="text-white">Yes, 100% free!</strong> Zentra runs on Google's official Gemini API engine. Google provides a generous free tier for all developers via Google AI Studio with zero credit card required.
            </p>
          </div>

          {/* Generous Free Tier Limits */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-3 rounded-2xl bg-gemini-elevated/70 border border-gemini-border">
              <div className="text-base font-bold text-sky-400">15 RPM</div>
              <div className="text-[10px] text-gray-400">Requests per min</div>
            </div>
            <div className="p-3 rounded-2xl bg-gemini-elevated/70 border border-gemini-border">
              <div className="text-base font-bold text-purple-400">1M TPM</div>
              <div className="text-[10px] text-gray-400">Tokens per min</div>
            </div>
            <div className="p-3 rounded-2xl bg-gemini-elevated/70 border border-gemini-border">
              <div className="text-base font-bold text-emerald-400">1,500 RPD</div>
              <div className="text-[10px] text-gray-400">Free daily requests</div>
            </div>
          </div>

          {/* Step by step guide */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              How to Get Your Free Key in 3 Simple Steps:
            </h3>
            <ol className="space-y-2 text-xs text-gray-300">
              <li className="flex items-start gap-2.5 p-2.5 rounded-xl bg-gemini-elevated/60 border border-gemini-border/60">
                <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-300 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">1</span>
                <div>
                  <span className="text-white font-medium">Open Google AI Studio:</span> Visit{' '}
                  <span className="text-sky-300 font-mono underline">aistudio.google.com/apikey</span> and log in with your Google account.
                </div>
              </li>
              <li className="flex items-start gap-2.5 p-2.5 rounded-xl bg-gemini-elevated/60 border border-gemini-border/60">
                <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-300 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">2</span>
                <div>
                  <span className="text-white font-medium">Click "Create API Key":</span> Select a project or create a default free project, then copy your generated key string.
                </div>
              </li>
              <li className="flex items-start gap-2.5 p-2.5 rounded-xl bg-gemini-elevated/60 border border-gemini-border/60">
                <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-300 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">3</span>
                <div>
                  <span className="text-white font-medium">Configure in Environment:</span> Set <code className="text-sky-300 bg-white/5 px-1 py-0.5 rounded">GEMINI_API_KEY=&lt;your_key&gt;</code> in your project environment settings.
                </div>
              </li>
            </ol>
          </div>

          <div className="p-3.5 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-start gap-3 text-xs text-sky-200">
            <ShieldCheck size={18} className="shrink-0 mt-0.5 text-sky-400" />
            <div>
              <span>Recommended model: </span>
              <strong className="text-white font-mono">gemini-3.8-flash</strong> or <strong className="text-white font-mono">gemini-2.5-flash</strong> for lightning-fast multimodal reasoning in Zentra.
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="p-4 bg-gemini-elevated border-t border-gemini-border flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-full text-xs font-medium text-gray-300 hover:text-white hover:bg-white/10 transition"
          >
            Got it
          </button>
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-sky-500/30 transition"
          >
            <span>Get Free Key at Google AI Studio</span>
            <ExternalLink size={13} />
          </a>
        </div>
      </div>
    </div>
  );
}
