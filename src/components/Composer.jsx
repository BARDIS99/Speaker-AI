import { useState, useRef, useEffect } from 'react';
import { ArrowUp, Square, Mic, MicOff, Plus } from 'lucide-react';

const QUICK_SUGGESTIONS = [
  'Help me draft a concise product update with Zentra',
  'Debug and optimize this JavaScript snippet',
  'Explain quantum entanglement using simple analogies',
  'Brainstorm 5 innovative ideas for AI applications',
];

export default function Composer({
  onSend,
  onStop,
  isStreaming,
  disabled,
  prefilledText,
  onClearPrefilledText,
  onOpenApiKeyGuide,
}) {
  const [text, setText] = useState('');
  const [listening, setListening] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);

  // Sync external prefilled text
  useEffect(() => {
    if (prefilledText) {
      setText(prefilledText);
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 180) + 'px';
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
    e.target.style.height = Math.min(e.target.scrollHeight, 180) + 'px';
  };

  const hasText = text.trim().length > 0;

  return (
    <div className="w-full pb-4 px-4 bg-gradient-to-t from-gemini-dark via-gemini-dark/95 to-transparent pt-2 shrink-0 z-20">
      <div className="max-w-3xl mx-auto space-y-2">
        {/* Zentra Floating Prompt Capsule */}
        <div className="relative">
          {/* Quick Tools popup when clicking + */}
          {toolsOpen && (
            <div className="absolute bottom-full left-4 mb-3 bg-gemini-surface/95 backdrop-blur-xl border border-gemini-border rounded-2xl p-2 shadow-2xl z-40 animate-fade-in w-64">
              <div className="text-[11px] font-semibold text-gray-400 px-2 py-1 uppercase tracking-wider">
                Zentra Prompts & Templates
              </div>
              <div className="space-y-1 mt-1">
                {QUICK_SUGGESTIONS.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setText(s);
                      setToolsOpen(false);
                      textareaRef.current?.focus();
                    }}
                    className="w-full text-left p-2 rounded-xl text-xs text-gray-300 hover:text-white hover:bg-gemini-elevated transition line-clamp-1"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Prompt Capsule Container */}
          <div className="bg-gemini-surface/90 backdrop-blur-xl border border-gemini-border focus-within:border-sky-500/60 rounded-[32px] p-2 sm:p-2.5 flex items-end gap-2 shadow-xl shadow-black/40 transition duration-200">
            {/* + Add tools button */}
            <button
              onClick={() => setToolsOpen(!toolsOpen)}
              className="w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-gemini-elevated transition shrink-0"
              title="Add tools & templates"
            >
              <Plus size={19} />
            </button>

            {/* Input textarea */}
            <textarea
              ref={textareaRef}
              value={text}
              onChange={onInput}
              onKeyDown={onKeyDown}
              placeholder={disabled ? 'Sign in to chat with Zentra...' : 'Ask Zentra'}
              disabled={disabled || isStreaming}
              rows={1}
              className="flex-1 bg-transparent resize-none outline-none text-sm sm:text-base py-1.5 px-2 max-h-44 placeholder:text-gray-500 text-white leading-relaxed"
            />

            {/* Microphone dictation button */}
            <button
              onClick={toggleVoice}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition shrink-0 ${
                listening
                  ? 'bg-red-500/20 text-red-400 animate-pulse'
                  : 'text-gray-400 hover:text-white hover:bg-gemini-elevated'
              }`}
              title="Use microphone"
            >
              {listening ? <MicOff size={18} /> : <Mic size={18} />}
            </button>

            {/* Send or Stop button */}
            {isStreaming ? (
              <button
                onClick={onStop}
                className="w-9 h-9 rounded-full bg-gemini-elevated hover:bg-[#333537] text-white flex items-center justify-center transition shrink-0"
                title="Stop generation"
              >
                <Square size={14} className="fill-current text-white" />
              </button>
            ) : (
              <button
                onClick={submit}
                disabled={!hasText || disabled}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition shrink-0 ${
                  hasText && !disabled
                    ? 'bg-gradient-to-r from-sky-400 to-indigo-500 text-white shadow-md shadow-sky-500/30'
                    : 'text-gray-600 cursor-not-allowed opacity-40'
                }`}
                title="Send prompt to Zentra"
              >
                <ArrowUp size={18} strokeWidth={2.5} />
              </button>
            )}
          </div>
        </div>

        {/* Zentra Disclaimer Footer */}
        <div className="flex items-center justify-center gap-1.5 text-center text-[11px] text-gray-400">
          <span>Zentra may display inaccurate info, including about people, so double-check its responses.</span>
          <button
            onClick={onOpenApiKeyGuide}
            className="text-sky-300 hover:underline font-medium"
          >
            Free AI Engine key
          </button>
        </div>
      </div>
    </div>
  );
}
