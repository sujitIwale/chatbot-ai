import { Router } from "express";
import { sendMessage } from "../controllers/chat";

const chatRouter: Router = Router();

chatRouter.post("/:chatbotId/send-message", sendMessage);

export default chatRouter;