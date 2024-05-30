/*
  Warnings:

  - Changed the type of `aadhar_number` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "aadhar_number",
ADD COLUMN     "aadhar_number" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_aadhar_number_key" ON "User"("aadhar_number");
