/*
  Warnings:

  - You are about to drop the column `photos` on the `Location` table. All the data in the column will be lost.
  - You are about to drop the column `photos` on the `Place` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Location" DROP COLUMN "photos";

-- AlterTable
ALTER TABLE "Place" DROP COLUMN "photos";
