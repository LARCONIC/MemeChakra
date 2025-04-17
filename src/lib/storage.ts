import { eq, desc } from "drizzle-orm";
import { db } from "./db";
import { nanoid } from 'nanoid';
import {
  users,
  categories,
  templates,
  memes,
  type User,
  type InsertUser,
  type Category,
  type InsertCategory,
  type Template,
  type InsertTemplate,
  type Meme,
  type InsertMeme
} from "./schema";

export const storage = {
  // User operations
  async getUserById(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  },

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  },

  async createUser(data: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values({
      id: nanoid(),
      ...data,
      createdAt: new Date()
    }).returning();
    return user;
  },

  // Template operations
  async getAllTemplates(): Promise<Template[]> {
    return db.select().from(templates);
  },

  async getTemplateById(id: string): Promise<Template | undefined> {
    const [template] = await db.select().from(templates).where(eq(templates.id, id));
    return template;
  },

  async getTemplatesByCategory(categoryId: string): Promise<Template[]> {
    return db.select()
      .from(templates)
      .where(eq(templates.category, categoryId));
  },

  async createTemplate(data: InsertTemplate): Promise<Template> {
    const [template] = await db.insert(templates).values({
      id: nanoid(),
      ...data
    }).returning();
    return template;
  },

  // Category operations
  async getAllCategories(): Promise<Category[]> {
    return db.select().from(categories);
  },

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.slug, slug));
    return category;
  },

  async createCategory(data: InsertCategory): Promise<Category> {
    const [category] = await db.insert(categories).values({
      id: nanoid(),
      ...data
    }).returning();
    return category;
  },

  // Meme operations
  async createMeme(data: InsertMeme): Promise<Meme> {
    const [meme] = await db.insert(memes).values({
      id: nanoid(),
      ...data,
      createdAt: new Date()
    }).returning();
    return meme;
  },

  async getMemeById(id: string): Promise<Meme | undefined> {
    const [meme] = await db.select().from(memes).where(eq(memes.id, id));
    return meme;
  },

  async getRecentMemes(): Promise<Meme[]> {
    return db.select()
      .from(memes)
      .orderBy(desc(memes.createdAt))
      .limit(8);
  },

  async getMemesByUserId(userId: string): Promise<Meme[]> {
    return db.select()
      .from(memes)
      .where(eq(memes.userId, userId))
      .orderBy(desc(memes.createdAt))
      .limit(8);
  }
};
