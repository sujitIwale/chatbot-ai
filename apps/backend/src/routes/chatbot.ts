import { Router } from "express";
import { createChatbot, getChatbot, deployChatbot, createCustomerSupportUser, getCustomerSupportUsers, getChatbots } from "../controllers/chatbot";
import { authorization } from "../middleware/auth";
import { createTicket, getTickets } from "../controllers/tickets";

const chatbotRouter: Router = Router();

chatbotRouter.get("/", getChatbots);
chatbotRouter.post("/create", createChatbot);

// chatbot
chatbotRouter.get("/:chatbotId", authorization, getChatbot);
chatbotRouter.post("/:chatbotId/deploy", authorization, deployChatbot);

chatbotRouter.post("/:chatbotId/create-user", authorization, createCustomerSupportUser);
chatbotRouter.get("/:chatbotId/users", authorization, getCustomerSupportUsers);


// tickets
chatbotRouter.post("/:chatbotId/ticket/create",authorization, createTicket);
chatbotRouter.get("/:chatbotId/tickets", authorization, getTickets);


export default chatbotRouter;