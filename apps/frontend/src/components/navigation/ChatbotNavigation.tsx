import { useNavigate, useLocation } from "react-router-dom";
import { MessageSquare, Ticket, Users, Code, Bot } from "lucide-react";

interface ChatbotNavigationProps {
  chatbotId: string;
  chatbotName: string;
}

const navigationItems = [
  {
    key: "chat",
    icon: MessageSquare,
    label: "Chat",
  },
  {
    key: "tickets",
    icon: Ticket,
    label: "Tickets",
  },
  {
    key: "support",
    icon: Users,
    label: "Support Team",
  },
  {
    key: "embed",
    icon: Code,
    label: "Embed & Integrate",
  },
];

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

  return (
    <div className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
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
                      ? `bg-blue-50 text-blue-600 shadow-sm`
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotNavigation;
