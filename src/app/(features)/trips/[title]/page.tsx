import Link from "next/link";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import prisma from "@/lib/db";
import { Trip, TripItem } from "@prisma/client";
import { TripHeader } from "../../../../components/trip/trip-header";
import { TripItems } from "../../../../components/trip/trip-items";

export default async function TripPage({
  params
}: {
  params: { title: string };
}) {
  const tripTitle = params.title.replaceAll("%20", " ");

  const trip: Trip = await prisma.trip.findUniqueOrThrow({
    where: { title: tripTitle },
    include: { tripItems: true }
  });

  const tripItems: TripItem[] = await prisma.tripItem.findMany({
    where: { trip: { title: tripTitle } }
  });

  return (
    <ContentLayout title="Dashboard">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <BreadcrumbPage>Trips</BreadcrumbPage>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{tripTitle}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <TripHeader trip={trip} />
      <Separator className="my-8" />
      <TripItems tripTitle={tripTitle} trip={trip} tripItems={tripItems} />
    </ContentLayout>
  );
}
