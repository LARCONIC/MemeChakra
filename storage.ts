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
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Template related methods
  getAllTemplates(): Promise<Template[]>;
  getTemplateById(id: number): Promise<Template | undefined>;
  getTemplatesByCategory(categorySlug: string): Promise<Template[]>;
  createTemplate(template: InsertTemplate): Promise<Template>;
  
  // Category related methods
  getAllCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Meme related methods
  createMeme(meme: InsertMeme): Promise<Meme>;
  getMemeById(id: number): Promise<Meme | undefined>;
  getMemesByUserId(userId: number): Promise<Meme[]>;
  getTrendingMemes(): Promise<Meme[]>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Template methods
  async getAllTemplates(): Promise<Template[]> {
    return await db.select().from(templates);
  }

  async getTemplateById(id: number): Promise<Template | undefined> {
    const [template] = await db.select().from(templates).where(eq(templates.id, id));
    return template;
  }

  async getTemplatesByCategory(categorySlug: string): Promise<Template[]> {
    // If "all" category, return all templates
    if (categorySlug === "all") {
      return this.getAllTemplates();
    }
    
    // Find the category by slug
    const category = await this.getCategoryBySlug(categorySlug);
    if (!category) {
      return [];
    }
    
    // Filter templates by category ID
    return await db.select().from(templates).where(eq(templates.categoryId, category.id));
  }

  async createTemplate(insertTemplate: InsertTemplate): Promise<Template> {
    const [template] = await db.insert(templates).values(insertTemplate).returning();
    return template;
  }

  // Category methods
  async getAllCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.slug, slug));
    return category;
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const [category] = await db.insert(categories).values(insertCategory).returning();
    return category;
  }

  // Meme methods
  async createMeme(insertMeme: InsertMeme): Promise<Meme> {
    const [meme] = await db.insert(memes).values(insertMeme).returning();
    return meme;
  }

  async getMemeById(id: number): Promise<Meme | undefined> {
    const [meme] = await db.select().from(memes).where(eq(memes.id, id));
    return meme;
  }

  async getMemesByUserId(userId: number): Promise<Meme[]> {
    // For now, we don't have userId in memes table, so just return recent memes
    return await db.select().from(memes).orderBy(desc(memes.createdAt)).limit(8);
  }

  async getTrendingMemes(): Promise<Meme[]> {
    // For now, without a view/like system, just return most recent
    return await db.select().from(memes).orderBy(desc(memes.createdAt)).limit(8);
  }
}

// Use database storage for production
export const storage = new DatabaseStorage();
