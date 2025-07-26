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
  Settings,
  CheckCircle,
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
  deployed: boolean;
  deployedAt?: string;
  createdAt: string;
  updatedAt: string;
  owner: {
    id: string;
    name: string;
    email: string;
  };
}

const ChatBot = () => {
  const { chatbotId } = useParams<{ chatbotId: string }>();
  const navigate = useNavigate();
  const [chatbot, setChatbot] = useState<IChatBot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deployStatus, setDeployStatus] = useState<
    "idle" | "deploying" | "deployed" | "error"
  >("idle");
  const [currentSessionId, setCurrentSessionId] = useState<string>("");

  useEffect(() => {
    if (chatbotId) {
      fetchChatbot();
    } else {
      // navigate("/dashboard");
    }
  }, [chatbotId, navigate]);

  const fetchChatbot = async () => {
    try {
      setLoading(true);
      const data = await chatbotApi.getChatbot(chatbotId!);
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
    if (!chatbot || chatbot.deployed) return;

    try {
      setDeployStatus("deploying");
      await chatbotApi.deployChatbot(chatbot.id, {
        name: chatbot.name,
        description: chatbot.description,
        instructions: chatbot.instructions,
        context: chatbot.context,
      });

      // Refresh chatbot data to get updated deployment status
      await fetchChatbot();
      setDeployStatus("deployed");

      // Reset status after showing success message
      setTimeout(() => setDeployStatus("idle"), 3000);
    } catch (err) {
      console.error("Error deploying chatbot:", err);
      setDeployStatus("error");
      setTimeout(() => setDeployStatus("idle"), 3000);
    }
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

  const isDeployed = chatbot.deployed;
  const lastUpdated = chatbot.deployedAt
    ? new Date(chatbot.deployedAt)
    : new Date(chatbot.updatedAt);

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
                    <div className="flex items-center space-x-2">
                      <p className="text-sm text-gray-500">AI Assistant</p>
                      <span className="text-gray-400">•</span>
                      {isDeployed ? (
                        <div className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                          <span className="text-sm text-green-600 font-medium">
                            Deployed
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-orange-600 font-medium">
                          Draft
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <Button
                  onClick={handleDeploy}
                  disabled={isDeployed || deployStatus !== "idle"}
                  className={`rounded-xl px-6 py-3 ${
                    isDeployed
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  }`}
                >
                  {deployStatus === "deploying" ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Deploying...
                    </>
                  ) : deployStatus === "deployed" ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Deployed!
                    </>
                  ) : deployStatus === "error" ? (
                    <>
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Error
                    </>
                  ) : isDeployed ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
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

              {(deployStatus === "deployed" || isDeployed) && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-green-800 font-medium">
                      🎉{" "}
                      {deployStatus === "deployed"
                        ? "Successfully deployed!"
                        : "Chatbot is live!"}
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

              {deployStatus === "error" && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <span className="text-sm text-red-800 font-medium">
                    ❌ Failed to deploy. Please try again.
                  </span>
                </div>
              )}

              <div className="space-y-6">
                {/* Description */}
                {chatbot.description && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <MessageSquare className="w-4 h-4 mr-2 text-blue-500" />
                      Description
                      {isDeployed && (
                        <span className="ml-2 text-xs text-gray-400">
                          (Read-only)
                        </span>
                      )}
                    </h3>
                    <p
                      className={`text-sm text-gray-600 p-4 rounded-xl leading-relaxed ${
                        isDeployed ? "bg-gray-100" : "bg-gray-50"
                      }`}
                    >
                      {chatbot.description}
                    </p>
                  </div>
                )}

                {/* Instructions */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <Settings className="w-4 h-4 mr-2 text-purple-500" />
                    Agent Instructions
                    {isDeployed && (
                      <span className="ml-2 text-xs text-gray-400">
                        (Read-only)
                      </span>
                    )}
                  </h3>
                  <div
                    className={`text-sm text-gray-600 p-4 rounded-xl max-h-32 overflow-y-auto leading-relaxed ${
                      isDeployed ? "bg-gray-100" : "bg-gray-50"
                    }`}
                  >
                    {chatbot.instructions}
                  </div>
                </div>

                {/* Context */}
                {chatbot.context && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <Bot className="w-4 h-4 mr-2 text-green-500" />
                      Context Information
                      {isDeployed && (
                        <span className="ml-2 text-xs text-gray-400">
                          (Read-only)
                        </span>
                      )}
                    </h3>
                    <div
                      className={`text-sm text-gray-600 p-4 rounded-xl max-h-32 overflow-y-auto leading-relaxed ${
                        isDeployed ? "bg-gray-100" : "bg-gray-50"
                      }`}
                    >
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
                      {isDeployed && chatbot.deployedAt
                        ? "Deployed"
                        : "Updated"}{" "}
                      {lastUpdated.toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Chat Widget */}
          <div>
            {chatbot.deployed ? (
              <ChatWidget
                chatbotName={chatbot.name}
                chatbotId={chatbot.id}
                onSessionChange={setCurrentSessionId}
              />
            ) : (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="h-96 flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Loader2 className="w-8 h-8 text-yellow-600 animate-spin" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      Setting up your AI Agent
                    </h4>
                    <p className="text-gray-600 mb-4">
                      Your chatbot is being initialized. This may take a moment.
                    </p>
                    <Button
                      onClick={fetchChatbot}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Check Status
                    </Button>
                  </div>
                </div>
              </div>
            )}
            {currentSessionId && (
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500">
                  Session ID: {currentSessionId}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
