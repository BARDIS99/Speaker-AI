import { useState, useEffect, useRef, useCallback } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MessageBubble from './components/MessageBubble';
import Composer from './components/Composer';
import GeminiApiKeyModal from './components/GeminiApiKeyModal';
import Background3D from './components/Background3D';
import { ZentraSparkle } from './components/GeminiIcons';
import { useAuth } from './hooks/useAuth';
import { useChats } from './hooks/useChats';
import { useMessages } from './hooks/useMessages';
import { fetchModels, streamChat } from './lib/api';
import { Compass, Lightbulb, Code2, PenTool, AlertCircle, Key } from 'lucide-react';

const ZENTRA_CARDS = [
  {
    title: 'Help me draft an email',
    prompt: 'Help me write a warm, professional thank you email to a mentor who gave me career guidance.',
    icon: PenTool,
    color: 'text-rose-400',
  },
  {
    title: 'Explain a complex concept',
    prompt: 'Explain quantum computing and superposition in simple terms with everyday analogies.',
    icon: Compass,
    color: 'text-amber-400',
  },
  {
    title: 'Code review & debugging',
    prompt: 'Review my code logic for infinite loops, race conditions, and recommend best practices.',
    icon: Code2,
    color: 'text-emerald-400',
  },
  {
    title: 'Brainstorm creative ideas',
    prompt: 'Brainstorm 5 innovative, useful AI application ideas for modern developers and students.',
    icon: Lightbulb,
    color: 'text-sky-400',
  },
];

