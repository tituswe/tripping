"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";

import { createTripItem } from "@/actions/actions";
import { NewTripItemForm } from "@/app/(features)/trips/[title]/new-trip-item-form";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Please input a name."
  }),
  address: z.string().min(1),
  activity: z.string(),
  description: z.string(),
  price: z.number(),
  from: z.date().optional(),
  to: z.date().optional()
});

export type AddItemFormSchema = z.infer<typeof formSchema>;

interface DataTableAddItemDialogProps<TData> {}

export function DataTableAddItemDialog<
  TData
>({}: DataTableAddItemDialogProps<TData>) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const params = useParams<{ title: string }>();
  const tripTitle = params.title.replaceAll("%20", " ");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
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

  async function onSubmit(values: z.infer<typeof formSchema>) {
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
          New item
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[calc(100vh-64px)] overflow-y-auto overflow-x-hidden">
        <DialogHeader>
          <DialogTitle>New item</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new item.
          </DialogDescription>
        </DialogHeader>
        <NewTripItemForm form={form} onSubmit={onSubmit} />
      </DialogContent>
    </Dialog>
  );
}
