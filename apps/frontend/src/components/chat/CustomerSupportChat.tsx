import React, { useState, useEffect, useRef } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { chatbotApi } from "../../lib/api/chatbot";

interface Message {
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

interface CustomerSupportChatProps {
  chatbotId: string;
  sessionId?: string;
  onSessionChange?: (sessionId: string) => void;
  className?: string;
}

const CustomerSupportChat: React.FC<CustomerSupportChatProps> = ({
  chatbotId,
  sessionId: initialSessionId,
  onSessionChange,
  className = "",
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(
    initialSessionId || chatbotApi.generateSessionId()
  );
  const [isEscalated, setIsEscalated] = useState(false);
  const [assignedAgent, setAssignedAgent] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (onSessionChange) {
      onSessionChange(sessionId);
    }
  }, [sessionId, onSessionChange]);

  useEffect(() => {
    loadChatHistory();
  }, [sessionId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadChatHistory = async () => {
    try {
      const history = await chatbotApi.getChatHistory(sessionId);
      setMessages(history);

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
      }
    } catch (error) {
      console.error("Error loading chat history:", error);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage("");
    setIsLoading(true);

    // Add user message to UI immediately
    const tempUserMessage: Message = {
      id: `temp_${Date.now()}`,
      content: userMessage,
      sender: "USER",
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMessage]);

    try {
      const response = await chatbotApi.sendMessage(chatbotId, {
        message: userMessage,
        sessionId,
        userId: "anonymous", // You can customize this
      });

      // Remove temp message and add real messages
      setMessages((prev) =>
        prev.filter((msg) => msg.id !== tempUserMessage.id)
      );

      // Add agent response
      const agentMessage: Message = {
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
        const systemMessage: Message = {
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
      const errorMessage: Message = {
        id: `error_${Date.now()}`,
        content: "Sorry, I couldn't send your message. Please try again.",
        sender: "AGENT",
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getSenderLabel = (message: Message) => {
    switch (message.sender) {
      case "USER":
        return "You";
      case "AGENT":
        return "AI Assistant";
      case "SUPPORT":
        return message.supportAgent?.name || "Support Agent";
      default:
        return "System";
    }
  };

  const getSenderColor = (sender: string) => {
    switch (sender) {
      case "USER":
        return "bg-blue-500 text-white";
      case "AGENT":
        return "bg-gray-200 text-gray-800";
      case "SUPPORT":
        return "bg-green-200 text-green-800";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div
      className={`flex flex-col h-full bg-white border rounded-lg shadow-sm ${className}`}
    >
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b bg-gray-50 rounded-t-lg">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Customer Support
          </h3>
          <div className="text-sm text-gray-500">
            {isEscalated ? (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>
                  Connected to {assignedAgent?.name || "Support Team"}
                </span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span>AI Assistant</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>👋 Hi! I'm here to help you with any questions or issues.</p>
            <p className="text-sm mt-2">
              Type your message below to get started.
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "USER" ? "justify-end" : "justify-start"
              }`}
            >
              <div className="max-w-xs lg:max-w-md">
                <div className="text-xs text-gray-500 mb-1">
                  {getSenderLabel(message)} • {formatTime(message.createdAt)}
                </div>
                <div
                  className={`px-4 py-2 rounded-lg ${getSenderColor(
                    message.sender
                  )} ${
                    message.sender === "USER"
                      ? "rounded-br-none"
                      : "rounded-bl-none"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">
                    {message.content}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex-shrink-0 p-4 border-t bg-gray-50">
        <div className="flex space-x-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              isEscalated
                ? `Message ${assignedAgent?.name || "support agent"}...`
                : "Type your message..."
            }
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={sendMessage}
            disabled={isLoading || !inputMessage.trim()}
            className="px-6"
          >
            {isLoading ? "Sending..." : "Send"}
          </Button>
        </div>
        {isEscalated && assignedAgent && (
          <div className="mt-2 text-xs text-gray-600">
            Your conversation has been transferred to {assignedAgent.name} (
            {assignedAgent.email})
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerSupportChat;
