import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { chatbotApi } from "../../lib/api/chatbot";
import { Loader2, AlertCircle, Lock } from "lucide-react";
import { Button } from "../../components/ui/button";
import ChatbotNavigation from "../../components/navigation/ChatbotNavigation";
import EmbedPanel from "../../components/panels/EmbedPanel";

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

const ChatBotEmbed = () => {
  const { chatbotId } = useParams<{ chatbotId: string }>();
  const navigate = useNavigate();
  const [chatbot, setChatbot] = useState<IChatBot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (chatbotId) {
      fetchChatbot();
    } else {
      navigate("/dashboard");
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

  // Check if chatbot is deployed
  if (!chatbot.deployed) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ChatbotNavigation chatbotId={chatbot.id} chatbotName={chatbot.name} />
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <div className="text-center max-w-md mx-auto p-8">
            <div className="p-4 bg-gray-100 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <Lock className="w-10 h-10 text-gray-500" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Chatbot Not Deployed
            </h2>
            <p className="text-gray-600 mb-6">
              This chatbot needs to be deployed before it can be embedded on
              websites. Deploy your chatbot to make the embed code available.
            </p>
            <div className="space-y-3">
              <Button
                onClick={() => navigate(`/chatbot/${chatbot.id}`)}
                className="w-full"
              >
                Go to Chatbot Settings
              </Button>
              <Button
                onClick={() => navigate("/dashboard")}
                variant="outline"
                className="w-full"
              >
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ChatbotNavigation chatbotId={chatbot.id} chatbotName={chatbot.name} />
      <EmbedPanel chatbotId={chatbot.id} chatbotName={chatbot.name} />
    </div>
  );
};

export default ChatBotEmbed;
