import { Request, Response } from "express";
import { customerSupportAgent } from "../client/lyzr";
import prisma from "../lib/db";
import { findAvailableSupportUser } from "../services/ticketAssignment";
import { Message } from "@prisma/client";

export const sendMessage = async (req: Request, res: Response) => {
    const { chatbotId } = req.params;
    const { message, sessionId, userId } = req.body;
    
    try {
        let chatSession = await prisma.chatSession.findUnique({
            where: { id: sessionId },
            include: { chatbot: true }
        });

        if (!chatSession) {
            chatSession = await prisma.chatSession.create({
                data: {
                    id: sessionId,
                    chatbotId,
                    userId: userId || null,
                    status: 'ACTIVE'
                },
                include: { chatbot: true }
            });
        }

        // Save user message
        await prisma.message.create({
            data: {
                sessionId,
                content: message,
                sender: 'USER'
            }
        });

        if (chatSession.handedOff) {
            return handleHumanSupportMessage(chatSession, message, res);
        }

        const chatbot = chatSession.chatbot;
        if(!chatbot.lyzrAgentId){
            return res.status(400).json({ error: "Agent not initialized" });
        }

        const agentResponse = await customerSupportAgent.sendMessage(
            {
                lyzrAgentId: chatbot.lyzrAgentId,
                message,
                sessionId,
                userId: userId || 'anonymous'
            }
        );

        await prisma.message.create({
            data: {
                sessionId,
                content: agentResponse.responseMessage,
                sender: 'AGENT'
            }
        });

        // Check if agent couldn't handle the query
        if (!agentResponse.can_handle) {
            const newMessage = await handleEscalationToHuman(chatSession, message);
            
            return res.status(200).json({
                response: agentResponse.responseMessage,
                escalated: true,
                message: newMessage?.content || "Your query has been escalated to our human support team. A support agent will assist you shortly."
            });
        }

        res.status(200).json({
            response: agentResponse.responseMessage,
            escalated: false
        });
    } catch (error) {
        console.error('Error in sendMessage:', error);
        res.status(500).json({ error: "Failed to send message" });
    }
};

export const getChatHistory = async (req: Request, res: Response) => {
    const { sessionId } = req.params;
    
    try {
        const messages = await prisma.message.findMany({
            where: { sessionId },
            include: {
                supportAgent: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            },
            orderBy: { createdAt: 'asc' }
        });

        res.status(200).json(messages);
    } catch (error) {
        console.error('Error getting chat history:', error);
        res.status(500).json({ error: "Failed to get chat history" });
    }
};


async function handleEscalationToHuman(chatSession: any, originalMessage: string):Promise<Message | null> {
    try {
        const assignedUser = await findAvailableSupportUser(chatSession.chatbotId);
        
        // Create ticket
        const ticket = await prisma.ticket.create({
            data: {
                subject: `Customer Query: ${originalMessage.substring(0, 100)}...`,
                sessionId: chatSession.id,
                chatbotId: chatSession.chatbotId,
                assignedTo: assignedUser?.id
            }
        });

       const message = await prisma.message.create({
            data: {
                sessionId: chatSession.id,
                content: assignedUser ? `Chat has been transferred to ${assignedUser.name} (${assignedUser.email}). Ticket #${ticket.id} has been created.` : `Currently, support user is not available. Our support team will assist you shortly. Ticket #${ticket.id} has been created.`,
                sender: 'AGENT'
            }
        });

        return message;
    } catch (error) {
        console.error('Error handling escalation:', error);
        return null;
    }
}

async function handleHumanSupportMessage(chatSession: any, message: string, res: Response) {
    const activeTicket = await prisma.ticket.findFirst({
        where: {
            sessionId: chatSession.id
        },
        include: {
            assignedUser: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            }
        }
    });

    if (activeTicket && activeTicket.assignedUser) {
        return res.status(200).json({
            response: `Your message has been received. You are currently connected to ${activeTicket.assignedUser.name}. They will respond to you shortly.`,
            escalated: true,
            assignedTo: activeTicket.assignedUser,
            ticketId: activeTicket.id
        });
    } else {
        return res.status(200).json({
            response: "Your query is being handled by our support team. Please wait for a response.",
            escalated: true
        });
    }
}