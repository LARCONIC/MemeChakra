import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
});

export const templates = pgTable("templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  imageUrl: text("image_url").notNull(),
  categoryId: integer("category_id").references(() => categories.id),
  popular: boolean("popular").default(false),
  trending: boolean("trending").default(false),
});

export const memes = pgTable("memes", {
  id: serial("id").primaryKey(),
  templateId: integer("template_id").references(() => templates.id),
  topText: text("top_text"),
  bottomText: text("bottom_text"),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert Schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertCategorySchema = createInsertSchema(categories).pick({
  name: true,
  slug: true,
});

export const insertTemplateSchema = createInsertSchema(templates).pick({
  name: true,
  imageUrl: true,
  categoryId: true,
  popular: true,
  trending: true,
});

export const insertMemeSchema = createInsertSchema(memes).pick({
  templateId: true,
  topText: true,
  bottomText: true,
  imageUrl: true,
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
