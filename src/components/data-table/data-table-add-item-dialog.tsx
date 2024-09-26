"use client";

import { useForm } from "react-hook-form";

import { createTripItem } from "@/actions/actions";
import { NewTripItemForm } from "@/components/trip/new-trip-item-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
import { controlSymbol } from "@/lib/utils";
import { ItemFormSchema, itemFormSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useParams } from "next/navigation";

interface DataTableAddItemDialogProps {
  activities: string[];
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function DataTableAddItemDialog({
  activities,
  open,
  setOpen
}: DataTableAddItemDialogProps) {
  const { toast } = useToast();
  const params = useParams<{ title: string }>();
  const tripTitle = params.title.replaceAll("%20", " ");

  const form = useForm<ItemFormSchema>({
    resolver: zodResolver(itemFormSchema),
    defaultValues: {
      name: "",
      address: "",
      activity: "",
      description: "",
      price: 0,
      from: undefined,
      to: undefined
    }
  });

  async function onSubmit(values: ItemFormSchema) {
    await createTripItem(tripTitle, values)
      .then(() => {
        toast({
          title: "Item added."
        });
        setOpen(false);
        form.reset();
      })
      .catch((e) => {
        toast({
          variant: "destructive",
          title: "Item already exists",
          description: "Please give your item another name.",
          action: (
            <ToastAction
              altText="Try again"
              className="border border-white px-2 py-1 rounded-md transition hover:border-transparent"
            >
              Try again
            </ToastAction>
          )
        });
      });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto hidden h-8 lg:flex"
        >
          <Plus className="mr-2 h-4 w-4" />
          <span className="mr-2">New item</span>
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <span className="text-xs">{controlSymbol()} </span>
            <span className="text-lg">↩</span>
          </kbd>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[calc(100vh-64px)] overflow-y-auto overflow-x-hidden">
        <DialogHeader>
          <DialogTitle>New item</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new item.
          </DialogDescription>
        </DialogHeader>
        <NewTripItemForm
          form={form}
          onSubmit={onSubmit}
          activities={activities}
        />
      </DialogContent>
    </Dialog>
  );
}
