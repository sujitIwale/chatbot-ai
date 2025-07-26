import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { chatbotApi } from "../../lib/api/chatbot";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "../../components/ui/button";
import ChatbotNavigation from "../../components/navigation/ChatbotNavigation";
import TicketsPanel from "../../components/panels/TicketsPanel";

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

const ChatBotTickets = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [chatbot, setChatbot] = useState<IChatBot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      <TicketsPanel />
    </div>
  );
};

export default ChatBotTickets;
