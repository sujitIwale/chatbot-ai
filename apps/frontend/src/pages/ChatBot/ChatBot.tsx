import { useState } from "react";
import { chatbotApi } from "../../lib/api/chatbot";
import {
  Loader2,
  AlertCircle,
  Bot,
  Rocket,
  Calendar,
  User,
  MessageSquare,
  Settings,
  CheckCircle,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import ChatWidget from "../../components/chat/ChatWidget";
import { useChatbot } from "../../lib/contexts/chatbot/ChatbotContext";

const ChatBot = () => {
  const { chatbot, refetchChatbot } = useChatbot();
  const [deployStatus, setDeployStatus] = useState<
    "idle" | "deploying" | "deployed" | "error"
  >("idle");

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

      await refetchChatbot();
      setDeployStatus("deployed");

      setTimeout(() => setDeployStatus("idle"), 3000);
    } catch (err) {
      console.error("Error deploying chatbot:", err);
      setDeployStatus("error");
      setTimeout(() => setDeployStatus("idle"), 3000);
    }
  };

  const handleFixAgent = async () => {
    if (!chatbot || !chatbot.hasIssues) return;

    try {
      await chatbotApi.fixAgent(chatbot.id);
      await refetchChatbot();
    } catch (err) {
      console.error("Error fixing chatbot agent:", err);
    }
  };

  // Since we're using the context, chatbot is guaranteed to exist here
  if (!chatbot) return null;

  const isDeployed = chatbot.deployed;
  const lastUpdated = chatbot.deployedAt
    ? new Date(chatbot.deployedAt)
    : new Date(chatbot.updatedAt);

  return (
    <div className="max-w-7xl mx-auto py-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
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

            {chatbot.hasIssues && (
              <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-amber-600 mr-2" />
                    <span className="text-sm font-medium text-amber-800">
                      Chatbot setup incomplete. Click to fix issues.
                    </span>
                  </div>
                  <Button
                    onClick={handleFixAgent}
                    className="bg-amber-600 hover:bg-amber-700 text-white rounded-lg px-4 py-2"
                  >
                    Fix Issues
                  </Button>
                </div>
              </div>
            )}

            {chatbot.hasIssues && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                <span className="text-sm text-green-800 font-medium">
                  ✅ Issues fixed successfully! Your chatbot is now ready.
                </span>
              </div>
            )}

            {deployStatus === "error" && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <span className="text-sm text-red-800 font-medium">
                  ❌{" "}
                  {chatbot.hasIssues
                    ? "Failed to fix issues"
                    : "Deployment failed"}
                  . Please try again.
                </span>
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
                    {isDeployed && chatbot.deployedAt ? "Deployed" : "Updated"}{" "}
                    {lastUpdated.toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          {!chatbot.hasIssues ? (
            <ChatWidget chatbotName={chatbot.name} chatbotId={chatbot.id} />
          ) : (
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="h-96 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    {chatbot.hasIssues ? (
                      <AlertCircle className="w-8 h-8 text-yellow-600" />
                    ) : (
                      <Loader2 className="w-8 h-8 text-yellow-600 animate-spin" />
                    )}
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    {chatbot.hasIssues
                      ? "Setup Issues"
                      : "Setting up your AI Agent"}
                  </h4>
                  <p className="text-gray-600 mb-4">
                    {chatbot.hasIssues
                      ? "Your chatbot needs to be fixed before it can be used."
                      : "Your chatbot is being initialized. This may take a moment."}
                  </p>
                  <Button
                    onClick={
                      chatbot.hasIssues ? handleFixAgent : refetchChatbot
                    }
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {chatbot.hasIssues ? "Fix Issues" : "Check Status"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
