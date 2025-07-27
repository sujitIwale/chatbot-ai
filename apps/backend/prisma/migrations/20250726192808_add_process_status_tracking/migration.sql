/*
  Warnings:

  - You are about to drop the column `lyzrEnvironmentId` on the `Chatbot` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ProcessStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED', 'SKIPPED');

-- AlterTable
ALTER TABLE "Chatbot" DROP COLUMN "lyzrEnvironmentId",
ADD COLUMN     "agentError" TEXT,
ADD COLUMN     "agentStatus" "ProcessStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "knowledgeBaseError" TEXT,
ADD COLUMN     "knowledgeBaseStatus" "ProcessStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "lyzrRagId" TEXT,
ADD COLUMN     "trainingError" TEXT,
ADD COLUMN     "trainingStatus" "ProcessStatus" NOT NULL DEFAULT 'PENDING';
