import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

type Message = Tables<'messages'>;

export const useChatHistory = (userId?: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      loadMessages();
    } else {
      setMessages([]);
      setLoading(false);
    }
  }, [userId]);

  const loadMessages = async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setMessages(data || []);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveMessage = async (content: string, isAi: boolean, imageUrl?: string) => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          content,
          is_ai: isAi,
          user_id: userId,
          image_url: imageUrl,
        })
        .select()
        .single();

      if (error) throw error;

      setMessages(prev => [...prev, data]);
      return data;
    } catch (error) {
      console.error('Error saving message:', error);
      throw error;
    }
  };

  const clearHistory = async () => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;

      setMessages([]);
    } catch (error) {
      console.error('Error clearing history:', error);
      throw error;
    }
  };

  return {
    messages,
    loading,
    saveMessage,
    clearHistory,
    loadMessages,
  };
};