import { z } from "zod";

export const resourceSchema = z.object({
  title: z.string().trim().min(2, "Title should contain at least 2 characters"),
  description: z
    .string()
    .trim()
    .min(2, "Description should contain at least 2 characters"),
  categoryId: z.string().min(1, "Please select a category"),
  condition: z.enum(["NEW", "LIKE_NEW", "GOOD", "FAIR", "POOR"]),
  location: z
    .string()
    .trim()
    .min(2, "Location should contain at least 2 characters"),
  city: z.string().trim().min(2, "City should contain at least 2 characters"),

  // New
  imageUrl: z.string().url("Invalid image URL").optional(),
});

export type ResourceInput = z.infer<typeof resourceSchema>;
