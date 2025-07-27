import { Outlet, useNavigate } from "react-router-dom";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "../ui/button";
import ChatbotNavigation from "../navigation/ChatbotNavigation";
import { useChatbot } from "../../lib/contexts/chatbot/ChatbotContext";

const ChatbotLayout = () => {
  const { chatbot, loading, error } = useChatbot();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading chatbot...</p>
        </div>
      </div>
    );
  }

  if (error || !chatbot) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
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
      <Outlet />
    </div>
  );
};

export default ChatbotLayout;
