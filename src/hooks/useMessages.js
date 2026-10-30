import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export function useMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadMessages = useCallback(async (chatId) => {
    if (!chatId || !supabase) {
      setMessages([]);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true });
    if (!error) setMessages(data || []);
    setLoading(false);
  }, []);

  const addMessage = useCallback(async (chatId, role, content, model = null) => {
    if (!supabase) {
      const local = { id: crypto.randomUUID(), chat_id: chatId, role, content, model, created_at: new Date().toISOString() };
      setMessages((prev) => [...prev, local]);
      return local;
    }
    const { data, error } = await supabase
      .from('messages')
      .insert({ chat_id: chatId, role, content, model })
      .select()
      .single();
    if (error) throw error;
    setMessages((prev) => [...prev, data]);
    // Touch chat updated_at
    await supabase.from('chats').update({ updated_at: new Date().toISOString() }).eq('id', chatId);
    return data;
  }, []);

  const clearMessages = useCallback(() => setMessages([]), []);

  return { messages, setMessages, loading, loadMessages, addMessage, clearMessages };
}
