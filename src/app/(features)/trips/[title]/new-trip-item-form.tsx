"use client";

import { UseFormReturn } from "react-hook-form";

import { AddItemFormSchema } from "@/components/data-table/data-table-add-item-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import CurrencyInput from "@/components/ui/currency-input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DateTimeInput } from "./date-time-input";

interface NewTripItemFormProps {
  form: UseFormReturn<AddItemFormSchema>;
  onSubmit: (data: AddItemFormSchema) => void;
}

export function NewTripItemForm({ form, onSubmit }: NewTripItemFormProps) {
  return (
    <Card className="rounded-lg border-none">
      <CardContent className="pt-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="from"
              render={({ field }) => <DateTimeInput field={field} />}
            />
            <FormField
              control={form.control}
              name="to"
              render={({ field }) => <DateTimeInput field={field} />}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <FormField
              control={form.control}
              name="activity"
              render={({ field }) => (
                <ActivitySelectInput
                  form={form}
                  field={field}
                  activities={["Hiking", "Camping", "Sightseeing"]}
                />
              )}
            /> */}
            <FormField
              control={form.control}
              name="activity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Activity</FormLabel>
                  <FormControl>
                    <Input placeholder="Activity" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <CurrencyInput
              form={form}
              name="price"
              label="Price"
              placeholder="$0.00"
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="A 7 day trip focused on nature and relaxation..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Create</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
