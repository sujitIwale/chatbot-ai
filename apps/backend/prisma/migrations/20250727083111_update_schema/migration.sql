/*
  Warnings:

  - You are about to drop the column `agentError` on the `Chatbot` table. All the data in the column will be lost.
  - You are about to drop the column `agentStatus` on the `Chatbot` table. All the data in the column will be lost.
  - You are about to drop the column `knowledgeBaseError` on the `Chatbot` table. All the data in the column will be lost.
  - You are about to drop the column `trainingError` on the `Chatbot` table. All the data in the column will be lost.
  - You are about to drop the column `trainingStatus` on the `Chatbot` table. All the data in the column will be lost.
  - The `knowledgeBaseStatus` column on the `Chatbot` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Made the column `context` on table `Chatbot` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "KnowledgeBaseStatus" AS ENUM ('NOT_CREATED', 'CREATED');

-- AlterTable
ALTER TABLE "Chatbot" DROP COLUMN "agentError",
DROP COLUMN "agentStatus",
DROP COLUMN "knowledgeBaseError",
DROP COLUMN "trainingError",
DROP COLUMN "trainingStatus",
ALTER COLUMN "context" SET NOT NULL,
ALTER COLUMN "context" SET DEFAULT '',
DROP COLUMN "knowledgeBaseStatus",
ADD COLUMN     "knowledgeBaseStatus" "KnowledgeBaseStatus" NOT NULL DEFAULT 'NOT_CREATED';

-- DropEnum
DROP TYPE "ProcessStatus";
