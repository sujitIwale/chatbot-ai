import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { chatbotApi } from "../../lib/api/chatbot";
import {
  Loader2,
  AlertCircle,
  Bot,
  Rocket,
  Calendar,
  User,
  MessageSquare,
  Copy,
  ExternalLink,
  Settings,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import ChatbotNavigation from "../../components/navigation/ChatbotNavigation";
import ChatWidget from "../../components/chat/ChatWidget";

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
  const [deployStatus, setDeployStatus] = useState<
    "idle" | "deploying" | "deployed"
  >("idle");

  useEffect(() => {
    if (id) {
      fetchChatbot();
    } else {
      navigate("/dashboard");
    }
  }, [id, navigate]);

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
          <Button onClick={() => navigate("/dashboard")} variant="outline">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ChatbotNavigation chatbotId={chatbot.id} chatbotName={chatbot.name} />

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Chatbot Details */}
          <div className="space-y-6">
            {/* Chatbot Info Card */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                    <Bot className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      {chatbot.name}
                    </h1>
                    <p className="text-sm text-gray-500">
                      AI Assistant • Active
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleDeploy}
                  disabled={deployStatus !== "idle"}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-xl px-6 py-3"
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
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-green-800 font-medium">
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
                      className="rounded-lg"
                    >
                      <Copy className="w-3 h-3 mr-1" />
                      Copy Link
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-6">
                {/* Description */}
                {chatbot.description && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <MessageSquare className="w-4 h-4 mr-2 text-blue-500" />
                      Description
                    </h3>
                    <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-xl leading-relaxed">
                      {chatbot.description}
                    </p>
                  </div>
                )}

                {/* Instructions */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <Settings className="w-4 h-4 mr-2 text-purple-500" />
                    Agent Instructions
                  </h3>
                  <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-xl max-h-32 overflow-y-auto leading-relaxed">
                    {chatbot.instructions}
                  </div>
                </div>

                {/* Context */}
                {chatbot.context && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <Bot className="w-4 h-4 mr-2 text-green-500" />
                      Context Information
                    </h3>
                    <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-xl max-h-32 overflow-y-auto leading-relaxed">
                      {chatbot.context}
                    </div>
                  </div>
                )}

                {/* Metadata */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center text-sm text-gray-600">
                    <User className="w-4 h-4 mr-2 text-blue-500" />
                    <span>
                      Created by {chatbot.owner.name || chatbot.owner.email}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2 text-purple-500" />
                    <span>
                      Created {new Date(chatbot.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Chat Widget */}
          <div>
            <ChatWidget chatbotName={chatbot.name} chatbotId={chatbot.id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
