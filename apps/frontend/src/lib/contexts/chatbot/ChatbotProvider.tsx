import React, { useState, useEffect, ReactNode } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { chatbotApi } from "../../api/chatbot";
import { ChatbotContext, IChatBot } from "./ChatbotContext";

interface ChatbotProviderProps {
  children: ReactNode;
}

export const ChatbotProvider: React.FC<ChatbotProviderProps> = ({
  children,
}) => {
  const { chatbotId } = useParams<{ chatbotId: string }>();
  const navigate = useNavigate();
  const [chatbot, setChatbot] = useState<IChatBot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChatbot = async () => {
    if (!chatbotId) {
      navigate("/dashboard");
      return;
    }

    try {
      setLoading(true);
      const data = await chatbotApi.getChatbot(chatbotId);
      setChatbot(data);
      setError(null);
    } catch (err) {
      setError("Failed to load chatbot. Please try again.");
      console.error("Error fetching chatbot:", err);
    } finally {
      setLoading(false);
    }
  };

  const refetchChatbot = async () => {
    if (!chatbotId) return;
    await fetchChatbot();
  };

  useEffect(() => {
    fetchChatbot();
  }, [chatbotId]);

  const value = {
    chatbot,
    loading,
    error,
    fetchChatbot,
    refetchChatbot,
  };

  return (
    <ChatbotContext.Provider value={value}>{children}</ChatbotContext.Provider>
  );
};

export default ChatbotProvider;
