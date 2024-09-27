"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Trip } from "@prisma/client";
import { format } from "date-fns";
import { CalendarDays } from "lucide-react";

interface TripHeaderProps {
  trip: Trip;
}

export function TripHeader({ trip }: TripHeaderProps) {
  return (
    <Card className="rounded-lg border-none mt-6">
      <CardContent className="p-6 space-y-4">
        <h2 className="text-2xl font-semibold">{trip.title}</h2>
        <Alert>
          <CalendarDays className="h-4 w-4" />
          <AlertTitle className="font-semibold">Upcoming Trip!</AlertTitle>
          <AlertDescription className="space-x-2">
            <span>You&apos;re going on a trip to</span>
            <Badge variant="secondary">{trip.location}</Badge>
            <span>from</span>
            <Badge variant="secondary">{format(trip.from, "PPP")}</Badge>
            <span>to</span>
            <Badge variant="secondary">{format(trip.to, "PPP")}</Badge>
          </AlertDescription>
        </Alert>
        <p className="text-gray-400 text-sm">{trip.description}</p>
      </CardContent>
    </Card>
  );
}
