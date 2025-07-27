import { Request, Response } from "express";
import prisma from "../lib/db";
import { findAvailableSupportUser } from "../services/ticketAssignment";

export const createTicket = async (req: Request, res: Response) => {
  const { subject, assignedTo, sessionId } = req.body;
  const { chatbotId } = req.params;

  try {
    let finalAssignedTo = assignedTo;
    
    if (!finalAssignedTo) {
      const assignedUser = await findAvailableSupportUser(chatbotId);
      if(assignedUser) {
        finalAssignedTo = assignedUser.id;
      }
    }

    const ticket = await prisma.ticket.create({
      data: { 
        subject, 
        assignedTo: finalAssignedTo, 
        sessionId, 
        chatbotId
      },
      include: {
        assignedUser: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        chatSession: {
          select: {
            id: true,
            userId: true,
            status: true,
          }
        }
      }
    });

    res.status(201).json(ticket);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create ticket" });
  }
};

export const getTickets = async (req: Request, res: Response) => {
  const { chatbotId } = req.params;
  const { assignedTo } = req.query;

  try {
    const whereClause: any = { chatbotId };
    
    if (assignedTo) {
      whereClause.assignedTo = assignedTo;
    }

    const tickets = await prisma.ticket.findMany({
      where: whereClause,
      include: {
        assignedUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        chatSession: {
          select: {
            id: true,
            userId: true,
            status: true,
            createdAt: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json(tickets);
  } catch (error) {
    console.error('Error getting tickets:', error);
    res.status(500).json({ error: "Failed to get tickets" });
  }
};