-- AlterTable
ALTER TABLE "Chatbot" ADD COLUMN     "useKnowledgeBase" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "password" TEXT;
