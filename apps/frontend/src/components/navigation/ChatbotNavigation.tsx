import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import {
  MessageSquare,
  Ticket,
  Users,
  Code,
  Bot,
  ArrowLeft,
} from "lucide-react";

interface ChatbotNavigationProps {
  chatbotId: string;
  chatbotName: string;
}

const ChatbotNavigation: React.FC<ChatbotNavigationProps> = ({
  chatbotId,
  chatbotName,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveView = () => {
    if (location.pathname.includes("/tickets")) return "tickets";
    if (location.pathname.includes("/support")) return "support";
    if (location.pathname.includes("/embed")) return "embed";
    return "chat";
  };

  const navigateToView = (view: string) => {
    const basePath = `/chatbot/${chatbotId}`;
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
      case "embed":
        navigate(`${basePath}/embed`);
        break;
    }
  };

  const navigationItems = [
    {
      key: "chat",
      icon: MessageSquare,
      label: "Chat",
      color: "blue",
    },
    {
      key: "tickets",
      icon: Ticket,
      label: "Tickets",
      color: "purple",
    },
    {
      key: "support",
      icon: Users,
      label: "Support Team",
      color: "green",
    },
    {
      key: "embed",
      icon: Code,
      label: "Embed & Integrate",
      color: "orange",
    },
  ];

  return (
    <div className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Back button and chatbot info */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/dashboard")}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="hidden sm:flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  {chatbotName}
                </h1>
                <p className="text-sm text-gray-500">AI Assistant</p>
              </div>
            </div>
          </div>

          {/* Center - Navigation items */}
          <div className="flex items-center space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = getActiveView() === item.key;

              return (
                <button
                  key={item.key}
                  onClick={() => navigateToView(item.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                    isActive
                      ? `bg-${item.color}-50 text-${item.color}-600 shadow-sm`
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600 hidden sm:inline">
                Online
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotNavigation;
