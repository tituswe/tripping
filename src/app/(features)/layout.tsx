import AdminPanelLayout from "@/components/admin-panel/admin-panel-layout";
import prisma from "@/lib/db";
import { Trip } from "@prisma/client";

export default async function TabLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const trips: Trip[] = await prisma.trip.findMany();

  return <AdminPanelLayout trips={trips}>{children}</AdminPanelLayout>;
}
