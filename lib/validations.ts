import * as z from "zod";

export const QuestionValidation = z.object({
  title: z
    .string()
    .nonempty("Title is required")
    .max(80, "Title cannot exceed 80 characters"),
  explanation: z
    .string()
    .min(20, "Explanation must be at least 20 characters")
    .max(2500, "Explanation cannot exceed 2500 characters"),
  tags: z
    .array(z.string().nonempty("Tag cannot be empty").max(140, "Tag max 140 characters"))
    .max(10, "Maximum 10 tags allowed"),
  anonymous: z.boolean(), // Add 'anonymous' field to the schema
});

export const AnswerValidation = z.object({
  answer: z.string().min(10),
});

export const ProfileValidation = z.object({
  name: z.string().min(5).max(50),
  username: z.string().min(5).max(50),
  bio: z.union([z.string().min(5).max(50), z.literal("")]),
  portfolioWebsite: z.union([z.string().url(), z.literal("")]),
  location: z.union([z.string().min(5).max(50), z.literal("")]),
});
