import { useState } from 'react';
import { Plus, Search, Pin, Trash2, Edit2, ChevronLeft, ChevronRight, Settings, MessageSquare } from 'lucide-react';

export default function Sidebar({
  chats, activeChatId, onSelect, onNew, onRename, onPin, onDelete, onSearch, collapsed, onToggle, searchQuery, setSearchQuery,
}) {
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  const filtered = searchQuery ? chats.filter((c) => c.title.toLowerCase().includes(searchQuery.toLowerCase())) : chats;

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
      <aside className="w-14 glass border-r flex flex-col items-center py-4 gap-3 shrink-0">
        <button onClick={onToggle} className="p-2 rounded-lg hover:bg-white/10"><ChevronRight size={18} /></button>
        <button onClick={onNew} className="p-2 rounded-lg hover:bg-white/10 text-indigo-400"><Plus size={18} /></button>
      </aside>
    );
  }

  return (
    <aside className="w-64 md:w-72 glass border-r flex flex-col shrink-0 h-full">
      <div className="p-3 flex items-center justify-between border-b border-white/10">
        <span className="font-semibold text-sm">Conversations</span>
        <button onClick={onToggle} className="p-1.5 rounded hover:bg-white/10"><ChevronLeft size={16} /></button>
      </div>
      <div className="p-3">
        <button onClick={onNew} className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl bg-indigo-600/80 hover:bg-indigo-500 transition text-sm font-medium">
          <Plus size={16} /> New Chat
        </button>
      </div>
      <div className="px-3 pb-2">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-indigo-500/50"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-2 pb-3 space-y-0.5">
        {filtered.map((chat) => (
          <div
            key={chat.id}
            onClick={() => onSelect(chat.id)}
            className={`group flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer text-sm transition ${
              activeChatId === chat.id ? 'bg-white/10' : 'hover:bg-white/5'
            }`}
          >
            <MessageSquare size={14} className="shrink-0 text-gray-500" />
            {editingId === chat.id ? (
              <input
                autoFocus
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onBlur={() => saveEdit(chat.id)}
                onKeyDown={(e) => e.key === 'Enter' && saveEdit(chat.id)}
                className="flex-1 bg-transparent border-b border-indigo-500 outline-none text-sm"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <span className="flex-1 truncate">{chat.title}</span>
            )}
            {chat.pinned && <Pin size={12} className="text-indigo-400 shrink-0" />}
            <div className="hidden group-hover:flex items-center gap-0.5 shrink-0" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => startEdit(chat)} className="p-1 rounded hover:bg-white/10"><Edit2 size={12} /></button>
              <button onClick={() => onPin(chat.id, !chat.pinned)} className="p-1 rounded hover:bg-white/10"><Pin size={12} /></button>
              <button onClick={() => onDelete(chat.id)} className="p-1 rounded hover:bg-red-500/20 text-red-400"><Trash2 size={12} /></button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-center text-gray-500 text-xs py-6">No conversations</p>}
      </div>
    </aside>
  );
}
