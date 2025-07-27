import React, { useState, useEffect, useRef } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Send, Loader2 } from "lucide-react";
import { chatbotApi } from "../../lib/api/chatbot";

interface ChatMessage {
  id: string;
  content: string;
  sender: "USER" | "AGENT" | "SUPPORT";
  createdAt: string;
  supportAgent?: {
    id: string;
    name: string;
    email: string;
  };
}

interface ChatWidgetProps {
  chatbotName: string;
  chatbotId: string;
  initialMessage?: string;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({
  chatbotName,
  chatbotId,
  initialMessage = "Hello! I'm your AI assistant. How can I help you today?",
}) => {
  const sessionId = `admin_${chatbotId}`;
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadChatHistory();
  }, [sessionId, chatbotId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadChatHistory = async () => {
    try {
      const history = await chatbotApi.getChatHistory(sessionId);

      if (history.length > 0) {
        setMessages(history);
        console.log("Loaded chat history:", history.length, "messages");
      } else {
        const initialWelcomeMessage: ChatMessage = {
          id: "welcome_1",
          content: initialMessage,
          sender: "AGENT",
          createdAt: new Date().toISOString(),
        };
        setMessages([initialWelcomeMessage]);
        console.log("No chat history found, showing welcome message");
      }
    } catch (error) {
      console.error("Error loading chat history:", error);
      const initialWelcomeMessage: ChatMessage = {
        id: "welcome_1",
        content: initialMessage,
        sender: "AGENT",
        createdAt: new Date().toISOString(),
      };
      setMessages([initialWelcomeMessage]);
    } finally {
      setIsInitialized(true);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || sendingMessage) return;

    const userMessageContent = inputMessage.trim();
    setInputMessage("");
    setSendingMessage(true);

    const tempUserMessage: ChatMessage = {
      id: `temp_${Date.now()}`,
      content: userMessageContent,
      sender: "USER",
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMessage]);

    try {
      const response = await chatbotApi.sendMessage(chatbotId, {
        message: userMessageContent,
        sessionId,
        userId: "anonymous",
      });

      setMessages((prev) =>
        prev.filter((msg) => msg.id !== tempUserMessage.id)
      );

      const agentMessage: ChatMessage = {
        id: `agent_${Date.now()}`,
        content: response.response,
        sender: "AGENT",
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, tempUserMessage, agentMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) =>
        prev.filter((msg) => msg.id !== tempUserMessage.id)
      );

      const errorMessage: ChatMessage = {
        id: `error_${Date.now()}`,
        content: "Sorry, I couldn't send your message. Please try again.",
        sender: "AGENT",
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setSendingMessage(false);
    }
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <span className="text-white font-semibold text-lg">
                  {chatbotName.charAt(0)}
                </span>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">
                  {chatbotName}
                </h2>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-blue-100 text-sm">
                    Online • AI Assistant
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Messages Container */}
        <div className="h-96 overflow-y-auto p-6 bg-gray-50/50 space-y-4">
          {!isInitialized ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-500">Loading conversation...</p>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "USER" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                    message.sender === "USER"
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white ml-12"
                      : message.sender === "SUPPORT"
                      ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white mr-12"
                      : "bg-white text-gray-800 mr-12 border border-gray-100"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <p
                    className={`text-xs mt-2 ${
                      message.sender === "USER" || message.sender === "SUPPORT"
                        ? "text-blue-100"
                        : "text-gray-400"
                    }`}
                  >
                    {new Date(message.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))
          )}
          {sendingMessage && (
            <div className="flex justify-start">
              <div className="bg-white text-gray-800 px-4 py-3 rounded-2xl shadow-sm mr-12 border border-gray-100">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-500">
                    AI is thinking...
                  </span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Modern Input */}
        <div className="p-6 bg-white">
          <form onSubmit={handleSendMessage} className="flex space-x-3">
            <div className="flex-1 relative">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask me anything..."
                className="w-full pr-4 py-3 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-sm"
                disabled={sendingMessage}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
              />
            </div>
            <Button
              type="submit"
              disabled={!inputMessage.trim() || sendingMessage}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl shadow-md transition-all duration-200 transform hover:scale-105"
            >
              {sendingMessage ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </form>
          <p className="text-xs text-gray-400 mt-2 text-center">
            Press Enter to send • "Powered by AI"
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatWidget;
