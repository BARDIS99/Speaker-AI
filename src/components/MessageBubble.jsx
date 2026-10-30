import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { Copy, Check, Volume2 } from 'lucide-react';

export default function MessageBubble({ message, onRegenerate, isLast }) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const copy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const speak = () => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(message.content);
    window.speechSynthesis.speak(u);
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}>
      <div className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-4 py-3 ${
        isUser
          ? 'bg-indigo-600/80 text-white rounded-br-md'
          : 'glass text-gray-100 rounded-bl-md'
      }`}>
        {isUser ? (
          <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
        ) : (
          <div className="prose prose-invert prose-sm max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
              {message.content}
            </ReactMarkdown>
          </div>
        )}
        <div className={`flex items-center gap-2 mt-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
          <button onClick={copy} className="p-1 rounded hover:bg-white/10 transition" title="Copy">
            {copied ? <Check size={14} /> : <Copy size={14} />}
          </button>
          {!isUser && (
            <button onClick={speak} className="p-1 rounded hover:bg-white/10 transition" title="Speak">
              <Volume2 size={14} />
            </button>
          )}
          {!isUser && isLast && onRegenerate && (
            <button onClick={onRegenerate} className="text-xs text-gray-400 hover:text-white transition px-1">
              Regenerate
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
