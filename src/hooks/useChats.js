import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export function useChats(user) {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadChats = useCallback(async () => {
    if (!user || !supabase) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('chats')
      .select('*')
      .order('pinned', { ascending: false })
      .order('updated_at', { ascending: false });
    if (!error) setChats(data || []);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    loadChats();
  }, [loadChats]);

  const createChat = useCallback(async (title = 'New Chat') => {
    if (!user || !supabase) return null;
    const { data, error } = await supabase
      .from('chats')
      .insert({ user_id: user.id, title })
      .select()
      .single();
    if (error) throw error;
    setChats((prev) => [data, ...prev]);
    return data;
  }, [user]);

  const renameChat = useCallback(async (id, title) => {
    if (!supabase) return;
    const { error } = await supabase.from('chats').update({ title }).eq('id', id);
    if (!error) setChats((prev) => prev.map((c) => (c.id === id ? { ...c, title } : c)));
  }, []);

  const togglePin = useCallback(async (id, pinned) => {
    if (!supabase) return;
    const { error } = await supabase.from('chats').update({ pinned }).eq('id', id);
    if (!error) {
      setChats((prev) => {
        const updated = prev.map((c) => (c.id === id ? { ...c, pinned } : c));
        return updated.sort((a, b) => (b.pinned - a.pinned) || new Date(b.updated_at) - new Date(a.updated_at));
      });
    }
  }, []);

  const deleteChat = useCallback(async (id) => {
    if (!supabase) return;
    const { error } = await supabase.from('chats').delete().eq('id', id);
    if (!error) setChats((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const searchChats = useCallback((query) => {
    if (!query.trim()) return chats;
    const q = query.toLowerCase();
    return chats.filter((c) => c.title.toLowerCase().includes(q));
  }, [chats]);

  return { chats, loading, createChat, renameChat, togglePin, deleteChat, searchChats, reload: loadChats };
}
