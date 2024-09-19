import { Card, CardContent } from "@/components/ui/card";
import { TripItem } from "@prisma/client";
import { DataTable } from "../../../../components/data-table/data-table";
import { columns } from "./columns";

async function getData(): Promise<TripItem[]> {
  return [
    {
      id: "asdfasfd1",
      name: "Trip 1",
      address:
        "123 Main St, USA, 12345ashjdfklashdfkljashldfkhaslkdfhaskldfhlaskfhlakshdflaksdfhlkasjfhlkasjhdf",
      activity: "Hiking",
      description: "A fun trip",
      price: 100,
      tripId: "fasdfasdf",
      media: [],
      from: new Date(Date.now()),
      to: new Date(Date.now()),
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now())
    },
    {
      id: "asdfasfd2",
      name: "Trip 2",
      address: "456 Main St, USA, 12345",
      activity: "Swimming",
      description: "A fun trip",
      price: 200,
      tripId: "asdfasfd",
      media: [],
      from: new Date(Date.now()),
      to: new Date(Date.now()),
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now())
    },
    {
      id: "asdfasfd3",
      name: "Trip 3",
      address: "789 Main St, USA, 12345",
      activity: "Camping",
      description: "A fun trip",
      price: 300,
      tripId: "asdfasfd",
      media: [],
      from: new Date(Date.now()),
      to: new Date(Date.now()),
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now())
    },
    {
      id: "asdfasfd4",
      name: "Trip 4",
      address: "101 Main St, USA, 12345",
      activity: "Skiing",
      description: "A fun trip",
      price: 400,
      tripId: "asdfasfd",
      media: [],
      from: new Date(Date.now()),
      to: new Date(Date.now()),
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now())
    },
    {
      id: "asdfasfd5",
      name: "Trip 5",
      address: "112 Main St, USA, 12345",
      activity: "Fishing",
      description: "A fun trip",
      price: 500,
      tripId: "asdfasfd",
      media: [],
      from: new Date(Date.now()),
      to: new Date(Date.now()),
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now())
    },
    {
      id: "asdfasfd6",
      name: "Trip 6",
      address: "113 Main St, USA, 12345",
      activity: "Hiking",
      description: "A fun trip",
      price: 600,
      tripId: "asdfasfd",
      media: [],
      from: new Date(Date.now()),
      to: new Date(Date.now()),
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now())
    },
    {
      id: "asdfasfd7",
      name: "Trip 7",
      address: "114 Main St, USA, 12345",
      activity: "Swimming",
      description: "A fun trip",
      price: 700,
      tripId: "asdfasfd",
      media: [],
      from: new Date(Date.now()),
      to: new Date(Date.now()),
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now())
    },
    {
      id: "asdfasfd8",
      name: "Trip 8",
      address: "115 Main St, USA, 12345",
      activity: "Camping",
      description: "A fun trip",
      price: 800,
      tripId: "asdfasfd",
      media: [],
      from: new Date(Date.now()),
      to: new Date(Date.now()),
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now())
    },
    {
      id: "asdfasfd9",
      name: "Trip 9",
      address: "116 Main St, USA, 12345",
      activity: "Skiing",
      description: "A fun trip",
      price: 900,
      tripId: "asdfasfd",
      media: [],
      from: new Date(Date.now()),
      to: new Date(Date.now()),
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now())
    },
    {
      id: "asdfasfd10",
      name: "Trip 10",
      address: "117 Main St, USA, 12345",
      activity: "Fishing",
      description: "A fun trip",
      price: 1000,
      tripId: "asdfasfd",
      media: [],
      from: new Date(Date.now()),
      to: new Date(Date.now()),
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now())
    },
    {
      id: "asdfasfd11",
      name: "Trip 11",
      address: "118 Main St, USA, 12345",
      activity: "Hiking",
      description: "A fun trip",
      price: 1100,
      tripId: "asdfasfd",
      media: [],
      from: new Date(Date.now()),
      to: new Date(Date.now()),
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now())
    },
    {
      id: "asdfasfd12",
      name: "Trip 12",
      address: "119 Main St, USA, 12345",
      activity: "Swimming",
      description: "A fun trip",
      price: 1200,
      tripId: "asdfasfd",
      media: [],
      from: new Date(Date.now()),
      to: new Date(Date.now()),
      createdAt: new Date(Date.now()),
      updatedAt: new Date()
    },
    {
      id: "asdfasfd13",
      name: "Trip 13",
      address: "120 Main St, USA, 12345",
      activity: "Camping",
      description: "A fun trip",
      price: 1300,
      tripId: "asdfasfd",
      media: [],
      from: new Date(Date.now()),
      to: new Date(Date.now()),
      createdAt: new Date(Date.now()),
      updatedAt: new Date()
    },
    {
      id: "asdfasfd14",
      name: "Trip 14",
      address: "121 Main St, USA, 12345",
      activity: "Skiing",
      description: "A fun trip",
      price: 1400,
      tripId: "asdfasfd",
      media: [],
      from: new Date(Date.now()),
      to: new Date(Date.now()),
      createdAt: new Date(Date.now()),
      updatedAt: new Date()
    },
    {
      id: "asdfasfd15",
      name: "Trip 15",
      address: "122 Main St, USA, 12345",
      activity: "Fishing",
      description: "A fun trip",
      price: 1500,
      tripId: "asdfasfd",
      media: [],
      from: new Date(Date.now()),
      to: new Date(Date.now()),
      createdAt: new Date(Date.now()),
      updatedAt: new Date()
    }
  ];
}

export async function TripItems() {
  const data = await getData();

  return (
    <Card className="rounded-lg border-none mt-6">
      <CardContent className="p-6">
        <h2 className="text-2xl font-semibold">Itinerary</h2>
        <DataTable columns={columns} data={data} />
      </CardContent>
    </Card>
  );
}
