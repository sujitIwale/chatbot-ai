import TicketsPanel from "../../components/panels/TicketsPanel";
import { useChatbot } from "../../lib/contexts/chatbot/ChatbotContext";

const ChatBotTickets = () => {
  const { chatbot } = useChatbot();

  if (!chatbot) return null;

  return <TicketsPanel chatbotId={chatbot.id} />;
};

export default ChatBotTickets;
