"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ItemFormSchema } from "@/lib/validation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@radix-ui/react-popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import React, { useState } from "react";
import { ControllerRenderProps } from "react-hook-form";

interface DateTimeInputProps {
  field:
    | ControllerRenderProps<ItemFormSchema, "from">
    | ControllerRenderProps<ItemFormSchema, "to">;
}

export function DateTimeInput({ field }: DateTimeInputProps) {
  const [time, setTime] = useState(
    field.value ? format(field.value, "HH:mm") : undefined
  );

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = event.target.value;
    setTime(newTime);

    const timeParts = newTime.split(":");
    if (timeParts.length === 2) {
      const [hours, minutes] = timeParts.map(Number);
      if (
        !isNaN(hours) &&
        !isNaN(minutes) &&
        hours >= 0 &&
        hours < 24 &&
        minutes >= 0 &&
        minutes < 60
      ) {
        const updatedDate = field.value ? new Date(field.value) : new Date();
        updatedDate.setHours(hours);
        updatedDate.setMinutes(minutes);
        field.onChange(updatedDate);
      }
    }
  };

  const handleTimeBlur = () => {
    const timeParts = time?.split(":");
    if (
      timeParts?.length !== 2 ||
      isNaN(Number(timeParts[0])) ||
      isNaN(Number(timeParts[1]))
    ) {
      setTime(undefined);
      const updatedDate = field.value ? new Date(field.value) : undefined;
      updatedDate?.setHours(0);
      updatedDate?.setMinutes(0);
      field.onChange(updatedDate);
    }
  };

  const handleDateChange = (date: Date | undefined) => {
    field.onChange(date);
    if (!date) {
      setTime(undefined);
    } else if (time) {
      const timeParts = time.split(":");
      if (timeParts.length === 2) {
        const [hours, minutes] = timeParts.map(Number);
        if (
          !isNaN(hours) &&
          !isNaN(minutes) &&
          hours >= 0 &&
          hours < 24 &&
          minutes >= 0 &&
          minutes < 60
        ) {
          date.setHours(hours);
          date.setMinutes(minutes);
        }
      }
    }
  };

  return (
    <div className="flex space-x-6">
      <Popover>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant={"outline"}
              className={cn(
                "w-[240px] pl-3 text-left font-normal",
                !field.value && "text-muted-foreground"
              )}
            >
              {field.value ? (
                format(field.value, "MMM do, yyyy")
              ) : (
                <span>Pick a date</span>
              )}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0 bg-background border rounded-md"
          align="start"
        >
          <Calendar
            mode="single"
            selected={field.value}
            onSelect={handleDateChange}
            disabled={(date) =>
              date >
                new Date(
                  new Date().setFullYear(new Date().getFullYear() + 1)
                ) || date < new Date("1900-01-01")
            }
            initialFocus
          />
        </PopoverContent>
      </Popover>
      <FormControl>
        <Input
          type="time"
          className="w-36"
          value={time}
          onChange={handleTimeChange}
          onBlur={handleTimeBlur}
        />
      </FormControl>
    </div>
  );
}
