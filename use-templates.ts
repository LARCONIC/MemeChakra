import { useQuery } from "@tanstack/react-query";
import { defaultTemplates, defaultCategories } from "@/data/templates";
import { useEffect } from "react";
import { Category, Template } from "@shared/schema";

// Add category field to database templates for compatibility
function adaptTemplates(templates: Template[]): any[] {
  return templates.map(template => ({
    ...template,
    category: template.categoryId ? 
      defaultCategories.find(c => c.id === template.categoryId)?.slug || 'all' : 
      'all'
  }));
}

// This hook will fetch templates from the API and update the templates variable
export function useTemplates() {
  const templatesQuery = useQuery({
    queryKey: ['/api/templates'],
    refetchOnWindowFocus: false
  });

  const categoriesQuery = useQuery({
    queryKey: ['/api/categories'],
    refetchOnWindowFocus: false
  });
  
  return {
    templates: templatesQuery.data ? adaptTemplates(templatesQuery.data as Template[]) : defaultTemplates,
    categories: categoriesQuery.data as Category[] || defaultCategories,
    isLoading: templatesQuery.isLoading || categoriesQuery.isLoading,
    isError: templatesQuery.isError || categoriesQuery.isError,
    error: templatesQuery.error || categoriesQuery.error
  };
}

// This hook will fetch templates by category slug
export function useTemplatesByCategory(categorySlug: string) {
  const queryKey = categorySlug === 'all' 
    ? ['/api/templates'] 
    : ['/api/templates/category', categorySlug];
    
  const templatesQuery = useQuery({
    queryKey,
    refetchOnWindowFocus: false
  });
  
  return {
    templates: templatesQuery.data ? 
      adaptTemplates(templatesQuery.data as Template[]) : 
      defaultTemplates.filter(t => categorySlug === 'all' || t.category === categorySlug),
    isLoading: templatesQuery.isLoading,
    isError: templatesQuery.isError,
    error: templatesQuery.error
  };
}