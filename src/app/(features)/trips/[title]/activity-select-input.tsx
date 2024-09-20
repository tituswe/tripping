"use client";

import { Check, ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import { AddItemFormSchema } from "@/components/data-table/data-table-add-item-dialog";
import { ControllerRenderProps, UseFormReturn } from "react-hook-form";

interface ActivitySelectInputProps {
  form: UseFormReturn<AddItemFormSchema>;
  field: ControllerRenderProps<AddItemFormSchema, "activity">;
  activities: string[];
}

export function ActivitySelectInput({
  form,
  field,
  activities
}: ActivitySelectInputProps) {
  return (
    <FormItem className="flex flex-col">
      <FormLabel>{`${field.name.charAt(0).toUpperCase()}${field.name.substring(
        1
      )}`}</FormLabel>{" "}
      <Popover>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant="outline"
              role="combobox"
              className={cn(
                "w-[200px] justify-between",
                !field.value && "text-muted-foreground"
              )}
            >
              {field.value
                ? activities.find((activity) => activity === field.value)
                : "Select activity"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search activity..." />
            <CommandList>
              <CommandEmpty>No activity found.</CommandEmpty>
              <CommandGroup>
                {activities.map((activity) => (
                  <CommandItem
                    value={activity}
                    key={activity}
                    onSelect={() => {
                      form.setValue("activity", activity);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        activity === field.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {activity}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <FormMessage />
    </FormItem>
  );
}
