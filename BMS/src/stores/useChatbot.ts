import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';

type ChatbotRequest = {
  message: string;
};

type ChatbotResponse = {
  reply: string;
};

export const useChatbot = () => {
  return useMutation<ChatbotResponse, Error, ChatbotRequest>({
    mutationFn: (data) => api.post('/api/chatbot/query/', data).then(res => res.data),
  });
};
