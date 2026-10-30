import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const GUEST_USER = {
  id: 'guest-user',
  email: 'guest@speaker.ai',
  user_metadata: { name: 'Guest User' },
};

const GUEST_SESSION = {
  access_token: 'guest-session-token',
  user: GUEST_USER,
};

export function useAuth() {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setUser(GUEST_USER);
      setSession(GUEST_SESSION);
      setLoading(false);
      return;
    }
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  const signIn = useCallback(async (provider) => {
    if (!isSupabaseConfigured()) {
      const name =
        provider === 'google'
          ? 'Google User'
          : provider === 'discord'
          ? 'Discord User'
          : 'Zentra User';

      const mockUser = {
        id: `user-${provider}`,
        email: `${provider}.user@speaker.ai`,
        user_metadata: {
          name,
          avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${provider}&backgroundColor=6366f1`,
        },
      };
      setUser(mockUser);
      setSession({ access_token: `guest-${provider}-token`, user: mockUser });
      return mockUser;
    }

    const options = {
      redirectTo: window.location.origin,
    };

    if (provider === 'google') {
      options.queryParams = { prompt: 'select_account' };
    } else if (provider === 'discord') {
      options.queryParams = { prompt: 'consent' };
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options,
    });
    if (error) throw error;
  }, []);

  const signOut = useCallback(async () => {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setSession(null);
  }, []);

  const switchAccount = useCallback(async () => {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setSession(null);
  }, []);

  return { user, session, loading, signIn, signOut, switchAccount, isConfigured: isSupabaseConfigured() };
}
