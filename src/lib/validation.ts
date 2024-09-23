import { z } from "zod";

export const formSchema = z.object({
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
