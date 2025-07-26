import { Router } from "express";
import { createChatbot, getChatbot } from "../controllers/chatbot";

const chatbotRouter: Router = Router();

chatbotRouter.get("/:id", getChatbot);
chatbotRouter.post("/create", createChatbot);

export default chatbotRouter;