export default function App() {
  const { user, session, loading: authLoading, signIn, signOut } = useAuth();
  const { chats, createChat, renameChat, togglePin, deleteChat, searchChats } = useChats(user);
  const { messages, setMessages, loadMessages, addMessage, clearMessages } = useMessages();

  const [provider, setProvider] = useState('gemini');
  const [activeChatId, setActiveChatId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [error, setError] = useState(null);
  const [prefilledText, setPrefilledText] = useState('');
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);
  const [isKeyConfigured, setIsKeyConfigured] = useState(true);

  const abortRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    fetchModels()
      .then((d) => {
        const geminiModel = d.models?.find((m) => m.id === 'gemini');
        setIsKeyConfigured(!!geminiModel?.available);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (activeChatId) loadMessages(activeChatId);
    else clearMessages();
  }, [activeChatId, loadMessages, clearMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);

  const handleNewChat = useCallback(async () => {
    if (!user) return;
    const chat = await createChat('New chat');
    if (chat) {
      setActiveChatId(chat.id);
      clearMessages();
      setError(null);
    }
  }, [user, createChat, clearMessages]);

  const handleSelectChat = (id) => {
    setActiveChatId(id);
    setError(null);
  };

  const handleSend = async (text) => {
    if (!session?.access_token) {
      setError('Please sign in to chat with Zentra.');
      return;
    }
    setError(null);
    let chatId = activeChatId;
    if (!chatId) {
      const chat = await createChat(text.slice(0, 40));
      if (!chat) return;
      chatId = chat.id;
      setActiveChatId(chatId);
    }

    await addMessage(chatId, 'user', text);
    const history = [...messages, { role: 'user', content: text }];

    setIsStreaming(true);
    setStreamingContent('');
    const controller = new AbortController();
    abortRef.current = controller;

    let full = '';
    try {
      await streamChat({
        provider: 'gemini',
        persona: 'default',
        messages: history.map((m) => ({ role: m.role, content: m.content })),
        token: session.access_token,
        signal: controller.signal,
        onChunk: (c) => {
          full += c;
          setStreamingContent(full);
        },
        onDone: async (data) => {
          if (data?.aborted) return;
          const final = data?.content || full;
          await addMessage(chatId, 'assistant', final, 'gemini');
          setStreamingContent('');
          setIsStreaming(false);
        },
        onError: (err) => {
          setError(err);
          setIsStreaming(false);
          setStreamingContent('');
        },
        onFallback: () => {},
      });
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message || 'Unable to connect to Zentra API');
      }
      setIsStreaming(false);
      setStreamingContent('');
    }
  };

  const handleStop = () => {
    abortRef.current?.abort();
    setIsStreaming(false);
    if (streamingContent && activeChatId) {
      addMessage(activeChatId, 'assistant', streamingContent + ' [stopped]', 'gemini');
      setStreamingContent('');
    }
  };

  const handleRegenerate = () => {
    const lastUser = [...messages].reverse().find((m) => m.role === 'user');
    if (lastUser) {
      setMessages((prev) => prev.filter((m) => m.id !== messages[messages.length - 1]?.id));
      handleSend(lastUser.content);
    }
  };

  const handleModifyResponse = (type) => {
    const prompt = `Please rewrite your previous response to be ${type.toLowerCase()}.`;
    handleSend(prompt);
  };

  const userName = user?.user_metadata?.name?.split(' ')[0] || 'Traveler';

  return (
    <div className="h-screen flex flex-col bg-gemini-dark text-gray-100 overflow-hidden font-sans relative">
      {/* 3D Morphing Particle Wave Sphere in Background (from SS.jpeg) */}
      <Background3D isStreaming={isStreaming} />

      {/* Top Header */}
      <Header
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        provider={provider}
        setProvider={setProvider}
        user={user}
        onSignIn={signIn}
        onSignOut={signOut}
        onNewChat={handleNewChat}
        onOpenApiKeyGuide={() => setApiKeyModalOpen(true)}
        isKeyConfigured={isKeyConfigured}
      />

      <div className="flex flex-1 overflow-hidden relative z-10">
        {/* Left Navigation Drawer */}
        <Sidebar
          chats={searchQuery ? searchChats(searchQuery) : chats}
          activeChatId={activeChatId}
          onSelect={handleSelectChat}
          onNew={handleNewChat}
          onRename={renameChat}
          onPin={togglePin}
          onDelete={(id) => {
            deleteChat(id);
            if (activeChatId === id) setActiveChatId(null);
          }}
          collapsed={!sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenApiKeyGuide={() => setApiKeyModalOpen(true)}
        />

        {/* Center Chat View */}
        <main className="flex-1 flex flex-col overflow-hidden relative min-w-0">
          <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6">
            <div className="max-w-3xl mx-auto space-y-4">
              {/* Empty State Greeting & Cards */}
              {messages.length === 0 && !streamingContent && (
                <div className="py-8 sm:py-16 space-y-8 animate-fade-in">
                  {/* Zentra Gradient Greeting */}
                  <div>
                    <h1 className="text-4xl sm:text-5xl font-medium tracking-tight bg-gradient-to-r from-sky-400 via-indigo-300 to-fuchsia-400 bg-clip-text text-transparent">
                      Hello, {userName}
                    </h1>
                    <h2 className="text-3xl sm:text-4xl font-medium tracking-tight text-gray-400/80 mt-1">
                      How can Zentra help you today?
                    </h2>
                  </div>

                  {/* 4 Zentra Suggestion Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-4">
                    {ZENTRA_CARDS.map((card, idx) => {
                      const Icon = card.icon;
                      return (
                        <button
                          key={idx}
                          onClick={() => setPrefilledText(card.prompt)}
                          className="p-4 rounded-2xl bg-gemini-surface/85 backdrop-blur-md hover:bg-gemini-elevated/95 border border-gemini-border/70 hover:border-sky-500/40 text-left transition duration-200 flex flex-col justify-between h-40 group shadow-lg hover:shadow-sky-500/10"
                        >
                          <p className="text-sm font-medium text-gray-200 group-hover:text-white line-clamp-3 leading-snug">
                            {card.prompt}
                          </p>
                          <div className="flex justify-end pt-2">
                            <div className="w-9 h-9 rounded-full bg-gemini-dark/80 flex items-center justify-center border border-gemini-border/60 group-hover:border-sky-400/50 group-hover:scale-105 transition">
                              <Icon size={17} className={card.color} />
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Chat Message Stream */}
              {messages.map((m, i) => (
                <MessageBubble
                  key={m.id || i}
                  message={m}
                  isLast={i === messages.length - 1 && !isStreaming}
                  onRegenerate={handleRegenerate}
                  onModifyResponse={handleModifyResponse}
                />
              ))}

              {/* Real-time Streaming Response */}
              {streamingContent && (
                <MessageBubble
                  message={{ role: 'assistant', content: streamingContent }}
                  isLast={false}
                />
              )}

              {/* Zentra Shimmering Thinking Indicator */}
              {isStreaming && !streamingContent && (
                <div className="flex items-center gap-3 py-4 text-gray-400 text-sm animate-pulse bg-gemini-surface/50 backdrop-blur-md px-4 rounded-2xl border border-gemini-border/40 w-fit">
                  <ZentraSparkle className="w-5 h-5 animate-spin" id="zentra_thinking_sparkle" />
                  <span className="bg-gradient-to-r from-sky-400 via-indigo-300 to-fuchsia-400 bg-clip-text text-transparent font-medium">
                    Thinking with Zentra 3.8 Flash...
                  </span>
                </div>
              )}

              {/* Error banner with Free Key Guide shortcut */}
              {error && (
                <div className="p-4 rounded-2xl bg-red-950/60 backdrop-blur-md border border-red-500/40 text-sm text-red-200 flex items-start justify-between gap-3 animate-fade-in shadow-xl">
                  <div className="flex items-start gap-2.5">
                    <AlertCircle size={18} className="text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-red-100">Zentra Notice</div>
                      <div className="text-xs text-red-300/90 mt-0.5">{error}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setApiKeyModalOpen(true)}
                    className="px-3 py-1.5 rounded-full bg-red-500/20 hover:bg-red-500/30 text-xs font-medium text-red-200 transition shrink-0 flex items-center gap-1.5"
                  >
                    <Key size={13} />
                    <span>Free Key Guide</span>
                  </button>
                </div>
              )}

              <div ref={bottomRef} />
            </div>
          </div>

          {/* Floating Prompt Bar at the bottom */}
          <Composer
            onSend={handleSend}
            onStop={handleStop}
            isStreaming={isStreaming}
            disabled={!user}
            prefilledText={prefilledText}
            onClearPrefilledText={() => setPrefilledText('')}
            onOpenApiKeyGuide={() => setApiKeyModalOpen(true)}
          />
        </main>
      </div>

      {/* Zentra Free API Key Documentation Modal */}
      <GeminiApiKeyModal
        isOpen={apiKeyModalOpen}
        onClose={() => setApiKeyModalOpen(false)}
        isKeyConfigured={isKeyConfigured}
      />
    </div>
  );
}
