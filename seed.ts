import { db } from "./db";
import { 
  users, 
  categories, 
  templates, 
  type InsertCategory, 
  type InsertTemplate
} from "@shared/schema";
import { eq } from "drizzle-orm";

async function seed() {
  console.log("Seeding database...");
  
  // First clean up existing data 
  try {
    await db.delete(templates);
    await db.delete(categories);
    await db.delete(users);
    console.log("Cleaned existing data");
  } catch (error) {
    console.error("Error cleaning data:", error);
  }

  // Insert categories
  const defaultCategories: InsertCategory[] = [
    { name: "All", slug: "all" },
    { name: "Bollywood", slug: "bollywood" },
    { name: "Cricket", slug: "cricket" },
    { name: "Politics", slug: "politics" },
    { name: "Trending", slug: "trending" },
    { name: "Classic", slug: "classic" }
  ];
  
  console.log("Inserting categories...");
  for (const category of defaultCategories) {
    await db.insert(categories).values(category);
  }
  console.log("Categories inserted");
  
  // Get category IDs
  const allCategories = await db.select().from(categories);
  const categoryMap = new Map(allCategories.map(c => [c.slug, c.id]));
  
  const bollywoodCategoryId = categoryMap.get("bollywood");
  const cricketCategoryId = categoryMap.get("cricket");
  const politicsCategoryId = categoryMap.get("politics");
  const trendingCategoryId = categoryMap.get("trending");
  const classicCategoryId = categoryMap.get("classic");
  
  if (!bollywoodCategoryId || !cricketCategoryId || !politicsCategoryId || !trendingCategoryId || !classicCategoryId) {
    console.error("Could not find all category IDs");
    return;
  }
  
  // Insert templates
  const defaultTemplates: InsertTemplate[] = [
    // Bollywood templates
    {
      name: "Shocked Babu Bhaiya",
      imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=500&h=350&q=80",
      categoryId: bollywoodCategoryId,
      popular: true,
      trending: true
    },
    {
      name: "Hera Pheri Paisa",
      imageUrl: "https://images.unsplash.com/photo-1569003339405-ea396a5a8a90?auto=format&fit=crop&w=500&h=350&q=80",
      categoryId: bollywoodCategoryId,
      popular: true,
      trending: false
    },
    {
      name: "Kabhi Khushi",
      imageUrl: "https://images.unsplash.com/photo-1447684808650-354ae64db5b8?auto=format&fit=crop&w=500&h=350&q=80",
      categoryId: bollywoodCategoryId,
      popular: true,
      trending: false
    },
    
    // Cricket templates
    {
      name: "Cricket Celebration",
      imageUrl: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=500&h=350&q=80",
      categoryId: cricketCategoryId,
      popular: true,
      trending: true
    },
    {
      name: "Kohli Angry",
      imageUrl: "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?auto=format&fit=crop&w=500&h=350&q=80",
      categoryId: cricketCategoryId,
      popular: true,
      trending: false
    },
    
    // Politics templates
    {
      name: "Political Face",
      imageUrl: "https://images.unsplash.com/photo-1490971588422-52f6262a237a?auto=format&fit=crop&w=500&h=350&q=80",
      categoryId: politicsCategoryId,
      popular: false,
      trending: true
    },
    
    // Trending templates
    {
      name: "Viral Trend",
      imageUrl: "https://images.unsplash.com/photo-1528642474498-1af0c17fd8c3?auto=format&fit=crop&w=500&h=350&q=80",
      categoryId: trendingCategoryId,
      popular: true,
      trending: true
    },
    
    // Classic templates
    {
      name: "Classic Meme",
      imageUrl: "https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?auto=format&fit=crop&w=500&h=350&q=80",
      categoryId: classicCategoryId,
      popular: false,
      trending: false
    }
  ];
  
  console.log("Inserting templates...");
  for (const template of defaultTemplates) {
    await db.insert(templates).values(template);
  }
  console.log("Templates inserted");
  
  console.log("Seeding completed!");
}

seed().catch(error => {
  console.error("Error seeding database:", error);
  process.exit(1);
});