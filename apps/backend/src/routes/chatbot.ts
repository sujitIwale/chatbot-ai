import { Router } from "express";
import { createChatbot, getChatbot, deployChatbot, createCustomerSupportUser, getCustomerSupportUsers, getChatbots } from "../controllers/chatbot";
import { authorization } from "../middleware/auth";
import { createTicket, getTickets } from "../controllers/tickets";

const chatbotRouter: Router = Router();

chatbotRouter.get("/", getChatbots);
chatbotRouter.post("/create", createChatbot);

// chatbot
chatbotRouter.get("/:id", authorization, getChatbot);
chatbotRouter.post("/:id/deploy", authorization, deployChatbot);

chatbotRouter.post("/:id/create-user", authorization, createCustomerSupportUser);
chatbotRouter.get("/:id/users", authorization, getCustomerSupportUsers);


// tickets
chatbotRouter.post("/:id/tickets", createTicket);
chatbotRouter.get("/:id/tickets", authorization, getTickets);


export default chatbotRouter;