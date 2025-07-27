import { CustomerSupportUser } from "@prisma/client";
import prisma from "../lib/db";

export async function findAvailableSupportUser(chatbotId: string): Promise<Partial<CustomerSupportUser> & { ticketCount: number } | null> {
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

    if (supportUsers.length === 0) {
      return null;
    }

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