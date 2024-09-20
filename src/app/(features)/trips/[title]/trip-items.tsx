import { DataTable } from "@/components/data-table/data-table";
import { Card, CardContent } from "@/components/ui/card";
import prisma from "@/lib/db";
import { TripItem } from "@prisma/client";
import { columns } from "./columns";

interface TripItemsProps {
  tripTitle: string;
}

export async function TripItems({ tripTitle }: TripItemsProps) {
  const data: TripItem[] = await prisma.tripItem.findMany({
    where: { trip: { title: tripTitle } }
  });

  return (
    <Card className="rounded-lg border-none mt-6">
      <CardContent className="p-6">
        <h2 className="text-2xl font-semibold">Itinerary</h2>
        <DataTable columns={columns} data={data} />
      </CardContent>
    </Card>
  );
}
