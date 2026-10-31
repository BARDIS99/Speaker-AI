import { useState, useEffect, useRef, useCallback } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MessageBubble from './components/MessageBubble';
import Composer from './components/Composer';
import AuthModal from './components/AuthModal';
import LandingPage from './components/LandingPage';
import Background3D from './components/Background3D';
import { ZentraSparkle } from './components/GeminiIcons';
import { useAuth } from './hooks/useAuth';
import { useChats } from './hooks/useChats';
import { useMessages } from './hooks/useMessages';
import { checkKeys, streamChat } from './lib/api';
import { Compass, Lightbulb, Code2, PenTool, AlertCircle } from 'lucide-react';

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

const ORDERED_PROVIDERS = ['gemini', 'groq', 'openrouter', 'mistral'];

export default function App() {
  const { user, session, loading: authLoading, signIn, signOut, switchAccount } = useAuth();
  const { chats, createChat, renameChat, togglePin, deleteChat, searchChats } = useChats(user);
  const { messages, setMessages, loadMessages, addMessage, clearMessages } = useMessages();

  const [provider, setProvider] = useState('gemini');
  const [keyStatuses, setKeyStatuses] = useState({
    gemini: 'missing',
    groq: 'missing',
    openrouter: 'missing',
    mistral: 'missing',
  });
  const [activeChatId, setActiveChatId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [error, setError] = useState(null);
  const [prefilledText, setPrefilledText] = useState('');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTitle, setAuthModalTitle] = useState('Sign in to Zentra');
  const [currentView, setCurrentView] = useState('chat'); // 'chat' | 'landing'

  const abortRef = useRef(null);
  const bottomRef = useRef(null);
  const providerRef = useRef(provider);
  providerRef.current = provider;

  // 1. KEY STATUS CHECK: Real check for each AI provider on app load and picker open
  const refreshKeyStatuses = useCallback(async () => {
    try {
      const data = await checkKeys();
      const statuses = {
        gemini: data.gemini || 'missing',
        groq: data.groq || 'missing',
        openrouter: data.openrouter || 'missing',
        mistral: data.mistral || 'missing',
      };
      setKeyStatuses(statuses);

      // If current model's key is not active, automatically fall back to the next active model
      const current = providerRef.current;
      if (statuses[current] !== 'active') {
        const nextActive = ORDERED_PROVIDERS.find((p) => statuses[p] === 'active');
        if (nextActive && nextActive !== current) {
          setProvider(nextActive);
        }
      }
    } catch (err) {
      console.warn('Unable to verify provider key statuses:', err);
    }
  }, []);

  useEffect(() => {
    refreshKeyStatuses();
  }, [refreshKeyStatuses]);

  useEffect(() => {
    if (activeChatId) loadMessages(activeChatId);
    else clearMessages();
  }, [activeChatId, loadMessages, clearMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);

  const handleNewChat = useCallback(async () => {
    const chat = await createChat('New chat');
    if (chat) {
      setActiveChatId(chat.id);
      clearMessages();
      setError(null);
      setCurrentView('chat');
    }
  }, [createChat, clearMessages]);

  const handleSelectChat = (id) => {
    setActiveChatId(id);
    setError(null);
    setCurrentView('chat');
  };

  const handleSend = async (text) => {
    const token = session?.access_token || 'guest-session-token';
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
    const currentActiveProvider = provider;
    try {
      await streamChat({
        provider: currentActiveProvider,
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
          await addMessage(chatId, 'assistant', final, currentActiveProvider);
          setStreamingContent('');
          setIsStreaming(false);
        },
        onError: (err) => {
          setError(err);
          setIsStreaming(false);
          setStreamingContent('');
        },
        onFallback: (fb) => {
          if (fb?.to) setProvider(fb.to);
        },
      });
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message || 'Unable to connect to AI provider API');
      }
      setIsStreaming(false);
      setStreamingContent('');
    }
  };

  const handleStop = () => {
    abortRef.current?.abort();
    setIsStreaming(false);
    if (streamingContent && activeChatId) {
      addMessage(activeChatId, 'assistant', streamingContent + ' [stopped]', provider);
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

  const handleSwitchAccount = async () => {
    await switchAccount();
    setAuthModalTitle('Switch Account');
    setAuthModalOpen(true);
  };

  const handleLaunchFromLanding = ({ provider: selectedProvider, prompt }) => {
    if (selectedProvider) setProvider(selectedProvider);
    if (prompt) setPrefilledText(prompt);
    setCurrentView('chat');
  };

  const userName = user?.user_metadata?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'Traveler';

  // Landing Page View
  if (currentView === 'landing') {
    return (
      <>
        <LandingPage
          onLaunchChat={handleLaunchFromLanding}
          onSignIn={async (p) => {
            await signIn(p);
            setCurrentView('chat');
          }}
          user={user}
        />
        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          onSignIn={signIn}
          title={authModalTitle}
        />
      </>
    );
  }

  // Chat Studio View
  return (
    <div className="h-screen flex flex-col bg-gemini-dark text-gray-100 overflow-hidden font-sans relative">
      {/* 4. Shared 3D Morphing Particle Wave Sphere (Three.js) */}
      <Background3D isStreaming={isStreaming} />

      {/* Top Header */}
      <Header
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        user={user}
        onOpenSignIn={() => {
          setAuthModalTitle('Sign in to Zentra');
          setAuthModalOpen(true);
        }}
        onSignOut={signOut}
        onSwitchAccount={handleSwitchAccount}
        onNewChat={handleNewChat}
        onToggleLanding={() => setCurrentView('landing')}
        isLandingView={false}
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
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* Center Chat View */}
        <main className="flex-1 flex flex-col overflow-hidden relative min-w-0">
          <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6">
            <div className="max-w-3xl mx-auto space-y-4">
              {/* Empty State Greeting & Cards */}
              {messages.length === 0 && !streamingContent && (
                <div className="py-8 sm:py-16 space-y-8 animate-fade-in">
                  <div>
                    <h1 className="text-4xl sm:text-5xl font-medium tracking-tight bg-gradient-to-r from-sky-400 via-indigo-300 to-fuchsia-400 bg-clip-text text-transparent">
                      Hello, {userName}
                    </h1>
                    <h2 className="text-3xl sm:text-4xl font-medium tracking-tight text-gray-400/80 mt-1">
                      How can Zentra help you today?
                    </h2>
                  </div>

                  {/* 4 Suggestion Cards */}
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
                    Thinking with {provider === 'gemini' ? 'Zentra 3.8 Flash' : provider}...
                  </span>
                </div>
              )}

              {/* Error banner */}
              {error && (
                <div className="p-4 rounded-2xl bg-red-950/60 backdrop-blur-md border border-red-500/40 text-sm text-red-200 flex items-start justify-between gap-3 animate-fade-in shadow-xl">
                  <div className="flex items-start gap-2.5">
                    <AlertCircle size={18} className="text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-red-100">Notice</div>
                      <div className="text-xs text-red-300/90 mt-0.5">{error}</div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>
          </div>

          {/* 2. Floating Prompt Bar with Embedded Model Picker */}
          <Composer
            onSend={handleSend}
            onStop={handleStop}
            isStreaming={isStreaming}
            disabled={isStreaming}
            prefilledText={prefilledText}
            onClearPrefilledText={() => setPrefilledText('')}
            provider={provider}
            setProvider={setProvider}
            keyStatuses={keyStatuses}
            onRefreshKeys={refreshKeyStatuses}
          />
        </main>
      </div>

      {/* 5. Auth Modal (Google & Discord only, queryParams prompt: "select_account" / "consent") */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSignIn={signIn}
        title={authModalTitle}
      />
    </div>
  );
}
