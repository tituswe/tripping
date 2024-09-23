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
import prisma from "@/lib/db";
import { TripItem } from "@prisma/client";
import { TripItems } from "./trip-items";

export default async function TripPage({
  params
}: {
  params: { title: string };
}) {
  const tripTitle = params.title.replaceAll("%20", " ");

  const data: TripItem[] = await prisma.tripItem.findMany({
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
      <TripItems tripTitle={tripTitle} data={data} />
    </ContentLayout>
  );
}
