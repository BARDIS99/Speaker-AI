import { useState } from 'react';
import {
  Sparkles,
  Terminal,
  GraduationCap,
  TrendingUp,
  PenTool,
  Cpu,
  ChevronRight,
  ChevronLeft,
  SlidersHorizontal,
  Zap,
  Check,
  Bot,
  Layers,
  ArrowUpRight
} from 'lucide-react';

export const AGENTS = [
  {
    id: 'default',
    name: 'Gemini Core',
    shortName: 'Core',
    role: 'General Intelligence',
    description: 'Fast synthesis, versatile reasoning, multimodal queries',
    icon: Sparkles,
    color: 'from-indigo-500 to-purple-600',
    border: 'border-indigo-500/40',
    badge: 'bg-indigo-500/20 text-indigo-300',
    tag: 'Primary',
    prompts: [
      'Explain quantum computing in 3 simple analogies',
      'Compare relational SQL vs vector databases',
      'Break down how generative AI models handle reasoning',
      'Summarize key trends in ambient computing'
    ]
  },
  {
    id: 'coding',
    name: 'Ada Code Agent',
    shortName: 'Code',
    role: 'Full-Stack Software Engineer',
    description: 'TypeScript, React, Python, architecture & debugging',
    icon: Terminal,
    color: 'from-emerald-500 to-cyan-600',
    border: 'border-emerald-500/40',
    badge: 'bg-emerald-500/20 text-emerald-300',
    tag: 'Dev',
    prompts: [
      'Debug a React useEffect infinite loop with clean fix',
      'Write a typed Express route with zod validation',
      'Optimize this SQL query for high-traffic read locks',
      'Refactor this component for maximum performance'
    ]
  },
  {
    id: 'tutor',
    name: 'Socrates Tutor',
    shortName: 'Tutor',
    role: 'Pedagogical Guide',
    description: 'Socratic dialogue, step-by-step concept breakdown',
    icon: GraduationCap,
    color: 'from-amber-500 to-orange-600',
    border: 'border-amber-500/40',
    badge: 'bg-amber-500/20 text-amber-300',
    tag: 'Learn',
    prompts: [
      'Explain Fourier transforms using sound wave metaphors',
      'Teach me calculus fundamental theorem step-by-step',
      'Quiz me on distributed system consensus algorithms',
      'How does backpropagation calculate gradient descent?'
    ]
  },
  {
    id: 'business',
    name: 'Apex Strategist',
    shortName: 'Biz',
    role: 'Executive & Market Advisor',
    description: 'Go-to-market, financial metrics, pitch narratives',
    icon: TrendingUp,
    color: 'from-blue-500 to-cyan-500',
    border: 'border-blue-500/40',
    badge: 'bg-blue-500/20 text-blue-300',
    tag: 'Strategy',
    prompts: [
      'Draft a pitch deck outline for our AI startup',
      'Calculate SaaS CAC payback period & net retention',
      'Write a 30-60-90 day enterprise sales execution plan',
      'Analyze competitive moat against legacy incumbents'
    ]
  },
  {
    id: 'writing',
    name: 'Calliope Editor',
    shortName: 'Write',
    role: 'Prose & Tone Coach',
    description: 'Executive communication, copy refinement, clarity',
    icon: PenTool,
    color: 'from-pink-500 to-rose-600',
    border: 'border-pink-500/40',
    badge: 'bg-pink-500/20 text-pink-300',
    tag: 'Editorial',
    prompts: [
      'Rewrite this paragraph for crisp, authoritative punch',
      'Draft an executive email politely declining a request',
      'Generate 5 high-converting headlines for our launch',
      'Structure a compelling product announcement post'
    ]
  }
];

