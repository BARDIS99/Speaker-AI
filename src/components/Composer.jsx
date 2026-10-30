import { useState, useRef, useEffect } from 'react';
import { ArrowUp, Square, Mic, MicOff, Plus, ChevronDown, RefreshCw } from 'lucide-react';

const QUICK_SUGGESTIONS = [
  'Help me draft a concise product update with Zentra',
  'Debug and optimize this JavaScript snippet',
  'Explain quantum entanglement using simple analogies',
  'Brainstorm 5 innovative ideas for AI applications',
];

const AI_MODELS = [
  { id: 'gemini', name: 'Zentra (Gemini 3.8)', shortName: 'Zentra' },
  { id: 'groq', name: 'Groq (Llama 3.3)', shortName: 'Groq' },
  { id: 'openrouter', name: 'OpenRouter (Llama 3.2)', shortName: 'OpenRouter' },
  { id: 'mistral', name: 'Mistral (Small)', shortName: 'Mistral' },
];

function getDotClass(status) {
  if (status === 'active') return 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]';
  if (status === 'inactive') return 'bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.8)]';
  return 'bg-gray-500';
}

function getStatusBadge(status) {
  if (status === 'active') {
    return <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300 font-mono">Active</span>;
  }
  if (status === 'inactive') {
    return <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-300 font-mono">Inactive</span>;
  }
  return <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-700/50 text-gray-400 font-mono">Missing</span>;
}

