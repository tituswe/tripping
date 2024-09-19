"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useState } from "react";

interface DataTableAddItemDialogProps<TData> {}

export function DataTableAddItemDialog<
  TData
>({}: DataTableAddItemDialogProps<TData>) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto hidden h-8 lg:flex"
        >
          <Plus className="mr-2 h-4 w-4" />
          New item
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New item</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new item.
          </DialogDescription>
        </DialogHeader>
        Placeholder
      </DialogContent>
    </Dialog>
  );
}
