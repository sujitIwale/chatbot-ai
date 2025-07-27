import { createContext, useContext } from 'react';

export interface IChatBot {
  id: string;
  name: string;
  description?: string;
  instructions: string;
  context?: string;
  deployed: boolean;
  deployedAt?: string;
  createdAt: string;
  updatedAt: string;
  hasIssues?: boolean;
  owner: {
    id: string;
    name: string;
    email: string;
  };
}

interface ChatbotContextType {
  chatbot: IChatBot | null;
  loading: boolean;
  error: string | null;
  fetchChatbot: () => Promise<void>;
  refetchChatbot: () => Promise<void>;
}

export const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

export const useChatbot = () => {
  const context = useContext(ChatbotContext);
  if (context === undefined) {
    throw new Error('useChatbot must be used within a ChatbotProvider');
  }
  return context;
};
