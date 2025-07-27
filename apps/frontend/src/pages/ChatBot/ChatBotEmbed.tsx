import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";
import { Button } from "../../components/ui/button";
import EmbedPanel from "../../components/panels/EmbedPanel";
import { useChatbot } from "../../lib/contexts/chatbot/ChatbotContext";

const ChatBotEmbed = () => {
  const { chatbot } = useChatbot();
  const navigate = useNavigate();

  if (!chatbot) return null;

  // Check if chatbot is deployed
  if (!chatbot.deployed) {
    return (
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
    );
  }

  return <EmbedPanel chatbotId={chatbot.id} chatbotName={chatbot.name} />;
};

export default ChatBotEmbed;
