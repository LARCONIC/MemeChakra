import { z } from "zod";

export const templateSchema = z.object({
  id: z.string(),
  name: z.string(),
  imageUrl: z.string(),
  categoryId: z.string(),
  category: z.string().optional(),
  popular: z.boolean().optional(),
  trending: z.boolean().optional()
});

export const categorySchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string()
});

export type Template = z.infer<typeof templateSchema>;
export type Category = z.infer<typeof categorySchema>;

export const aiMemePromptSchema = z.object({
  prompt: z.string(),
  template: templateSchema
});

export type AiMemeResponse = {
  text: string;
  topText?: string;
  bottomText?: string;
  error?: string;
};