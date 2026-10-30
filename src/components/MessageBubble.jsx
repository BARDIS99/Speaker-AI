import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import {
  Copy,
  Check,
  Volume2,
  VolumeX,
  ThumbsUp,
  ThumbsDown,
  RotateCw,
  SlidersHorizontal
} from 'lucide-react';
import { ZentraSparkle } from './GeminiIcons';

export default function MessageBubble({ message, onRegenerate, isLast, onModifyResponse }) {
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState(null); // 'like' | 'dislike'
  const [speaking, setSpeaking] = useState(false);
  const [modifyOpen, setModifyOpen] = useState(false);

  const isUser = message.role === 'user';

  const copy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleSpeak = () => {
    if (!window.speechSynthesis) return;
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(message.content);
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(u);
  };

  if (isUser) {
    return (
      <div className="flex justify-end animate-fade-in my-3">
        <div className="max-w-[85%] md:max-w-[70%] bg-gemini-elevated/90 backdrop-blur-md text-gray-100 rounded-3xl px-5 py-3.5 text-sm leading-relaxed shadow-sm border border-gemini-border/40">
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-4 animate-fade-in my-4 text-gray-200">
      {/* Zentra Sparkle Avatar */}
      <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
        <ZentraSparkle className="w-6 h-6" id={`bubble_sparkle_${message.id || Math.random()}`} />
      </div>

      {/* Response Body */}
      <div className="flex-1 min-w-0 space-y-2">
        <div className="prose prose-invert prose-sm max-w-none text-gray-200 leading-relaxed font-sans bg-gemini-dark/40 p-1 rounded-xl">
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
            {message.content}
          </ReactMarkdown>
        </div>

        {/* Zentra Action Footer */}
        <div className="flex items-center gap-1 text-gray-400 pt-2 relative">
          {/* Thumbs up */}
          <button
            onClick={() => setFeedback(feedback === 'like' ? null : 'like')}
            className={`p-1.5 rounded-full hover:bg-gemini-surface transition ${
              feedback === 'like' ? 'text-sky-300' : 'hover:text-white'
            }`}
            title="Good response"
          >
            <ThumbsUp size={15} />
          </button>

          {/* Thumbs down */}
          <button
            onClick={() => setFeedback(feedback === 'dislike' ? null : 'dislike')}
            className={`p-1.5 rounded-full hover:bg-gemini-surface transition ${
              feedback === 'dislike' ? 'text-red-400' : 'hover:text-white'
            }`}
            title="Bad response"
          >
            <ThumbsDown size={15} />
          </button>

          {/* Listen audio */}
          <button
            onClick={toggleSpeak}
            className={`p-1.5 rounded-full hover:bg-gemini-surface transition ${
              speaking ? 'text-sky-300' : 'hover:text-white'
            }`}
            title={speaking ? 'Stop speaking' : 'Listen'}
          >
            {speaking ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>

          {/* Copy */}
          <button
            onClick={copy}
            className="p-1.5 rounded-full hover:bg-gemini-surface hover:text-white transition"
            title="Copy to clipboard"
          >
            {copied ? <Check size={15} className="text-emerald-400" /> : <Copy size={15} />}
          </button>

          {/* Regenerate if last */}
          {isLast && onRegenerate && (
            <button
              onClick={onRegenerate}
              className="p-1.5 rounded-full hover:bg-gemini-surface hover:text-white transition"
              title="Regenerate draft"
            >
              <RotateCw size={15} />
            </button>
          )}

          {/* Modify Response button */}
          <div className="relative">
            <button
              onClick={() => setModifyOpen(!modifyOpen)}
              className="p-1.5 rounded-full hover:bg-gemini-surface hover:text-white transition flex items-center gap-1 text-xs"
              title="Modify response"
            >
              <SlidersHorizontal size={14} />
            </button>

            {modifyOpen && (
              <div className="absolute left-0 bottom-full mb-2 w-44 bg-gemini-surface border border-gemini-border rounded-2xl p-1.5 shadow-2xl z-40 text-xs">
                <div className="px-2.5 py-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                  Modify response
                </div>
                {['Shorter', 'Longer', 'Simpler', 'More casual', 'More professional'].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setModifyOpen(false);
                      onModifyResponse?.(opt);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-gemini-elevated hover:text-white transition text-gray-300"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
