import { useState, useRef, useEffect } from 'react';
import { Send, Square, Mic, MicOff, Sparkles, Zap, ChevronRight } from 'lucide-react';

const GEMINI_QUICK_PRESETS = [
  'Explain quantum computing in 3 simple analogies',
  'Debug this React code and explain the performance fix',
  'Draft an executive summary for an AI engineering initiative',
  'Write a clean TypeScript interface and API client',
];

export default function Composer({
  onSend,
  onStop,
  isStreaming,
  disabled,
  provider,
  setProvider,
  prefilledText,
  onClearPrefilledText,
}) {
  const [text, setText] = useState('');
  const [listening, setListening] = useState(false);
  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);

  // Sync external prefilled text (e.g. from LandingPage or Gemini Tap)
  useEffect(() => {
    if (prefilledText) {
      setText(prefilledText);
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 160) + 'px';
        textareaRef.current.focus();
      }
      onClearPrefilledText?.();
    }
  }, [prefilledText, onClearPrefilledText]);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SpeechRecognition();
    rec.continuous = false;
    rec.interimResults = true;
    rec.onresult = (e) => {
      const transcript = Array.from(e.results).map((r) => r[0].transcript).join('');
      setText(transcript);
    };
    rec.onend = () => setListening(false);
    recognitionRef.current = rec;
  }, []);

  const toggleVoice = () => {
    if (!recognitionRef.current) {
      console.warn('Speech recognition is not available in this browser.');
      return;
    }
    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      recognitionRef.current.start();
      setListening(true);
    }
  };

  const submit = () => {
    if (!text.trim() || isStreaming || disabled) return;
    onSend(text.trim());
    setText('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const onInput = (e) => {
    setText(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 160) + 'px';
  };

  const handleGeminiTapPrompt = (prompt) => {
    if (setProvider && provider !== 'gemini') {
      setProvider('gemini');
    }
    setText(prompt);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 160) + 'px';
      textareaRef.current.focus();
    }
  };

  return (
    <div className="p-4 border-t border-white/10 shrink-0">
      <div className="max-w-3xl mx-auto space-y-2">
        {/* Google Gemini Tap & Default Quick Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
          <button
            onClick={() => {
              if (setProvider) setProvider('gemini');
              handleGeminiTapPrompt('Explain Google Gemini 2.5 Flash architecture and multimodal reasoning capabilities.');
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition whitespace-nowrap shrink-0 ${
              provider === 'gemini'
                ? 'bg-indigo-600/30 border-indigo-500/50 text-indigo-300 font-semibold'
                : 'glass border-white/10 text-gray-300 hover:bg-white/10'
            }`}
            title="Activate Google Gemini and load prompt"
          >
            <Sparkles size={13} className="text-indigo-400" />
            <span>Google Gemini Tap</span>
          </button>

          <span className="text-gray-600 font-mono text-[10px]">·</span>

          {GEMINI_QUICK_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleGeminiTapPrompt(preset)}
              className="px-2.5 py-1 rounded-lg glass border border-white/5 hover:border-indigo-500/30 text-gray-400 hover:text-white transition whitespace-nowrap shrink-0 text-xs truncate max-w-[200px]"
            >
              {preset}
            </button>
          ))}
        </div>

        {/* Composer Box */}
        <div className="glass rounded-2xl flex items-end gap-2 p-2 border border-white/10 focus-within:border-indigo-500/50 transition-colors">
          <button
            onClick={toggleVoice}
            className={`p-2.5 rounded-xl transition ${listening ? 'bg-red-500/30 text-red-400' : 'hover:bg-white/10 text-gray-400 hover:text-white'}`}
            title="Voice input"
          >
            {listening ? <MicOff size={18} /> : <Mic size={18} />}
          </button>
          <textarea
            ref={textareaRef}
            value={text}
            onChange={onInput}
            onKeyDown={onKeyDown}
            placeholder={
              disabled
                ? 'Sign in to chat with Speaker AI...'
                : provider === 'gemini'
                ? 'Message Google Gemini 2.5 Flash...'
                : 'Message Speaker AI...'
            }
            disabled={disabled || isStreaming}
            rows={1}
            className="flex-1 bg-transparent resize-none outline-none text-sm py-2.5 px-1 max-h-40 placeholder:text-gray-500 text-white"
          />
          {isStreaming ? (
            <button
              onClick={onStop}
              className="p-2.5 rounded-xl bg-red-500/80 hover:bg-red-500 transition text-white"
              title="Stop response"
            >
              <Square size={18} />
            </button>
          ) : (
            <button
              onClick={submit}
              disabled={!text.trim() || disabled}
              className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed transition text-white shadow-md shadow-indigo-600/30"
              title="Send message"
            >
              <Send size={18} />
            </button>
          )}
        </div>
        <p className="text-center text-xs text-gray-500">
          Enter to send · Shift+Enter for new line · Tap any Gemini preset above to load into text box
        </p>
      </div>
    </div>
  );
}
