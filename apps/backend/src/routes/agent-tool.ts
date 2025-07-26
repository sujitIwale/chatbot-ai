import { Router } from "express";
import { getCustomerSupportUsers } from "../controllers/chatbot";
import { createTicket } from "../controllers/tickets";

const agentToolRouter: Router = Router();

agentToolRouter.get("/:id/users", getCustomerSupportUsers);
agentToolRouter.post("/:id/ticket/create", createTicket);

export default agentToolRouter;