import { z } from "zod";

export const scoreSchema = z.object({
  score: z.number().min(1, "Score must be at least 1").max(45, "Score cannot exceed 45"),
  playedAt: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
});

export const authSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const charitySelectionSchema = z.object({
  charityId: z.string().uuid("Invalid charity ID"),
  percentage: z.number().min(10, "Minimum contribution is 10%").max(100, "Maximum is 100%"),
});
