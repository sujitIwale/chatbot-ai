import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import {
  Bot,
  Rocket,
  Calendar,
  User,
  MessageSquare,
  Copy,
  ExternalLink,
  Loader2,
  Settings,
  Ticket,
  Users,
} from "lucide-react";

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

interface ChatbotLayoutProps {
  chatbot: IChatBot;
  children: React.ReactNode;
  deployStatus?: "idle" | "deploying" | "deployed";
  onDeploy?: () => void;
}

const ChatbotLayout: React.FC<ChatbotLayoutProps> = ({
  chatbot,
  children,
  deployStatus = "idle",
  onDeploy,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getActiveView = () => {
    if (location.pathname.includes("/tickets")) return "tickets";
    if (location.pathname.includes("/support")) return "support";
    return "chat";
  };

  const navigateToView = (view: string) => {
    const basePath = `/chatbot/${chatbot.id}`;
    switch (view) {
      case "chat":
        navigate(basePath);
        break;
      case "tickets":
        navigate(`${basePath}/tickets`);
        break;
      case "support":
        navigate(`${basePath}/support`);
        break;
    }
  };

  return (
    <div className="h-full flex bg-gray-50">
      <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
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
            {onDeploy && (
              <Button
                onClick={onDeploy}
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
            )}
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

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 px-6">
          <div className="flex space-x-1">
            <button
              onClick={() => navigateToView("chat")}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                getActiveView() === "chat"
                  ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <MessageSquare className="w-4 h-4 inline mr-2" />
              Chat
            </button>
            <button
              onClick={() => navigateToView("tickets")}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                getActiveView() === "tickets"
                  ? "bg-purple-50 text-purple-600 border-b-2 border-purple-600"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <Ticket className="w-4 h-4 inline mr-2" />
              Tickets
            </button>
            <button
              onClick={() => navigateToView("support")}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                getActiveView() === "support"
                  ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <Users className="w-4 h-4 inline mr-2" />
              Support Team
            </button>
          </div>
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

      {/* Right Side - Dynamic Content */}
      {children}
    </div>
  );
};

export default ChatbotLayout;
