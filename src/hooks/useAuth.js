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
      const mockUser = {
        id: `guest-${provider}`,
        email: `${provider}-user@speaker.ai`,
        user_metadata: { name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User` },
      };
      setUser(mockUser);
      setSession({ access_token: `guest-${provider}-token`, user: mockUser });
      return;
    }
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: window.location.origin },
    });
    if (error) throw error;
  }, []);

  const signOut = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setUser(null);
      setSession(null);
      return;
    }
    await supabase.auth.signOut();
  }, []);

  return { user, session, loading, signIn, signOut, isConfigured: isSupabaseConfigured() };
}
