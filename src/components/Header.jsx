import { useState, useRef, useEffect } from 'react';
import { Menu, LogOut, UserCheck, RefreshCw, LayoutTemplate } from 'lucide-react';
import { ZentraSparkle, GoogleGIcon } from './GeminiIcons';

export default function Header({
  sidebarOpen,
  onToggleSidebar,
  user,
  onOpenSignIn,
  onSignOut,
  onSwitchAccount,
  onNewChat,
  onToggleLanding,
  isLandingView,
}) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    }
    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [userMenuOpen]);

  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'Zentra User';
  const userEmail = user?.email || '';
  const userAvatar = user?.user_metadata?.avatar_url;

  return (
    <header className="h-14 sm:h-16 px-3 sm:px-4 bg-gemini-dark/80 backdrop-blur-md border-b border-gemini-border/40 flex items-center justify-between shrink-0 z-30 select-none relative">
      {/* Left: Hamburger menu + Zentra Brand */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-full hover:bg-gemini-surface text-gray-300 hover:text-white transition"
          title="Toggle navigation"
        >
          <Menu size={19} />
        </button>

        {/* Zentra Brand with Gradient Sparkle */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={onNewChat}>
          <ZentraSparkle className="w-6 h-6" id="zentra_header_logo" />
          <span className="text-lg sm:text-xl font-semibold tracking-tight bg-gradient-to-r from-sky-400 via-indigo-300 to-fuchsia-400 bg-clip-text text-transparent">
            Zentra
          </span>
        </div>
      </div>

      {/* Right: Landing View Link + User Account */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Toggle Landing / Studio view */}
        <button
          onClick={onToggleLanding}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gemini-surface/80 hover:bg-gemini-elevated border border-gemini-border/60 text-xs font-medium text-gray-300 hover:text-white transition"
          title={isLandingView ? 'Back to Studio' : 'View Landing Page'}
        >
          <LayoutTemplate size={13} className="text-sky-400" />
          <span className="hidden sm:inline">{isLandingView ? 'Chat Studio' : 'Overview'}</span>
        </button>

        {/* User Account / Menu */}
        {user ? (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-full bg-gemini-surface/80 hover:bg-gemini-elevated border border-gemini-border/70 text-xs text-gray-200 transition focus:ring-2 focus:ring-sky-400/50"
            >
              {userAvatar ? (
                <img src={userAvatar} alt="" className="w-6 h-6 rounded-full object-cover shrink-0" />
              ) : (
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center text-white text-[11px] font-bold shrink-0">
                  {(userName[0] || 'Z').toUpperCase()}
                </div>
              )}
              <span className="font-medium text-xs max-w-[90px] sm:max-w-[120px] truncate hidden xs:inline">
                {userName}
              </span>
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-gemini-surface/98 backdrop-blur-2xl border border-gemini-border rounded-2xl shadow-2xl py-2 z-50 animate-fade-in">
                {/* User Details: Avatar, Name, Email */}
                <div className="px-4 py-3 border-b border-gemini-border flex items-center gap-3">
                  {userAvatar ? (
                    <img src={userAvatar} alt="" className="w-10 h-10 rounded-full object-cover shrink-0 border border-gemini-border" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                      {(userName[0] || 'Z').toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold text-white truncate">
                      {userName}
                    </div>
                    {userEmail && (
                      <div className="text-[11px] text-gray-400 truncate mt-0.5">
                        {userEmail}
                      </div>
                    )}
                  </div>
                </div>

                {/* 5. Switch account option: calls supabase.auth.signOut() and shows login */}
                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    onSwitchAccount();
                  }}
                  className="w-full text-left px-4 py-2.5 text-xs text-sky-300 hover:bg-gemini-elevated hover:text-sky-200 flex items-center gap-2.5 transition"
                >
                  <RefreshCw size={14} className="text-sky-400" />
                  <span>Switch account</span>
                </button>

                {/* Sign out */}
                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    onSignOut();
                  }}
                  className="w-full text-left px-4 py-2.5 text-xs text-red-400 hover:bg-gemini-elevated flex items-center gap-2.5 transition border-t border-gemini-border/60"
                >
                  <LogOut size={14} />
                  <span>Sign out</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={onOpenSignIn}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white hover:bg-gray-100 text-gray-900 text-xs font-medium transition shadow-sm"
          >
            <GoogleGIcon className="w-3.5 h-3.5" />
            <span>Sign in</span>
          </button>
        )}
      </div>
    </header>
  );
}
