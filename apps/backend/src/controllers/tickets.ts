import { Request, Response } from "express";
import prisma from "../lib/db";

export const createTicket = async (req: Request, res: Response) => {
  const { subject, status, assignedTo ,sessionId, chatbotId} = req.body;

  try {
    const ticket = await prisma.ticket.create({
      data: { subject, status, assignedTo, sessionId, chatbotId },
    });

    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ error: "Failed to create ticket" });
  }
};

export const getTickets = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const tickets = await prisma.ticket.findMany({
      where: { chatbotId: id },
    });

    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ error: "Failed to get tickets" });
  }
};