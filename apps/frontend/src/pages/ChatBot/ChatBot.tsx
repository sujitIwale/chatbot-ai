import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { chatbotApi } from "../../lib/api/chatbot";
import {
  Bot,
  Send,
  Settings,
  Rocket,
  Calendar,
  User,
  MessageSquare,
  Copy,
  ExternalLink,
  Loader2,
  AlertCircle,
} from "lucide-react";

interface ChatMessage {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
}

interface IChatBot {
  id: string;
  name: string;
  description?: string;
  instructions: string;
  context?: string;
  createdAt: string;
  updatedAt: string;
  owner: {
    id: string;
    name: string;
    email: string;
  };
}

const ChatBot = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [chatbot, setChatbot] = useState<IChatBot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      content: "Hello! I'm your AI assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [deployStatus, setDeployStatus] = useState<
    "idle" | "deploying" | "deployed"
  >("idle");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) {
      fetchChatbot();
    } else {
      navigate("/chatbots");
    }
  }, [id, navigate]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchChatbot = async () => {
    try {
      setLoading(true);
      const data = await chatbotApi.getChatbot(id!);
      setChatbot(data);
      setError(null);
    } catch (err) {
      setError("Failed to load chatbot. Please try again.");
      console.error("Error fetching chatbot:", err);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || sendingMessage) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputMessage.trim(),
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setSendingMessage(true);

    // Simulate bot response (replace with actual API call later)
    setTimeout(() => {
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: `Thank you for your message: "${userMessage.content}". This is a simulated response based on the chatbot's instructions.`,
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setSendingMessage(false);
    }, 1000);
  };

  const handleDeploy = async () => {
    setDeployStatus("deploying");
    // Simulate deployment process
    setTimeout(() => {
      setDeployStatus("deployed");
      setTimeout(() => setDeployStatus("idle"), 3000);
    }, 2000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading chatbot...</p>
        </div>
      </div>
    );
  }

  if (error || !chatbot) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {error || "Chatbot not found"}
          </h2>
          <Button onClick={() => navigate("/chatbots")} variant="outline">
            Back to Chatbots
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex bg-gray-50">
      {/* Left Side - Chatbot Details */}
      <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Bot className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {chatbot.name}
                </h1>
                <p className="text-sm text-gray-500">Active</p>
              </div>
            </div>
            <Button
              onClick={handleDeploy}
              disabled={deployStatus !== "idle"}
              className="bg-green-600 hover:bg-green-700"
            >
              {deployStatus === "deploying" ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deploying...
                </>
              ) : deployStatus === "deployed" ? (
                <>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Deployed
                </>
              ) : (
                <>
                  <Rocket className="w-4 h-4 mr-2" />
                  Deploy
                </>
              )}
            </Button>
          </div>

          {deployStatus === "deployed" && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-800">
                  🎉 Successfully deployed!
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    copyToClipboard(
                      `${window.location.origin}/chat/${chatbot.id}`
                    )
                  }
                >
                  <Copy className="w-3 h-3 mr-1" />
                  Copy Link
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Description */}
            {chatbot.description && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Description
                </h3>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  {chatbot.description}
                </p>
              </div>
            )}

            {/* Instructions */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Settings className="w-4 h-4 mr-2" />
                Agent Instructions
              </h3>
              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg max-h-32 overflow-y-auto">
                {chatbot.instructions}
              </div>
            </div>

            {/* Context */}
            {chatbot.context && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Bot className="w-4 h-4 mr-2" />
                  Context Information
                </h3>
                <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg max-h-32 overflow-y-auto">
                  {chatbot.context}
                </div>
              </div>
            )}

            {/* Metadata */}
            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <User className="w-4 h-4 mr-2" />
                <span>
                  Created by {chatbot.owner.name || chatbot.owner.email}
                </span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                <span>
                  Created {new Date(chatbot.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Chat Interface */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Test Chat with {chatbot.name}
            </h2>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-sm text-gray-600">Online</span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.sender === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p
                  className={`text-xs mt-1 ${
                    message.sender === "user"
                      ? "text-blue-100"
                      : "text-gray-500"
                  }`}
                >
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          {sendingMessage && (
            <div className="flex justify-start">
              <div className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Typing...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="bg-white border-t border-gray-200 p-4">
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
              disabled={sendingMessage}
            />
            <Button
              type="submit"
              disabled={!inputMessage.trim() || sendingMessage}
              className="px-4"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
