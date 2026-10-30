import { useState, useEffect, useRef, useCallback } from 'react';
import Background3D from './components/Background3D';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MessageBubble from './components/MessageBubble';
import Composer from './components/Composer';
import LandingPage from './components/LandingPage';
import { useAuth } from './hooks/useAuth';
import { useChats } from './hooks/useChats';
import { useMessages } from './hooks/useMessages';
import { fetchModels, streamChat } from './lib/api';
import { Loader2, Sparkles, ArrowRight } from 'lucide-react';

const STARTERS = [
  'Explain quantum computing simply with Google Gemini',
  'Help me debug a React useEffect infinite loop',
  'Write a professional email to decline a meeting',
  'What are the key metrics for a SaaS startup?',
];

export default function App() {
  const { user, session, loading: authLoading, signIn, signOut, isConfigured } = useAuth();
  const { chats, createChat, renameChat, togglePin, deleteChat, searchChats } = useChats(user);
  const { messages, setMessages, loadMessages, addMessage, clearMessages } = useMessages();

  const [view, setView] = useState('landing');
  const [models, setModels] = useState([]);
  const [provider, setProvider] = useState(() => localStorage.getItem('provider') || 'gemini');
  const [persona, setPersona] = useState(() => localStorage.getItem('persona') || 'default');
  const [bgTheme, setBgTheme] = useState(() => localStorage.getItem('bgTheme') || 'blue');
  const [activeChatId, setActiveChatId] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [error, setError] = useState(null);
  const [prefilledText, setPrefilledText] = useState('');

  const abortRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    fetchModels().then((d) => setModels(d.models || [])).catch(() => {});
  }, []);

  useEffect(() => { localStorage.setItem('provider', provider); }, [provider]);
  useEffect(() => { localStorage.setItem('persona', persona); }, [persona]);
  useEffect(() => { localStorage.setItem('bgTheme', bgTheme); }, [bgTheme]);

  useEffect(() => {
    if (activeChatId) loadMessages(activeChatId);
    else clearMessages();
  }, [activeChatId, loadMessages, clearMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);

  const handleLaunchChat = useCallback(({ provider: targetProvider = 'gemini', prompt = '' } = {}) => {
    if (targetProvider) setProvider(targetProvider);
    if (prompt) setPrefilledText(prompt);
    setView('chat');
  }, []);

  const handleSignInAndLaunch = useCallback(async (providerName) => {
    try {
      await signIn(providerName);
      setView('chat');
      setProvider('gemini');
      setPrefilledText('Hello Google Gemini! Introduce yourself and how you can help me.');
    } catch (err) {
      setError(err.message || 'Sign in failed');
      setView('chat');
    }
  }, [signIn]);

  const handleNewChat = useCallback(async () => {
    if (!user) return;
    const chat = await createChat();
    if (chat) {
      setActiveChatId(chat.id);
      clearMessages();
    }
  }, [user, createChat, clearMessages]);

  const handleSelectChat = (id) => {
    setActiveChatId(id);
    setError(null);
  };

  const handleSend = async (text) => {
    if (!session?.access_token) {
      setError('Please sign in to chat');
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
        provider,
        persona,
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
          const usedProvider = data?.provider || provider;
          await addMessage(chatId, 'assistant', final, usedProvider);
          setStreamingContent('');
          setIsStreaming(false);
        },
        onError: (err) => {
          setError(err);
          setIsStreaming(false);
          setStreamingContent('');
        },
        onFallback: (fb) => {
          setError(`Switched from ${fb.from} to ${fb.to}: ${fb.reason}`);
        },
      });
    } catch (err) {
      if (err.name !== 'AbortError') setError(err.message);
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

  if (authLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-950">
        <Loader2 className="animate-spin text-indigo-400" size={32} />
      </div>
    );
  }

  // Render Landing Page
  if (view === 'landing') {
    return (
      <div className="min-h-screen bg-gray-950 text-white relative overflow-x-hidden">
        <Background3D theme={bgTheme} />
        <LandingPage
          onLaunchChat={handleLaunchChat}
          onSignIn={handleSignInAndLaunch}
          user={user}
        />
      </div>
    );
  }

  // Render Chat Studio View
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-950 text-white">
      <Background3D theme={bgTheme} />
      <Header
        models={models}
        provider={provider}
        setProvider={setProvider}
        persona={persona}
        setPersona={setPersona}
        bgTheme={bgTheme}
        setBgTheme={setBgTheme}
        user={user}
        onSignIn={signIn}
        onSignOut={signOut}
        onNewChat={handleNewChat}
        onOpenLanding={() => setView('landing')}
        onGeminiTap={() => {
          setProvider('gemini');
          setPrefilledText('Explain Google Gemini 2.5 Flash architecture and multimodal reasoning capabilities.');
        }}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          chats={searchQuery ? searchChats(searchQuery) : chats}
          activeChatId={activeChatId}
          onSelect={handleSelectChat}
          onNew={handleNewChat}
          onRename={renameChat}
          onPin={togglePin}
          onDelete={(id) => { deleteChat(id); if (activeChatId === id) setActiveChatId(null); }}
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-4 py-6">
            <div className="max-w-3xl mx-auto space-y-4">
              {messages.length === 0 && !streamingContent && (
                <div className="text-center py-12 animate-fade-in space-y-6">
                  <div>
                    {/* Google Gemini Quick Tap Hero Badge in Empty State */}
                    <button
                      onClick={() => {
                        setProvider('gemini');
                        setPrefilledText('Explain how Google Gemini 2.5 Flash processes streaming tokens.');
                      }}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-xs font-medium text-indigo-300 hover:bg-indigo-500/20 transition mb-3 cursor-pointer"
                    >
                      <Sparkles size={14} className="text-indigo-400" />
                      <span>Google Gemini 2.5 Flash Mode Active · Tap to test</span>
                    </button>

                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-400 bg-clip-text text-transparent">
                      Speaker AI Studio
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">What would you like to explore or solve today?</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto text-left">
                    {STARTERS.map((s) => (
                      <button
                        key={s}
                        onClick={() => {
                          setProvider('gemini');
                          setPrefilledText(s);
                        }}
                        className="glass rounded-xl px-4 py-3 text-xs sm:text-sm hover:glass-strong hover:border-indigo-500/40 transition flex items-center justify-between group"
                      >
                        <span className="text-gray-200 group-hover:text-white transition-colors">{s}</span>
                        <ArrowRight size={13} className="text-indigo-400 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                      </button>
                    ))}
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => setView('landing')}
                      className="text-xs text-gray-500 hover:text-gray-300 underline underline-offset-4 transition"
                    >
                      ← Back to Speaker AI Landing Page
                    </button>
                  </div>
                </div>
              )}
              {messages.map((m, i) => (
                <MessageBubble
                  key={m.id || i}
                  message={m}
                  isLast={i === messages.length - 1 && !isStreaming}
                  onRegenerate={handleRegenerate}
                />
              ))}
              {streamingContent && (
                <MessageBubble message={{ role: 'assistant', content: streamingContent }} isLast={false} />
              )}
              {isStreaming && !streamingContent && (
                <div className="flex items-center gap-2 text-gray-400 text-sm py-2">
                  <Loader2 size={16} className="animate-spin text-indigo-400" />
                  <span>Thinking with {provider === 'gemini' ? 'Google Gemini 2.5 Flash' : provider}...</span>
                </div>
              )}
              {error && (
                <div className="glass border border-red-500/30 rounded-xl px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          </div>
          <Composer
            onSend={handleSend}
            onStop={handleStop}
            isStreaming={isStreaming}
            disabled={!user}
            provider={provider}
            setProvider={setProvider}
            prefilledText={prefilledText}
            onClearPrefilledText={() => setPrefilledText('')}
          />
        </main>
      </div>
    </div>
  );
}
