import { useToast } from "./use-toast";

export const useHandleCopy = (
	value: string | null | undefined,
	notification?: string
) => {
	const { toast } = useToast();

	const handleCopy = () => {
		if (!value) return;

		navigator.clipboard
			.writeText(value)
			.then(() => {
				toast({
					title: notification
				});
			})
			.catch((err) => {
				console.error("Failed to copy: ", err);
			});
	};

	return { handleCopy };
};
