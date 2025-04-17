import { useState } from "react";
import { Card } from "@/components/ui/card";
import { templates } from "@/data/templates";
import { useToast } from "@/hooks/use-toast";

export default function PopularTemplates({ language }: { language: string }) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { toast } = useToast();

  const categories = [
    { id: "all", name: language === "hindi" ? "सभी" : "All" },
    { id: "classic", name: language === "hindi" ? "क्लासिक" : "Classic" },
    { id: "desi", name: language === "hindi" ? "देसी" : "Desi" },
    { id: "trending", name: language === "hindi" ? "ट्रेंडिंग" : "Trending" },
    { id: "anime", name: "Anime" }
  ];

  const popularTemplates = templates.filter(template =>
    selectedCategory === "all" ? template.popular : template.category === selectedCategory
  );

  const handleTemplateClick = (templateId: string) => {
    // Scroll to creator section
    const creatorSection = document.getElementById("creator");
    if (creatorSection) {
      creatorSection.scrollIntoView({ behavior: "smooth" });
    }
    toast({
      title: language === "hindi" ? "टेम्पलेट चुना गया" : "Template selected",
      description: language === "hindi" ? "मीम बनाने के लिए तैयार" : "Ready to create your meme"
    });
  };

  return (
    <section className="py-16 bg-background" id="templates">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            {language === "hindi" ? "लोकप्रिय टेम्पलेट्स" : "Popular Templates"}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {language === "hindi" 
              ? "हमारे कलेक्शन से बेहतरीन मीम टेम्पलेट्स चुनें"
              : "Browse our collection of trending meme templates"}
          </p>
        </div>

        <div className="flex gap-4 mb-8 overflow-x-auto pb-2 justify-center">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors
                ${selectedCategory === category.id 
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted-foreground/10"}`}
            >
              {category.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {popularTemplates.map((template) => (
            <Card
              key={template.id}
              className="group relative overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleTemplateClick(template.id)}
            >
              <img
                src={template.imageUrl}
                alt={template.name}
                className="w-full aspect-square object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4">
                <h3 className="text-white font-semibold text-center mb-2">{template.name}</h3>
                <span className="px-3 py-1 bg-primary/80 text-primary-foreground rounded-full text-sm">
                  {language === "hindi" ? "उपयोग करें" : "Use Template"}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
