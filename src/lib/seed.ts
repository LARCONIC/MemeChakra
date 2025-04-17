import { db } from "./db";
import { users, categories, templates } from "./schema";
import { eq } from "drizzle-orm";

export async function seed() {
  try {
    // Clear existing data
    await db.delete(templates);
    await db.delete(categories);
    await db.delete(users);

    // Seed categories
    const categoriesData = [
      { id: "1", name: "All", slug: "all" },
      { id: "2", name: "Classic", slug: "classic" },
      { id: "3", name: "Desi", slug: "desi" },
      { id: "4", name: "Trending", slug: "trending" }
    ];

    for (const category of categoriesData) {
      await db.insert(categories).values(category);
    }

    // Seed templates
    const templatesData = [
      {
        id: "1",
        name: "Drake Hotline Bling",
        imageUrl: "https://i.imgflip.com/30b1gx.jpg",
        categoryId: "2",
        category: "classic",
        popular: true,
        trending: true
      },
      {
        id: "2",
        name: "Distracted Boyfriend",
        imageUrl: "https://i.imgflip.com/1ur9b0.jpg",
        categoryId: "2",
        category: "classic",
        popular: true,
        trending: false
      },
      {
        id: "3",
        name: "Running Away Balloon",
        imageUrl: "https://i.imgflip.com/261o3j.jpg",
        categoryId: "2",
        category: "classic",
        popular: false,
        trending: false
      },
      {
        id: "4",
        name: "Baburao",
        imageUrl: "https://i.imgflip.com/hera.jpg",
        categoryId: "3",
        category: "desi",
        popular: true,
        trending: true
      },
      {
        id: "5",
        name: "Jethalal",
        imageUrl: "https://i.imgflip.com/tmkd.jpg",
        categoryId: "3",
        category: "desi",
        popular: true,
        trending: false
      }
    ];

    for (const template of templatesData) {
      await db.insert(templates).values(template);
    }

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}