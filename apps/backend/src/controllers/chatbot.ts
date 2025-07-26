import { Request, Response } from "express";
import prisma from "../lib/db";

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

    res.json(chatbot);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch chatbot" });
  }
};

export const createChatbot = async (req: Request, res: Response) => {
  const { name, description, instructions, context } = req.body;

  try {
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
  
    res.status(201).json(chatbot);
  } catch (error) {
    res.status(500).json({ error: "Failed to create chatbot" });
  }
};

export const deployChatbot = async (req: Request, res: Response) => {
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

    // TODO: Implement actual deployment logic
    res.json({ message: "Chatbot deployed successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to deploy chatbot" });
  }
};

export const createCustomerSupportUser = async (req: Request, res: Response) => {
  const { name, email } = req.body;
  const { chatbotId } = req.params;

  try {
    const customerSupportUser = await prisma.customerSupportUser.create({
      data: {
        name,
        email,
        chatbotId
      }
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
            assignedTickets: true
          }
        }
      }
    });

    // Transform the response to include ticketCount at the top level
    const usersWithTicketCount = customerSupportUsers.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      ticketCount: user._count.assignedTickets
    }));

    res.status(200).json(usersWithTicketCount);
  } catch (error) {
    res.status(500).json({ error: "Failed to get customer support users" });
  }
};