export default function AgentPanel({
  persona,
  setPersona,
  provider,
  setProvider,
  models = [],
  isOpen,
  onToggle,
  onSelectPrompt,
  isStreaming
}) {
  const [creativity, setCreativity] = useState('balanced');
  const [responseLength, setResponseLength] = useState('standard');

  const currentAgent = AGENTS.find((a) => a.id === persona) || AGENTS[0];
  const IconComponent = currentAgent.icon;

  if (!isOpen) {
    return (
      <aside className="hidden lg:flex flex-col items-center py-3 px-1.5 glass border-l border-white/10 shrink-0 w-12 z-10 transition-all duration-300">
        <button
          onClick={onToggle}
          className="p-2 rounded-xl hover:bg-white/10 text-gray-300 hover:text-white transition mb-3"
          title="Expand Agent Side Pack"
        >
          <ChevronLeft size={16} />
        </button>

        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 mb-3">
          <IconComponent size={16} />
        </div>

        <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-400 [writing-mode:vertical-rl] rotate-180 mb-4 select-none">
          Agent Pack · {currentAgent.shortName}
        </span>

        <div className="flex-1 flex flex-col gap-2 items-center">
          {AGENTS.map((a) => {
            const AIcon = a.icon;
            const isActive = a.id === persona;
            return (
              <button
                key={a.id}
                onClick={() => setPersona(a.id)}
                className={`p-2 rounded-lg transition text-xs relative ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
                title={`${a.name} (${a.role})`}
              >
                <AIcon size={14} />
                {isActive && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-gray-950" />
                )}
              </button>
            );
          })}
        </div>

        <button
          onClick={onToggle}
          className="p-1.5 rounded-lg text-indigo-400 hover:bg-indigo-500/20 transition mt-auto"
          title="Open Agent Panel"
        >
          <SlidersHorizontal size={14} />
        </button>
      </aside>
    );
  }

  return (
    <aside className="w-80 sm:w-84 glass border-l border-white/10 flex flex-col shrink-0 h-full z-10 animate-fade-in">
      {/* Header */}
      <div className="p-3.5 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-sm">
            <Bot size={15} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-semibold text-xs text-white">Agent Companion Pack</h3>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-[10px] text-gray-400">Packed to chat box side</p>
          </div>
        </div>
        <button
          onClick={onToggle}
          className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition"
          title="Collapse Agent Pack"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3.5 space-y-4 no-scrollbar">
        {/* Active Agent Hero Card */}
        <div className={`p-3.5 rounded-2xl glass-strong border ${currentAgent.border} relative overflow-hidden group`}>
          <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 rounded-full bg-indigo-500/10 blur-xl pointer-events-none" />

          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${currentAgent.color} flex items-center justify-center text-white shadow-md shadow-indigo-600/25`}>
                <IconComponent size={18} />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-sm text-white">{currentAgent.name}</h4>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${currentAgent.badge}`}>
                    {currentAgent.tag}
                  </span>
                </div>
                <p className="text-[11px] text-indigo-300/90 font-medium">{currentAgent.role}</p>
              </div>
            </div>

            <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono">
              <span className="w-1 h-1 rounded-full bg-emerald-400 animate-ping" />
              <span>Ready</span>
            </div>
          </div>

          <p className="text-xs text-gray-300 mt-2.5 leading-relaxed">
            {currentAgent.description}
          </p>

          <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] text-gray-400">
            <span className="flex items-center gap-1">
              <Cpu size={12} className="text-indigo-400" />
              <span>Model:</span>
            </span>
            <span className="text-gray-200 font-mono text-[10px] font-medium bg-white/5 px-2 py-0.5 rounded">
              {provider === 'gemini' ? 'gemini-3.8-flash' : provider}
            </span>
          </div>
        </div>

        {/* Switch Persona / Agent list */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-gray-300 uppercase tracking-wider">
              Select Agent
            </span>
            <span className="text-[10px] text-indigo-400 font-mono">5 Agents Available</span>
          </div>

          <div className="space-y-1.5">
            {AGENTS.map((agent) => {
              const AIcon = agent.icon;
              const isSelected = agent.id === persona;
              return (
                <button
                  key={agent.id}
                  onClick={() => setPersona(agent.id)}
                  className={`w-full text-left p-2.5 rounded-xl border transition flex items-center justify-between group ${
                    isSelected
                      ? 'glass-strong border-indigo-500/60 bg-indigo-500/10 shadow-sm'
                      : 'glass border-white/5 hover:border-white/20 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition ${
                        isSelected
                          ? `bg-gradient-to-br ${agent.color} text-white`
                          : 'bg-white/10 text-gray-400 group-hover:text-white'
                      }`}
                    >
                      <AIcon size={14} />
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-medium text-white flex items-center gap-1.5">
                        <span className="truncate">{agent.name}</span>
                        {isSelected && <Check size={12} className="text-indigo-400 shrink-0" />}
                      </div>
                      <div className="text-[10px] text-gray-400 truncate">{agent.role}</div>
                    </div>
                  </div>

                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-medium shrink-0 ml-1.5 ${
                    isSelected ? agent.badge : 'bg-white/5 text-gray-400'
                  }`}>
                    {agent.tag}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Agent Skill Presets */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-1">
              <Zap size={12} className="text-amber-400" />
              <span>{currentAgent.shortName} Skill Presets</span>
            </span>
            <span className="text-[10px] text-gray-500">Tap to load</span>
          </div>

          <div className="space-y-1.5">
            {currentAgent.prompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => onSelectPrompt(p)}
                className="w-full text-left p-2 rounded-lg glass border border-white/5 hover:border-indigo-500/40 hover:bg-indigo-500/5 text-gray-300 hover:text-white transition flex items-start justify-between group"
              >
                <span className="text-[11px] leading-snug line-clamp-2 pr-2">{p}</span>
                <ArrowUpRight size={12} className="text-gray-500 group-hover:text-indigo-400 shrink-0 mt-0.5 transition-colors" />
              </button>
            ))}
          </div>
        </div>

        {/* Agent Tone / Tuning */}
        <div className="p-3 rounded-xl glass border border-white/10 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-300 font-medium flex items-center gap-1">
              <SlidersHorizontal size={12} className="text-indigo-400" />
              <span>Agent Tuning</span>
            </span>
            <span className="text-[10px] text-gray-500 capitalize">{creativity}</span>
          </div>

          <div className="grid grid-cols-3 gap-1 p-0.5 bg-black/30 rounded-lg text-[10px]">
            {['precise', 'balanced', 'creative'].map((mode) => (
              <button
                key={mode}
                onClick={() => setCreativity(mode)}
                className={`py-1 rounded capitalize font-medium transition ${
                  creativity === mode
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between pt-1 text-[11px] text-gray-400">
            <span>Response Length</span>
            <div className="flex gap-1 text-[10px]">
              {['concise', 'standard'].map((len) => (
                <button
                  key={len}
                  onClick={() => setResponseLength(len)}
                  className={`px-2 py-0.5 rounded capitalize transition ${
                    responseLength === len ? 'bg-white/15 text-white' : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  {len}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
