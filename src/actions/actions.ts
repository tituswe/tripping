"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createTrip(formData: any) {
  await prisma.trip.create({
    data: {
      title: formData.title,
      location: formData.location,
      description: formData.description,
      from: formData.duration.from,
      to: formData.duration.to
    }
  });

  revalidatePath("/");
}

export async function createTripItem(tripTitle: string, formData: any) {
  const trip = await prisma.trip.findUniqueOrThrow({
    where: { title: tripTitle }
  });

  await prisma.tripItem.create({
    data: {
      name: formData.name,
      address: formData.address,
      activity: formData.activity,
      description: formData.description,
      price: formData.price,
      tripId: trip.id,
      media: formData.media,
      from: formData.from,
      to: formData.to
    }
  });

  revalidatePath(`/trips/${tripTitle}`);
}
