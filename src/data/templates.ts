import { Template, Category } from "../shared/schema";

export const defaultCategories: Category[] = [
  { id: "1", name: "All", slug: "all" },
  { id: "2", name: "Classic", slug: "classic" },
  { id: "3", name: "Desi", slug: "desi" },
  { id: "4", name: "Trending", slug: "trending" },
  { id: "5", name: "Anime", slug: "anime" }
];

export const defaultTemplates: Template[] = [
  {
    id: "1",
    name: "Drake Hotline Bling",
    imageUrl: "/images/templates/drake.jpg",
    categoryId: "2",
    category: "classic",
    popular: true,
    trending: false
  },
  {
    id: "2",
    name: "Distracted Boyfriend",
    imageUrl: "/images/templates/distracted.jpg",
    categoryId: "2",
    category: "classic",
    popular: true,
    trending: false
  },
  {
    id: "3",
    name: "Running Away Balloon",
    imageUrl: "/images/templates/balloon.jpg",
    categoryId: "2",
    category: "classic",
    popular: false,
    trending: false
  },
  {
    id: "4",
    name: "Baburao",
    imageUrl: "/images/templates/baburao.jpg",
    categoryId: "3",
    category: "desi",
    popular: true,
    trending: true
  },
  {
    id: "5",
    name: "Jethalal",
    imageUrl: "/images/templates/jethalal.jpg",
    categoryId: "3",
    category: "desi",
    popular: true,
    trending: false
  },
  {
    id: "6",
    name: "Giga Chad",
    imageUrl: "/images/templates/giga-chad.jpg",
    categoryId: "4",
    category: "trending",
    popular: true,
    trending: true
  },
  {
    id: "7",
    name: "Trade Offer",
    imageUrl: "/images/templates/trade-offer.jpg",
    categoryId: "4",
    category: "trending",
    popular: true,
    trending: true
  },
  {
    id: "8",
    name: "Pointing Spider-Men",
    imageUrl: "/images/templates/pointing.jpg",
    categoryId: "4",
    category: "trending",
    popular: true,
    trending: true
  },
  {
    id: "9",
    name: "One Punch Man OK",
    imageUrl: "/images/templates/one-punch.jpg",
    categoryId: "5",
    category: "anime",
    popular: true,
    trending: true
  },
  {
    id: "10",
    name: "JoJo Approach",
    imageUrl: "/images/templates/jojo.jpg",
    categoryId: "5",
    category: "anime",
    popular: true,
    trending: true
  },
  {
    id: "11",
    name: "Naruto Run",
    imageUrl: "/images/templates/naruto.jpg",
    categoryId: "5",
    category: "anime",
    popular: false,
    trending: true
  }
];

export const templates = defaultTemplates;