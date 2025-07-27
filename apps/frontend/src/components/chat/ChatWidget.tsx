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
  onSessionChange?: (sessionId: string) => void;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({
  chatbotName,
  chatbotId,
  initialMessage = "Hello! I'm your AI assistant. How can I help you today?",
  onSessionChange,
}) => {
  // Helper function to get localStorage key
  const getStorageKey = (chatbotId: string) => `chatbot_session_${chatbotId}`;

  // Helper function to get or create sessionId
  const getOrCreateSessionId = (chatbotId: string) => {
    const storageKey = getStorageKey(chatbotId);
    const existingSessionId = localStorage.getItem(storageKey);

    if (existingSessionId) {
      console.log("Resuming existing session:", existingSessionId);
      return existingSessionId;
    } else {
      const newSessionId = chatbotApi.generateSessionId();
      localStorage.setItem(storageKey, newSessionId);
      console.log("Created new session:", newSessionId);
      return newSessionId;
    }
  };

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [sessionId] = useState(() => getOrCreateSessionId(chatbotId));
  const [isEscalated, setIsEscalated] = useState(false);
  const [assignedAgent, setAssignedAgent] = useState<any>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (onSessionChange) {
      onSessionChange(sessionId);
    }
    // Update localStorage whenever sessionId changes
    localStorage.setItem(getStorageKey(chatbotId), sessionId);
  }, [sessionId, onSessionChange, chatbotId]);

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
        // Load existing conversation
        setMessages(history);
        console.log("Loaded chat history:", history.length, "messages");
      } else {
        // No history found, show initial message for new conversation
        const initialWelcomeMessage: ChatMessage = {
          id: "welcome_1",
          content: initialMessage,
          sender: "AGENT",
          createdAt: new Date().toISOString(),
        };
        setMessages([initialWelcomeMessage]);
        console.log("No chat history found, showing welcome message");
      }

      // Check if session is escalated
      const sessionInfo = await chatbotApi.getSessionInfo(sessionId);
      if (sessionInfo.handedOff && sessionInfo.tickets.length > 0) {
        setIsEscalated(true);
        const activeTicket = sessionInfo.tickets.find(
          (ticket: any) => ticket.assignedUser
        );
        if (activeTicket) {
          setAssignedAgent(activeTicket.assignedUser);
        }
        console.log(
          "Session is escalated to:",
          assignedAgent?.name || "Support Team"
        );
      }
    } catch (error) {
      console.error("Error loading chat history:", error);
      // Show initial message on error
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

    // Add user message to UI immediately
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

      // Remove temp message and add real messages
      setMessages((prev) =>
        prev.filter((msg) => msg.id !== tempUserMessage.id)
      );

      // Add agent response
      const agentMessage: ChatMessage = {
        id: `agent_${Date.now()}`,
        content: response.response,
        sender: "AGENT",
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, tempUserMessage, agentMessage]);

      // Handle escalation
      if (response.escalated) {
        setIsEscalated(true);
        if (response.assignedTo) {
          setAssignedAgent(response.assignedTo);
        }

        // Add system message about escalation
        const systemMessage: ChatMessage = {
          id: `system_${Date.now()}`,
          content:
            response.message ||
            "Your query has been escalated to our support team.",
          sender: "AGENT",
          createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, systemMessage]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      // Remove temp message on error
      setMessages((prev) =>
        prev.filter((msg) => msg.id !== tempUserMessage.id)
      );

      // Add error message
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
        {/* Modern Chat Header */}
        <div
          className={`p-6 ${
            isEscalated
              ? "bg-gradient-to-r from-green-600 to-emerald-600"
              : "bg-gradient-to-r from-blue-600 to-purple-600"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <span className="text-white font-semibold text-lg">
                  {isEscalated
                    ? assignedAgent?.name?.charAt(0) || "S"
                    : chatbotName.charAt(0)}
                </span>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">
                  {isEscalated
                    ? assignedAgent?.name || "Support Agent"
                    : chatbotName}
                </h2>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-blue-100 text-sm">
                    {isEscalated
                      ? "Connected to Support • Live Chat"
                      : "Online • AI Assistant"}
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
                placeholder={
                  isEscalated
                    ? `Message ${assignedAgent?.name || "support agent"}...`
                    : "Ask me anything..."
                }
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
          {isEscalated && assignedAgent && (
            <div className="mt-2 text-xs text-gray-600 text-center">
              Your conversation has been transferred to {assignedAgent.name} (
              {assignedAgent.email})
            </div>
          )}
          <p className="text-xs text-gray-400 mt-2 text-center">
            Press Enter to send •{" "}
            {isEscalated ? "Live Support" : "Powered by AI"}
            {messages.length > 1 &&
              localStorage.getItem(getStorageKey(chatbotId)) && (
                <span className="ml-2">• 💾 Session saved</span>
              )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatWidget;
