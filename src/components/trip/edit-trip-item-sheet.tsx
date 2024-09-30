"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle
} from "@/components/ui/sheet";
import { useEffect, useState } from "react";

import { updateTripItem } from "@/actions/actions";
import CurrencyInput from "@/components/custom-ui/currency-input";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
import { ItemFormSchema, itemFormSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { TripItem } from "@prisma/client";
import { useForm } from "react-hook-form";
import { ActivitySelectInput } from "../custom-ui/activity-select-input";
import { DateTimeInput } from "../custom-ui/date-time-input";

interface EditTripItemSheetProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	tripTitle: string;
	activities: string[];
	actionableTripItem: TripItem | null;
}

export function EditTripItemSheet({
	open,
	onOpenChange,
	tripTitle,
	activities,
	actionableTripItem
}: EditTripItemSheetProps) {
	const { toast } = useToast();
	const [itemId, setItemId] = useState<string | undefined>(undefined);

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

	useEffect(() => {
		if (open && actionableTripItem) {
			setItemId(actionableTripItem.id);

			form.setValue("name", actionableTripItem.name);
			form.setValue("address", actionableTripItem.address);
			form.setValue("activity", actionableTripItem.activity);
			form.setValue("description", actionableTripItem.description);
			form.setValue("price", actionableTripItem.price);
			form.setValue("from", actionableTripItem.from ?? undefined);
			form.setValue("to", actionableTripItem.to ?? undefined);
		}
	}, [open, actionableTripItem, form]);

	async function onSubmit(values: ItemFormSchema) {
		await updateTripItem(tripTitle, itemId, values)
			.then(() => {
				toast({
					title: "Item updated."
				});
				onOpenChange(false);
				form.reset();
			})
			.catch((e) => {
				toast({
					variant: "destructive",
					title: "Woops! Something went wrong",
					description: "No idea why.",
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
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent className="overflow-auto">
				<SheetHeader className="mb-6">
					<SheetTitle>Edit item</SheetTitle>
					<SheetDescription>
						Make changes to your item here. Click save when you are done.
					</SheetDescription>
				</SheetHeader>
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
							render={({ field }) => (
								<FormItem>
									<FormLabel>From</FormLabel>
									<FormControl>
										<DateTimeInput field={field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="to"
							render={({ field }) => (
								<FormItem>
									<FormLabel>To</FormLabel>
									<FormControl>
										<DateTimeInput field={field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
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
						<FormField
							control={form.control}
							name="activity"
							render={({ field }) => (
								<ActivitySelectInput
									form={form}
									field={field}
									activities={activities}
								/>
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
						<SheetFooter>
							<SheetClose asChild>
								<Button type="submit">Save changes</Button>
							</SheetClose>
						</SheetFooter>
					</form>
				</Form>
			</SheetContent>
		</Sheet>
	);
}
