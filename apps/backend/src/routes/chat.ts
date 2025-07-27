import { NextFunction, Request, Response, Router } from "express";
import { getChatHistory, getSessionInfo, sendMessage } from "../controllers/chat";
import prisma from "../lib/db";

const chatRouter: Router = Router();

const verifyChatbot = async (req: Request, res: Response, next: NextFunction) => {
  const { chatbotId } = req.params;
  const chatbot = await prisma.chatbot.findUnique({
    where: { id: chatbotId }
  });
  if(!chatbot) {
    return res.status(404).json({ error: "Chatbot not found" });
  }
  next();
}

chatRouter.post("/:chatbotId/send-message", verifyChatbot, sendMessage);
chatRouter.get("/session/:sessionId/history",getChatHistory);

export default chatRouter;