import { Request, Response } from "express";
import prisma from "../lib/db";

export const createTicket = async (req: Request, res: Response) => {
  const { subject,  assignedTo ,sessionId} = req.body;
  const { chatbotId } = req.params;

  try {
    const ticket = await prisma.ticket.create({
      data: { subject, assignedTo, sessionId, chatbotId },
    });

    res.status(201).json(ticket);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create ticket" });
  }
};

export const getTickets = async (req: Request, res: Response) => {
  const { chatbotId } = req.params;

  try {
    const tickets = await prisma.ticket.findMany({
      where: { chatbotId },
      include: {
        assignedUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ error: "Failed to get tickets" });
  }
};