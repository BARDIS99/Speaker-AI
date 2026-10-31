import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const LOCAL_STORAGE_KEY = 'speaker_ai_chats';

function getLocalChats() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalChats(chats) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(chats));
  } catch {}
}

export function useChats(user) {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);

  const isGuest = !supabase || !user || user.id === 'guest-user';

  const loadChats = useCallback(async () => {
    if (!user) {
      setChats(getLocalChats());
      return;
    }
    if (isGuest) {
      setChats(getLocalChats());
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('chats')
        .select('*')
        .order('pinned', { ascending: false })
        .order('updated_at', { ascending: false });
      if (error || !data) {
        setChats(getLocalChats());
      } else {
        setChats(data);
      }
    } catch {
      setChats(getLocalChats());
    } finally {
      setLoading(false);
    }
  }, [user, isGuest]);

  useEffect(() => {
    loadChats();
  }, [loadChats]);

  const createChat = useCallback(async (title = 'New Chat') => {
    const newChat = {
      id: crypto.randomUUID(),
      user_id: user?.id || 'guest-user',
      title,
      pinned: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (isGuest) {
      setChats((prev) => {
        const next = [newChat, ...prev];
        saveLocalChats(next);
        return next;
      });
      return newChat;
    }

    try {
      const { data, error } = await supabase
        .from('chats')
        .insert({ user_id: user.id, title })
        .select()
        .single();
      if (error || !data) {
        setChats((prev) => {
          const next = [newChat, ...prev];
          saveLocalChats(next);
          return next;
        });
        return newChat;
      }
      setChats((prev) => [data, ...prev]);
      return data;
    } catch {
      setChats((prev) => {
        const next = [newChat, ...prev];
        saveLocalChats(next);
        return next;
      });
      return newChat;
    }
  }, [user, isGuest]);

  const renameChat = useCallback(async (id, title) => {
    if (isGuest) {
      setChats((prev) => {
        const next = prev.map((c) => (c.id === id ? { ...c, title, updated_at: new Date().toISOString() } : c));
        saveLocalChats(next);
        return next;
      });
      return;
    }
    try {
      const { error } = await supabase.from('chats').update({ title }).eq('id', id);
      if (error) throw error;
      setChats((prev) => prev.map((c) => (c.id === id ? { ...c, title } : c)));
    } catch {
      setChats((prev) => {
        const next = prev.map((c) => (c.id === id ? { ...c, title, updated_at: new Date().toISOString() } : c));
        saveLocalChats(next);
        return next;
      });
    }
  }, [isGuest]);

  const togglePin = useCallback(async (id, pinned) => {
    if (isGuest) {
      setChats((prev) => {
        const next = prev
          .map((c) => (c.id === id ? { ...c, pinned } : c))
          .sort((a, b) => (b.pinned - a.pinned) || (new Date(b.updated_at) - new Date(a.updated_at)));
        saveLocalChats(next);
        return next;
      });
      return;
    }
    try {
      const { error } = await supabase.from('chats').update({ pinned }).eq('id', id);
      if (error) throw error;
      setChats((prev) => {
        const updated = prev.map((c) => (c.id === id ? { ...c, pinned } : c));
        return updated.sort((a, b) => (b.pinned - a.pinned) || (new Date(b.updated_at) - new Date(a.updated_at)));
      });
    } catch {
      setChats((prev) => {
        const next = prev
          .map((c) => (c.id === id ? { ...c, pinned } : c))
          .sort((a, b) => (b.pinned - a.pinned) || (new Date(b.updated_at) - new Date(a.updated_at)));
        saveLocalChats(next);
        return next;
      });
    }
  }, [isGuest]);

  const deleteChat = useCallback(async (id) => {
    if (isGuest) {
      setChats((prev) => {
        const next = prev.filter((c) => c.id !== id);
        saveLocalChats(next);
        return next;
      });
      return;
    }
    try {
      const { error } = await supabase.from('chats').delete().eq('id', id);
      if (error) throw error;
      setChats((prev) => prev.filter((c) => c.id !== id));
    } catch {
      setChats((prev) => {
        const next = prev.filter((c) => c.id !== id);
        saveLocalChats(next);
        return next;
      });
    }
  }, [isGuest]);

  const searchChats = useCallback((query) => {
    if (!query.trim()) return chats;
    const q = query.toLowerCase();
    return chats.filter((c) => c.title.toLowerCase().includes(q));
  }, [chats]);

  return { chats, loading, createChat, renameChat, togglePin, deleteChat, searchChats, reload: loadChats };
}
