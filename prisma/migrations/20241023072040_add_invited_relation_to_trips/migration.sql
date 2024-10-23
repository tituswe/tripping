-- CreateTable
CREATE TABLE "_InvitedTrips" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_InvitedTrips_AB_unique" ON "_InvitedTrips"("A", "B");

-- CreateIndex
CREATE INDEX "_InvitedTrips_B_index" ON "_InvitedTrips"("B");

-- AddForeignKey
ALTER TABLE "_InvitedTrips" ADD CONSTRAINT "_InvitedTrips_A_fkey" FOREIGN KEY ("A") REFERENCES "Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InvitedTrips" ADD CONSTRAINT "_InvitedTrips_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
