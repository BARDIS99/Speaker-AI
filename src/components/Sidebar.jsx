import { useState } from 'react';
import {
  Plus,
  MessageSquare,
  Search,
  Pin,
  Trash2,
  Edit2,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { ZentraSparkle } from './GeminiIcons';

export default function Sidebar({
  chats,
  activeChatId,
  onSelect,
  onNew,
  onRename,
  onPin,
  onDelete,
  collapsed,
  onToggle,
  searchQuery,
  setSearchQuery,
  onOpenApiKeyGuide,
}) {
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  const filtered = searchQuery
    ? chats.filter((c) => c.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : chats;

  const startEdit = (chat) => {
    setEditingId(chat.id);
    setEditTitle(chat.title);
  };

  const saveEdit = (id) => {
    if (editTitle.trim()) onRename(id, editTitle.trim());
    setEditingId(null);
  };

  if (collapsed) {
    return (
      <aside className="w-16 bg-gemini-surface/40 backdrop-blur-md border-r border-gemini-border/40 flex flex-col items-center py-4 gap-3 shrink-0 select-none z-10">
        <button
          onClick={onNew}
          className="w-10 h-10 rounded-full bg-gemini-elevated hover:bg-[#37393b] flex items-center justify-center text-sky-300 border border-gemini-border/60 transition shadow-sm"
          title="New chat"
        >
          <Plus size={18} />
        </button>

        <div className="w-8 h-[1px] bg-gemini-border/60 my-1" />

        <button
          onClick={onOpenApiKeyGuide}
          className="p-2.5 rounded-xl hover:bg-gemini-elevated text-gray-400 hover:text-white transition"
          title="Free API Key Guide"
        >
          <ZentraSparkle className="w-5 h-5" id="sidebar_collapsed_sparkle" />
        </button>
      </aside>
    );
  }

  return (
    <aside className="w-72 bg-gemini-surface/30 backdrop-blur-md border-r border-gemini-border/50 flex flex-col shrink-0 h-full select-none animate-fade-in z-10">
      {/* Top: New chat button */}
      <div className="p-3.5 pb-2">
        <button
          onClick={onNew}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-full bg-gemini-elevated/90 hover:bg-[#333537] border border-gemini-border/60 text-sm font-medium text-gray-200 transition shadow-sm group"
        >
          <Plus size={18} className="text-sky-400 group-hover:text-white transition-colors" />
          <span>New chat</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="px-3.5 py-1.5">
        <div className="relative">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search chats..."
            className="w-full pl-9 pr-3 py-1.5 rounded-full bg-gemini-elevated/70 border border-gemini-border/40 text-xs focus:outline-none focus:border-sky-500 text-white placeholder:text-gray-500"
          />
        </div>
      </div>

      {/* Recent Chats Section */}
      <div className="flex-1 overflow-y-auto px-2.5 py-2 space-y-0.5 no-scrollbar">
        <div className="px-3 py-1.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
          Recent
        </div>

        {filtered.map((chat) => {
          const isActive = activeChatId === chat.id;
          return (
            <div
              key={chat.id}
              onClick={() => onSelect(chat.id)}
              className={`group flex items-center gap-2.5 px-3 py-2 rounded-full cursor-pointer text-xs transition ${
                isActive
                  ? 'bg-gemini-elevated text-white font-medium border border-gemini-border/60'
                  : 'text-gray-300 hover:bg-gemini-surface/70 hover:text-white'
              }`}
            >
              <MessageSquare size={14} className={`shrink-0 ${isActive ? 'text-sky-400' : 'text-gray-500'}`} />

              {editingId === chat.id ? (
                <input
                  autoFocus
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onBlur={() => saveEdit(chat.id)}
                  onKeyDown={(e) => e.key === 'Enter' && saveEdit(chat.id)}
                  className="flex-1 bg-transparent border-b border-sky-400 outline-none text-xs text-white"
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <span className="flex-1 truncate">{chat.title}</span>
              )}

              {chat.pinned && <Pin size={11} className="text-sky-400 shrink-0" />}

              <div
                className="hidden group-hover:flex items-center gap-1 shrink-0"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => startEdit(chat)}
                  className="p-1 rounded-full hover:bg-white/10 text-gray-400 hover:text-white"
                  title="Rename"
                >
                  <Edit2 size={11} />
                </button>
                <button
                  onClick={() => onPin(chat.id, !chat.pinned)}
                  className="p-1 rounded-full hover:bg-white/10 text-gray-400 hover:text-white"
                  title="Pin"
                >
                  <Pin size={11} />
                </button>
                <button
                  onClick={() => onDelete(chat.id)}
                  className="p-1 rounded-full hover:bg-red-500/20 text-gray-400 hover:text-red-400"
                  title="Delete"
                >
                  <Trash2 size={11} />
                </button>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <p className="text-center text-gray-500 text-xs py-8">No chats yet</p>
        )}
      </div>

      {/* Sidebar Footer: Zentra Free Key Guide & Info */}
      <div className="p-3 border-t border-gemini-border/40 space-y-1">
        <button
          onClick={onOpenApiKeyGuide}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-gemini-elevated text-xs text-gray-300 hover:text-white transition"
        >
          <ZentraSparkle className="w-4 h-4" id="sidebar_free_key_sparkle" />
          <span className="truncate">Free API Key Guide</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 font-mono ml-auto">
            100% Free
          </span>
        </button>

        <a
          href="https://aistudio.google.com/app/apikey"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-gemini-elevated text-xs text-gray-400 hover:text-white transition"
        >
          <span className="flex items-center gap-2">
            <HelpCircle size={14} />
            <span>AI Studio Key Portal</span>
          </span>
          <ExternalLink size={12} />
        </a>
      </div>
    </aside>
  );
}
