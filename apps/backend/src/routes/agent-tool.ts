import { Router } from "express";
import { getCustomerSupportUsers } from "../controllers/chatbot";
import { createTicket } from "../controllers/tickets";

const agentToolRouter: Router = Router();

agentToolRouter.get("/:chatbotId/users", getCustomerSupportUsers);
agentToolRouter.post("/:chatbotId/ticket/create", createTicket);

export default agentToolRouter;