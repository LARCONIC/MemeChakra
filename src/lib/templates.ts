// Default categories and templates for fallback
export const defaultCategories = [
  { id: 1, name: "All", slug: "all" },
  { id: 2, name: "Bollywood", slug: "bollywood" },
  { id: 3, name: "Cricket", slug: "cricket" },
  { id: 4, name: "Politics", slug: "politics" },
  { id: 5, name: "Trending", slug: "trending" },
  { id: 6, name: "Classic", slug: "classic" }
];

export const defaultTemplates = [
  {
    id: 1,
    name: "Shocked Babu Bhaiya",
    imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=500&h=350&q=80",
    category: "bollywood",
    categoryId: 2,
    popular: true,
    trending: true
  },
  {
    id: 2,
    name: "Hera Pheri Paisa",
    imageUrl: "https://images.unsplash.com/photo-1569003339405-ea396a5a8a90?auto=format&fit=crop&w=500&h=350&q=80",
    category: "bollywood",
    categoryId: 2,
    popular: true,
    trending: false
  },
  {
    id: 3,
    name: "Kabhi Khushi",
    imageUrl: "https://images.unsplash.com/photo-1447684808650-354ae64db5b8?auto=format&fit=crop&w=500&h=350&q=80",
    category: "bollywood",
    categoryId: 2,
    popular: true,
    trending: false
  },
  {
    id: 4,
    name: "Cricket Celebration",
    imageUrl: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=500&h=350&q=80",
    category: "cricket",
    categoryId: 3,
    popular: true,
    trending: true
  }
];

// These will be populated from API calls
export let categories = [...defaultCategories];
export let templates = [...defaultTemplates];
