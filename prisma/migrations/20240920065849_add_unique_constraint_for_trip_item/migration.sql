/*
  Warnings:

  - A unique constraint covering the columns `[name,tripId]` on the table `TripItem` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "TripItem_name_tripId_key" ON "TripItem"("name", "tripId");
