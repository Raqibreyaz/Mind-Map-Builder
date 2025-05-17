import { z } from "zod";

export const EditNodeSchema = z.object({
  label: z.string().min(3, { message: "Node label required!" }),
  name: z
    .string()
    .min(3, { message: "Node name should be at least 3 characters" }),
});

export type editNodeSchemaType = z.infer<typeof EditNodeSchema>;
