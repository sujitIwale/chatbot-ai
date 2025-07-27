import { Request, Response } from "express";
import prisma from "../lib/db";
import { customerSupportAgent } from "../client/lyzr";

export const getChatbots = async (req: Request, res: Response) => {
  try {
    const chatbots = await prisma.chatbot.findMany({
      where: { ownerId: req.user?.id },
    });

    res.status(200).json(chatbots);
  } catch (error) {
    res.status(500).json({ error: "Failed to get chatbots" });
  }
};

export const getChatbot = async (req: Request, res: Response) => {
  const { chatbotId } = req.params;

  try {
    const chatbot = await prisma.chatbot.findUnique({
      where: {
        id: chatbotId,
        ownerId: req.user?.id,
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!chatbot) {
      return res.status(404).json({ error: "Chatbot not found" });
    }

    const issues = {
      agentNotInitialized: !chatbot.lyzrAgentId,
      ragNotPresent: !chatbot.lyzrRagId,
      knowledgeBaseIssue: chatbot.knowledgeBaseStatus !== 'CREATED'
    };
    
    const hasIssues = issues.agentNotInitialized || issues.ragNotPresent || issues.knowledgeBaseIssue;

    res.json({
      ...chatbot,
      agentInitialized: !!chatbot.lyzrAgentId,
      ragInitialized: !!chatbot.lyzrRagId,
      hasIssues,
      issues
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch chatbot" });
  }
};

export const createChatbot = async (req: Request, res: Response) => {
  const { name, description, instructions, context } = req.body;

  try {
    // Create the chatbot first
    const chatbot = await prisma.chatbot.create({
      data: {
        name,
        description,
        instructions,
        context,
        owner: {
          connect: {
            id: req.user?.id,
          },
        },
      },
    });
    try {
      const { agentId, ragId, knowledgeBaseStatus } =
        await customerSupportAgent.initialize(chatbot);

      console.log({ agentId, ragId });
      const updatedChatbot = await prisma.chatbot.update({
        where: { id: chatbot.id },
        data: {
          lyzrAgentId: agentId,
          lyzrRagId: ragId,
          deployed: true,
          deployedAt: new Date(),
          knowledgeBaseStatus,
        },
      });

      res.status(201).json({
        ...updatedChatbot,
        agentInitialized: true,
        message: "Chatbot created and AI agent initialized successfully",
      });
    } catch (agentError) {
      console.error("Error initializing Lyzr agent:", agentError);

      // Return the chatbot even if agent initialization fails
      res.status(201).json({
        ...chatbot,
        agentInitialized: false,
        message:
          "Chatbot created but AI agent initialization failed. You can retry deployment later.",
        error: "Agent initialization failed",
      });
    }
  } catch (error) {
    console.error("Error creating chatbot:", error);
    res.status(500).json({ error: "Failed to create chatbot" });
  }
};

export const fixAgent = async (req: Request, res: Response) => {
  const { chatbotId } = req.params;
  try {
    const chatbot = await prisma.chatbot.findUnique({
      where: {
        id: chatbotId,
        ownerId: req.user?.id,
      },
    });

    if (!chatbot) {
      return res.status(404).json({ error: "Chatbot not found" });
    }

    const { agentId, ragId, knowledgeBaseStatus } =
      await customerSupportAgent.initialize(chatbot);

    const updatedChatbot = await prisma.chatbot.update({
      where: { id: chatbotId },
      data: {
        lyzrAgentId: agentId,
        lyzrRagId: ragId,
        knowledgeBaseStatus,
      },
    });

    res.status(200).json({
      ...updatedChatbot,
      agentInitialized: true,
      message: "Chatbot agent fixed successfully",
    });
  } catch (error) {
    console.error("Error fixing chatbot agent:", error);
    res.status(500).json({ error: "Failed to fix chatbot agent" });
  }
};

export const deployChatbot = async (req: Request, res: Response) => {
  const { name, description, instructions, context } = req.body;
  const { chatbotId } = req.params;

  try {
    const chatbot = await prisma.chatbot.update({
      where: {
        id: chatbotId,
        ownerId: req.user?.id,
      },
      data: {
        name,
        description,
        instructions,
        context,
        deployed: true,
        deployedAt: new Date(),
      },
    });

    res.status(200).json({
      ...chatbot,
      message: "Chatbot deployed successfully",
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to deploy chatbot" });
  }
};

export const createCustomerSupportUser = async (
  req: Request,
  res: Response
) => {
  const { name, email } = req.body;
  const { chatbotId } = req.params;

  try {
    const customerSupportUser = await prisma.customerSupportUser.create({
      data: {
        name,
        email,
        chatbotId,
      },
    });

    res.status(201).json(customerSupportUser);
  } catch (error) {
    res.status(500).json({ error: "Failed to create customer support user" });
  }
};

export const getCustomerSupportUsers = async (req: Request, res: Response) => {
  const { chatbotId } = req.params;

  try {
    const customerSupportUsers = await prisma.customerSupportUser.findMany({
      where: { chatbotId },
      select: {
        id: true,
        name: true,
        email: true,
        _count: {
          select: {
            assignedTickets: true,
          },
        },
      },
    });

    // Transform the response to include ticketCount at the top level
    const usersWithTicketCount = customerSupportUsers.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      ticketCount: user._count.assignedTickets,
    }));

    res.status(200).json(usersWithTicketCount);
  } catch (error) {
    res.status(500).json({ error: "Failed to get customer support users" });
  }
};
