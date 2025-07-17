import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useGeminiAPI = () => {
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (message: string, imageUrl?: string) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('gemini-chat', {
        body: {
          message,
          imageUrl,
        },
      });

      if (error) throw error;

      return data.response;
    } catch (error: any) {
      console.error('Error calling Gemini API:', error);
      throw new Error(error.message || 'Failed to get response from AI');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendMessage,
    isLoading,
  };
};