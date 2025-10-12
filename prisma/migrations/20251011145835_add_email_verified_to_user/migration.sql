/*
  Warnings:

  - A unique constraint covering the columns `[pendingEmail]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "pendingEmail" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_pendingEmail_key" ON "public"."User"("pendingEmail");
