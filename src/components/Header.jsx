import { useState } from 'react';
import { Sparkles, ChevronDown, LogOut, User, Sun, Moon } from 'lucide-react';

const PERSONAS = [
  { id: 'default', name: 'Default' },
  { id: 'tutor', name: 'Tutor' },
  { id: 'coding', name: 'Coding' },
  { id: 'business', name: 'Business' },
  { id: 'writing', name: 'Writing' },
];

export default function Header({
  models, provider, setProvider, persona, setPersona, bgTheme, setBgTheme, user, onSignIn, onSignOut, onNewChat,
}) {
  const [modelOpen, setModelOpen] = useState(false);
  const [personaOpen, setPersonaOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  const currentModel = models.find((m) => m.id === provider);

  return (
    <header className="h-14 glass border-b flex items-center justify-between px-4 shrink-0 z-20">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="text-indigo-400" size={22} />
          <span className="font-bold text-lg tracking-tight hidden sm:inline">Speaker AI</span>
        </div>
        <button onClick={onNewChat} className="text-xs px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition">
          New
        </button>
      </div>

      <div className="flex items-center gap-2">
        {/* Model selector */}
        <div className="relative">
          <button onClick={() => setModelOpen(!modelOpen)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass text-sm hover:bg-white/10 transition">
            {currentModel?.name || 'Model'} <ChevronDown size={14} />
          </button>
          {modelOpen && (
            <div className="absolute right-0 mt-1 w-52 glass-strong rounded-xl shadow-xl py-1 z-50">
              {models.map((m) => (
                <button
                  key={m.id}
                  onClick={() => { setProvider(m.id); setModelOpen(false); }}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-white/10 flex justify-between ${provider === m.id ? 'text-indigo-400' : ''}`}
                >
                  <span>{m.name}</span>
                  {!m.available && <span className="text-xs text-red-400">No key</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Persona */}
        <div className="relative hidden md:block">
          <button onClick={() => setPersonaOpen(!personaOpen)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass text-sm hover:bg-white/10 transition">
            {PERSONAS.find((p) => p.id === persona)?.name || 'Persona'} <ChevronDown size={14} />
          </button>
          {personaOpen && (
            <div className="absolute right-0 mt-1 w-40 glass-strong rounded-xl shadow-xl py-1 z-50">
              {PERSONAS.map((p) => (
                <button key={p.id} onClick={() => { setPersona(p.id); setPersonaOpen(false); }} className={`w-full text-left px-3 py-2 text-sm hover:bg-white/10 ${persona === p.id ? 'text-indigo-400' : ''}`}>
                  {p.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Theme */}
        <select
          value={bgTheme}
          onChange={(e) => setBgTheme(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-sm focus:outline-none"
        >
          <option value="blue">Blue</option>
          <option value="green">Green</option>
          <option value="sunset">Sunset</option>
        </select>

        {/* User */}
        {user ? (
          <div className="relative">
            <button onClick={() => setUserOpen(!userOpen)} className="flex items-center gap-2 pl-1">
              {user.user_metadata?.avatar_url ? (
                <img src={user.user_metadata.avatar_url} alt="" className="w-8 h-8 rounded-full" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center"><User size={16} /></div>
              )}
            </button>
            {userOpen && (
              <div className="absolute right-0 mt-1 w-48 glass-strong rounded-xl shadow-xl py-1 z-50">
                <div className="px-3 py-2 text-sm border-b border-white/10 truncate">{user.email}</div>
                <button onClick={() => { onSignOut(); setUserOpen(false); }} className="w-full text-left px-3 py-2 text-sm hover:bg-white/10 flex items-center gap-2 text-red-400">
                  <LogOut size={14} /> Sign out
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex gap-1">
            {['google', 'github', 'discord'].map((p) => (
              <button key={p} onClick={() => onSignIn(p)} className="px-2.5 py-1.5 rounded-lg glass text-xs capitalize hover:bg-white/10 transition">
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
