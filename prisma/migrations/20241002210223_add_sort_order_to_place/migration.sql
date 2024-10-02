/*
  Warnings:

  - Added the required column `sortOrder` to the `Place` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Place" ADD COLUMN     "sortOrder" INTEGER NOT NULL;
