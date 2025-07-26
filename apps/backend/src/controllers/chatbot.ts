import { Request, Response } from "express";
import prisma from "../lib/db";

export const getChatbot = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const chatbot = await prisma.chatbot.findUnique({
      where: {
        id,
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