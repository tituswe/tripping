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
