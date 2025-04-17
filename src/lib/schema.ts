import { pgTable, text, timestamp, boolean, uuid } from 'drizzle-orm/pg-core';
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow()
});

export const categories = pgTable('categories', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique()
});

export const templates = pgTable("templates", {
  id: text("id").primaryKey(),
  category: text("category").notNull(),
  name: text("name").notNull(),
  imageUrl: text("image_url").notNull(),
});

export const memes = pgTable("memes", {
  id: uuid("id").primaryKey().defaultRandom(),
  templateId: text("template_id").notNull(),
  topText: text("top_text"),
  bottomText: text("bottom_text"),
  createdAt: timestamp("created_at").defaultNow(),
  userId: text("user_id"),
});

// Insert Schemas
export const insertUserSchema = createInsertSchema(users).pick({
  name: true,
  email: true,
});

export const insertCategorySchema = createInsertSchema(categories).pick({
  name: true,
  slug: true,
});

export const insertTemplateSchema = createInsertSchema(templates).pick({
  name: true,
  imageUrl: true,
  category: true,
});

export const insertMemeSchema = createInsertSchema(memes).pick({
  templateId: true,
  topText: true,
  bottomText: true,
  userId: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

export type InsertTemplate = z.infer<typeof insertTemplateSchema>;
export type Template = typeof templates.$inferSelect;

export type InsertMeme = z.infer<typeof insertMemeSchema>;
export type Meme = typeof memes.$inferSelect;

// AI Generation Types
export const aiMemePromptSchema = z.object({
  prompt: z.string().min(1, "Prompt is required"),
});

export type AiMemePrompt = z.infer<typeof aiMemePromptSchema>;

export const aiMemeResponseSchema = z.object({
  topText: z.string(),
  bottomText: z.string(),
});

export type AiMemeResponse = z.infer<typeof aiMemeResponseSchema>;
