import { z } from "zod";

export const EditNodeSchema = z.object({
  label: z.string().min(3, { message: "Node label required!" }),
  name: z
    .string()
    .min(3, { message: "Node name should be at least 3 characters" }),
  execution_time: z.coerce
    .number()
    .min(0, { message: "Invalid Execution time, it should be more than 0" }),
});

export type editNodeSchemaType = z.infer<typeof EditNodeSchema>;
