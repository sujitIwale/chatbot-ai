import { CustomerSupportUser } from "@prisma/client";
import prisma from "../lib/db";

interface SupportUserWithTicketCount {
  id: string;
  name: string;
  email: string;
  ticketCount: number;
}

export async function findAvailableSupportUser(chatbotId: string): Promise<Partial<CustomerSupportUser> & { ticketCount: number } | null> {
  try {
    // Get all customer support users for this chatbot with their ticket counts
    const supportUsers = await prisma.customerSupportUser.findMany({
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

    if (supportUsers.length === 0) {
      return null;
    }

    // Transform to include ticket count at top level and find user with minimum tickets
    const usersWithTicketCount = supportUsers.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      ticketCount: user._count.assignedTickets
    }));

    // Sort by ticket count (ascending) and get the user with fewest tickets
    const assignedUser = usersWithTicketCount.sort((a, b) => a.ticketCount - b.ticketCount)[0];

    return assignedUser;
  } catch (error) {
    console.error('Error assigning ticket to support user:', error);
    return null;
  }
}

/**
 * Gets ticket statistics for all support users in a chatbot
 * @param chatbotId - The chatbot ID
 * @returns Array of support users with their ticket statistics
 */
export async function getSupportUserTicketStats(chatbotId: string): Promise<SupportUserWithTicketCount[]> {
  try {
    const supportUsers = await prisma.customerSupportUser.findMany({
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

    return supportUsers.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      ticketCount: user._count.assignedTickets
    }));
  } catch (error) {
    console.error('Error getting support user ticket stats:', error);
    throw error;
  }
}