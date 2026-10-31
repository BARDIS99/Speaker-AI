import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

function getLocalMessages(chatId) {
  try {
    const raw = localStorage.getItem(`speaker_ai_messages_${chatId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalMessages(chatId, messages) {
  try {
    localStorage.setItem(`speaker_ai_messages_${chatId}`, JSON.stringify(messages));
  } catch {}
}

export function useMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadMessages = useCallback(async (chatId) => {
    if (!chatId) {
      setMessages([]);
      return;
    }
    if (!supabase) {
      setMessages(getLocalMessages(chatId));
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true });
      if (error || !data) {
        setMessages(getLocalMessages(chatId));
      } else {
        setMessages(data);
      }
    } catch {
      setMessages(getLocalMessages(chatId));
    } finally {
      setLoading(false);
    }
  }, []);

  const addMessage = useCallback(async (chatId, role, content, model = null) => {
    const local = { id: crypto.randomUUID(), chat_id: chatId, role, content, model, created_at: new Date().toISOString() };
    if (!supabase) {
      setMessages((prev) => {
        const next = [...prev, local];
        if (chatId) saveLocalMessages(chatId, next);
        return next;
      });
      return local;
    }
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({ chat_id: chatId, role, content, model })
        .select()
        .single();
      if (error || !data) {
        setMessages((prev) => {
          const next = [...prev, local];
          if (chatId) saveLocalMessages(chatId, next);
          return next;
        });
        return local;
      }
      setMessages((prev) => [...prev, data]);
      await supabase.from('chats').update({ updated_at: new Date().toISOString() }).eq('id', chatId).catch(() => {});
      return data;
    } catch {
      setMessages((prev) => {
        const next = [...prev, local];
        if (chatId) saveLocalMessages(chatId, next);
        return next;
      });
      return local;
    }
  }, []);

  const clearMessages = useCallback(() => setMessages([]), []);

  return { messages, setMessages, loading, loadMessages, addMessage, clearMessages };
}
