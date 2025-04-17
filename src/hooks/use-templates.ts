import { useState } from "react";
import { defaultTemplates, defaultCategories } from "@/data/templates";
import { Template, Category } from "@shared/schema";

export function useTemplates() {
  const [categorySlug, setCategorySlug] = useState<string>('all');
  const [templates, setTemplates] = useState<Template[]>(
    defaultTemplates.map(template => ({
      ...template,
      category: defaultCategories.find((c: Category) => c.id === template.categoryId)?.slug || 'all'
    }))
  );

  const [categories] = useState<Category[]>(defaultCategories);

  const filteredTemplates = categorySlug === 'all' 
    ? templates 
    : templates.filter((t: Template) => t.category === categorySlug);

  return {
    templates: filteredTemplates,
    categories,
    categorySlug,
    setCategorySlug,
  };
}