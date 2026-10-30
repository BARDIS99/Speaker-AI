import { useState, useRef, useEffect } from 'react';
import { Send, Square, Mic, MicOff, Image as ImageIcon } from 'lucide-react';

export default function Composer({ onSend, onStop, isStreaming, disabled }) {
  const [text, setText] = useState('');
  const [listening, setListening] = useState(false);
  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);

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

  return (
    <div className="p-4 border-t border-white/10">
      <div className="max-w-3xl mx-auto glass rounded-2xl flex items-end gap-2 p-2">
        <button onClick={toggleVoice} className={`p-2.5 rounded-xl transition ${listening ? 'bg-red-500/30 text-red-400' : 'hover:bg-white/10'}`} title="Voice input">
          {listening ? <MicOff size={18} /> : <Mic size={18} />}
        </button>
        <textarea
          ref={textareaRef}
          value={text}
          onChange={onInput}
          onKeyDown={onKeyDown}
          placeholder={disabled ? 'Sign in to chat...' : 'Message Speaker AI...'}
          disabled={disabled || isStreaming}
          rows={1}
          className="flex-1 bg-transparent resize-none outline-none text-sm py-2.5 px-1 max-h-40 placeholder:text-gray-500"
        />
        {isStreaming ? (
          <button onClick={onStop} className="p-2.5 rounded-xl bg-red-500/80 hover:bg-red-500 transition" title="Stop">
            <Square size={18} />
          </button>
        ) : (
          <button onClick={submit} disabled={!text.trim() || disabled} className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed transition" title="Send">
            <Send size={18} />
          </button>
        )}
      </div>
      <p className="text-center text-xs text-gray-600 mt-2">Enter to send · Shift+Enter for new line</p>
    </div>
  );
}
