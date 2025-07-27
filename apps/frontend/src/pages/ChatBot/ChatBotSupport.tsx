import CustomerSupportPanel from "../../components/panels/CustomerSupportPanel";
import { useChatbot } from "../../lib/contexts/chatbot/ChatbotContext";

const ChatBotSupport = () => {
  const { chatbot } = useChatbot();

  if (!chatbot) return null;

  return <CustomerSupportPanel />;
};

export default ChatBotSupport;
