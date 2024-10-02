-- DropForeignKey
ALTER TABLE "Place" DROP CONSTRAINT "Place_tripId_fkey";

-- DropForeignKey
ALTER TABLE "PlaceReview" DROP CONSTRAINT "PlaceReview_placeId_fkey";

-- DropForeignKey
ALTER TABLE "Trip" DROP CONSTRAINT "Trip_locationId_fkey";

-- AddForeignKey
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Place" ADD CONSTRAINT "Place_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaceReview" ADD CONSTRAINT "PlaceReview_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE CASCADE ON UPDATE CASCADE;
