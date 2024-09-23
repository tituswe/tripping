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
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
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
  const [inputValue, setInputValue] = useState("");
  const [popoverOpen, setPopoverOpen] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSelectActivity = (activity: string) => {
    form.setValue("activity", activity);
    setInputValue(activity);
    setPopoverOpen(false);
  };

  return (
    <FormItem className="flex flex-col">
      <FormLabel>{`${field.name.charAt(0).toUpperCase()}${field.name.substring(
        1
      )}`}</FormLabel>
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant="outline"
              role="combobox"
              className={cn(
                "w-[240px] justify-between",
                !field.value && "text-muted-foreground"
              )}
            >
              {field.value || "Select language"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="w-[240px] p-0">
          <Command>
            <CommandInput
              placeholder="Search or add activity..."
              value={inputValue}
              onChangeCapture={handleInputChange}
            />
            <CommandList>
              <CommandEmpty>No activity found.</CommandEmpty>
              <CommandGroup>
                {activities.map((activity) => (
                  <CommandItem
                    value={activity}
                    key={activity}
                    onSelect={() => handleSelectActivity(activity)}
                    className="cursor-pointer"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        activity === field.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <Badge>{activity}</Badge>
                  </CommandItem>
                ))}
                {inputValue &&
                  !activities.find((activity) => activity === inputValue) && (
                    <CommandItem
                      value={inputValue}
                      onSelect={() => handleSelectActivity(inputValue)}
                      className="cursor-pointer"
                    >
                      <span className="mr-2">Create</span>
                      <Badge>{inputValue}</Badge>
                    </CommandItem>
                  )}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <FormMessage />
    </FormItem>
  );
}
