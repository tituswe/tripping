/*
  Warnings:

  - You are about to drop the column `description` on the `Trip` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `Trip` table. All the data in the column will be lost.
  - You are about to drop the `TripItem` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `locationId` to the `Trip` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "TripItem" DROP CONSTRAINT "TripItem_tripId_fkey";

-- DropIndex
DROP INDEX "Trip_title_key";

-- AlterTable
ALTER TABLE "Trip" DROP COLUMN "description",
DROP COLUMN "location",
ADD COLUMN     "locationId" TEXT NOT NULL,
ALTER COLUMN "title" DROP NOT NULL,
ALTER COLUMN "from" DROP NOT NULL,
ALTER COLUMN "to" DROP NOT NULL;

-- DropTable
DROP TABLE "TripItem";

-- CreateTable
CREATE TABLE "Location" (
    "id" TEXT NOT NULL,
    "placeId" TEXT NOT NULL,
    "name" TEXT,
    "formattedAddress" TEXT,
    "country" TEXT,
    "city" TEXT,
    "district" TEXT,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "locationType" TEXT,
    "photos" TEXT[],
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Place" (
    "id" TEXT NOT NULL,
    "placeId" TEXT NOT NULL,
    "tripId" TEXT NOT NULL,
    "name" TEXT,
    "formattedAddress" TEXT,
    "country" TEXT,
    "city" TEXT,
    "district" TEXT,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "tags" TEXT[],
    "photos" TEXT[],
    "openingHours" TEXT[],
    "rating" DOUBLE PRECISION,
    "userRatingsTotal" INTEGER,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Place_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlaceReview" (
    "id" TEXT NOT NULL,
    "placeId" TEXT NOT NULL,
    "authorName" TEXT,
    "authorUrl" TEXT,
    "language" TEXT,
    "profilePhotoUrl" TEXT,
    "rating" DOUBLE PRECISION,
    "relativeTimeDescription" TEXT,
    "text" TEXT,
    "postedAt" TIMESTAMP(3),

    CONSTRAINT "PlaceReview_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Location_placeId_key" ON "Location"("placeId");

-- CreateIndex
CREATE UNIQUE INDEX "Place_placeId_key" ON "Place"("placeId");

-- AddForeignKey
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Place" ADD CONSTRAINT "Place_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaceReview" ADD CONSTRAINT "PlaceReview_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
