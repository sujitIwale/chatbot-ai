/*
  Warnings:

  - You are about to drop the column `priority` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Ticket` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "priority",
DROP COLUMN "status";

-- DropEnum
DROP TYPE "Priority";

-- DropEnum
DROP TYPE "TicketStatus";
