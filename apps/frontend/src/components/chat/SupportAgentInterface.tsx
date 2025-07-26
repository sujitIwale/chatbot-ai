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

interface SupportAgentInterfaceProps {
  sessionId: string;
  supportUserId: string;
  onClose?: () => void;
  className?: string;
}

const SupportAgentInterface: React.FC<SupportAgentInterfaceProps> = ({
  sessionId,
  supportUserId,
  onClose,
  className = "",
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionInfo, setSessionInfo] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadChatData();
    // Set up polling for new messages
    const interval = setInterval(loadChatHistory, 5000);
    return () => clearInterval(interval);
  }, [sessionId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadChatData = async () => {
    try {
      await Promise.all([loadChatHistory(), loadSessionInfo()]);
    } catch (error) {
      console.error("Error loading chat data:", error);
    }
  };

  const loadChatHistory = async () => {
    try {
      const history = await chatbotApi.getChatHistory(sessionId);
      setMessages(history);
    } catch (error) {
      console.error("Error loading chat history:", error);
    }
  };

  const loadSessionInfo = async () => {
    try {
      const info = await chatbotApi.getSessionInfo(sessionId);
      setSessionInfo(info);
    } catch (error) {
      console.error("Error loading session info:", error);
    }
  };

  const sendSupportMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const messageContent = inputMessage.trim();
    setInputMessage("");
    setIsLoading(true);

    // Add message to UI immediately
    const tempMessage: Message = {
      id: `temp_${Date.now()}`,
      content: messageContent,
      sender: "SUPPORT",
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempMessage]);

    try {
      const response = await chatbotApi.sendSupportMessage(sessionId, {
        message: messageContent,
        supportUserId,
      });

      // Remove temp message and add real message
      setMessages((prev) => prev.filter((msg) => msg.id !== tempMessage.id));
      setMessages((prev) => [...prev, response]);
    } catch (error) {
      console.error("Error sending support message:", error);
      // Remove temp message on error
      setMessages((prev) => prev.filter((msg) => msg.id !== tempMessage.id));

      // Show error message
      alert("Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendSupportMessage();
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
        return "Customer";
      case "AGENT":
        return "AI Assistant";
      case "SUPPORT":
        return message.supportAgent?.name || "You";
      default:
        return "System";
    }
  };

  const getSenderColor = (sender: string) => {
    switch (sender) {
      case "USER":
        return "bg-blue-100 text-blue-800 border border-blue-200";
      case "AGENT":
        return "bg-gray-100 text-gray-800 border border-gray-200";
      case "SUPPORT":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-50 text-gray-600";
    }
  };

  return (
    <div
      className={`flex flex-col h-full bg-white border rounded-lg shadow-lg ${className}`}
    >
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b bg-green-50 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Support Chat
            </h3>
            <div className="text-sm text-gray-600">
              Session ID: {sessionId}
              {sessionInfo?.userId && ` • Customer: ${sessionInfo.userId}`}
            </div>
          </div>
          {onClose && (
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>Loading chat history...</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "SUPPORT" ? "justify-end" : "justify-start"
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
                    message.sender === "SUPPORT"
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
            placeholder="Type your response to the customer..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={sendSupportMessage}
            disabled={isLoading || !inputMessage.trim()}
            className="px-6 bg-green-600 hover:bg-green-700"
          >
            {isLoading ? "Sending..." : "Send"}
          </Button>
        </div>
        <div className="mt-2 text-xs text-gray-600">
          You are responding as a support agent to help resolve this customer's
          issue.
        </div>
      </div>
    </div>
  );
};

export default SupportAgentInterface;
