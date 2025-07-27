import { Router } from "express";
import { createChatbot, getChatbot, deployChatbot, createCustomerSupportUser, getCustomerSupportUsers, getChatbots, fixAgent } from "../controllers/chatbot";
import { authorization } from "../middleware/auth";
import { createTicket, getTickets } from "../controllers/tickets";
import { sendMessage, getChatHistory } from "../controllers/chat";

const chatbotRouter: Router = Router();

chatbotRouter.get("/", getChatbots);
chatbotRouter.post("/create", createChatbot);
chatbotRouter.post('/:chatbotId/fix-agent', authorization, fixAgent);

// chatbot
chatbotRouter.get("/:chatbotId", authorization, getChatbot);
chatbotRouter.post("/:chatbotId/deploy", authorization, deployChatbot);

chatbotRouter.post("/:chatbotId/create-user", authorization, createCustomerSupportUser);
chatbotRouter.get("/:chatbotId/users", authorization, getCustomerSupportUsers);

// tickets
chatbotRouter.post("/:chatbotId/ticket/create", authorization, createTicket);
chatbotRouter.get("/:chatbotId/tickets", authorization, getTickets);

// chat - admin interactions
chatbotRouter.post("/:chatbotId/chat/message", sendMessage);
chatbotRouter.get("/chat/session/:sessionId/history", getChatHistory);

export default chatbotRouter;