export default function Composer({
  onSend,
  onStop,
  isStreaming,
  disabled,
  prefilledText,
  onClearPrefilledText,
  provider = 'gemini',
  setProvider,
  keyStatuses = {},
  onRefreshKeys,
}) {
  const [text, setText] = useState('');
  const [listening, setListening] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [modelPickerOpen, setModelPickerOpen] = useState(false);
  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);
  const modelPickerRef = useRef(null);

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

  // Click outside to close model picker dropdown
  useEffect(() => {
    function handleClickOutside(e) {
      if (modelPickerRef.current && !modelPickerRef.current.contains(e.target)) {
        setModelPickerOpen(false);
      }
    }
    if (modelPickerOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [modelPickerOpen]);

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

  const toggleModelPicker = () => {
    const nextState = !modelPickerOpen;
    setModelPickerOpen(nextState);
    if (nextState) {
      onRefreshKeys?.();
    }
  };

  const hasText = text.trim().length > 0;
  const currentModel = AI_MODELS.find((m) => m.id === provider) || AI_MODELS[0];
  const currentStatus = keyStatuses[currentModel.id] || 'missing';

  return (
    <div className="w-full pb-4 px-3 sm:px-4 bg-gradient-to-t from-gemini-dark via-gemini-dark/95 to-transparent pt-2 shrink-0 z-20">
      <div className="max-w-3xl mx-auto">
        {/* Floating Prompt Capsule */}
        <div className="relative">
          {/* Quick Tools popup when clicking + */}
          {toolsOpen && (
            <div className="absolute bottom-full left-2 sm:left-4 mb-3 bg-gemini-surface/95 backdrop-blur-xl border border-gemini-border rounded-2xl p-2 shadow-2xl z-40 animate-fade-in w-64">
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
          <div className="bg-gemini-surface/90 backdrop-blur-xl border border-gemini-border focus-within:border-sky-500/60 rounded-[32px] p-1.5 sm:p-2 flex items-center gap-1 sm:gap-1.5 shadow-xl shadow-black/40 transition duration-200">
            {/* + Add tools button */}
            <button
              onClick={() => setToolsOpen(!toolsOpen)}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-gemini-elevated transition shrink-0"
              title="Add tools & templates"
            >
              <Plus size={18} />
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
              className="flex-1 min-w-0 bg-transparent resize-none outline-none text-xs sm:text-sm py-1.5 px-1 sm:px-2 max-h-40 placeholder:text-gray-500 text-white leading-relaxed"
            />

            {/* Microphone dictation button */}
            <button
              onClick={toggleVoice}
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition shrink-0 ${
                listening
                  ? 'bg-red-500/20 text-red-400 animate-pulse'
                  : 'text-gray-400 hover:text-white hover:bg-gemini-elevated'
              }`}
              title="Use microphone"
            >
              {listening ? <MicOff size={16} /> : <Mic size={16} />}
            </button>

            {/* 2. Compact Model Picker inside the input bar, to the left of the send button */}
            <div className="relative shrink-0" ref={modelPickerRef}>
              <button
                type="button"
                onClick={toggleModelPicker}
                className="h-8 sm:h-9 px-2 sm:px-2.5 rounded-full bg-gemini-elevated/90 hover:bg-gemini-elevated border border-gemini-border/70 text-xs text-gray-200 flex items-center gap-1.5 transition whitespace-nowrap shrink-0 hover:border-sky-500/40"
                title={`Current model: ${currentModel.name} (${currentStatus})`}
              >
                <span className={`w-2 h-2 rounded-full shrink-0 ${getDotClass(currentStatus)}`} />
                <span className="font-medium text-[11px] sm:text-xs max-w-[60px] sm:max-w-[80px] truncate">
                  {currentModel.shortName}
                </span>
                <ChevronDown size={12} className={`text-gray-400 transition-transform ${modelPickerOpen ? 'rotate-180' : ''}`} />
              </button>

              {modelPickerOpen && (
                <div className="absolute bottom-full right-0 mb-3 w-64 sm:w-72 bg-gemini-surface/98 backdrop-blur-2xl border border-gemini-border rounded-2xl shadow-2xl p-1.5 z-50 animate-fade-in select-none">
                  <div className="px-2.5 py-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider flex items-center justify-between border-b border-gemini-border/40 mb-1">
                    <span>Intelligence Model</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRefreshKeys?.();
                      }}
                      className="text-sky-400 hover:text-sky-300 normal-case flex items-center gap-1 font-normal text-[10px] transition"
                      title="Check key status"
                    >
                      <RefreshCw size={10} />
                      <span>Re-check</span>
                    </button>
                  </div>
                  <div className="space-y-1">
                    {AI_MODELS.map((m) => {
                      const status = keyStatuses[m.id] || 'missing';
                      const isActive = status === 'active';
                      const isSelected = provider === m.id;
                      return (
                        <button
                          key={m.id}
                          disabled={!isActive}
                          onClick={() => {
                            setProvider(m.id);
                            setModelPickerOpen(false);
                          }}
                          className={`w-full text-left px-2.5 py-2 rounded-xl text-xs transition flex items-center justify-between ${
                            isSelected
                              ? 'bg-sky-500/15 border border-sky-500/40 text-white font-medium'
                              : isActive
                              ? 'hover:bg-gemini-elevated text-gray-200'
                              : 'opacity-40 cursor-not-allowed text-gray-500 bg-black/10'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className={`w-2 h-2 rounded-full shrink-0 ${getDotClass(status)}`} />
                            <div className="truncate">
                              <div className="text-xs font-medium truncate">{m.name}</div>
                            </div>
                          </div>
                          <div className="shrink-0 ml-2">
                            {getStatusBadge(status)}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Send or Stop button */}
            {isStreaming ? (
              <button
                onClick={onStop}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gemini-elevated hover:bg-[#333537] text-white flex items-center justify-center transition shrink-0"
                title="Stop generation"
              >
                <Square size={13} className="fill-current text-white" />
              </button>
            ) : (
              <button
                onClick={submit}
                disabled={!hasText || disabled}
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition shrink-0 ${
                  hasText && !disabled
                    ? 'bg-gradient-to-r from-sky-400 to-indigo-500 text-white shadow-md shadow-sky-500/30 hover:opacity-95'
                    : 'text-gray-600 cursor-not-allowed opacity-40'
                }`}
                title="Send prompt to Zentra"
              >
                <ArrowUp size={16} strokeWidth={2.5} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
