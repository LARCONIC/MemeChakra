import { useState } from "react";
import { templates } from "@/data/templates";

interface PopularTemplatesProps {
  language: "english" | "hindi";
}

export default function PopularTemplates({ language }: PopularTemplatesProps) {
  const [activeCategory, setActiveCategory] = useState("all");
  
  const content = {
    english: {
      title: "Popular Templates",
      description: "Browse our collection of trending desi meme templates",
      allTemplates: "All Templates",
      bollywood: "Bollywood",
      cricket: "Cricket",
      trending: "Trending",
      viewAll: "View All Templates",
      useTemplate: "Use Template"
    },
    hindi: {
      title: "लोकप्रिय टेम्पलेट्स",
      description: "ट्रेंडिंग देसी मीम टेम्पलेट्स का हमारा कलेक्शन देखें",
      allTemplates: "सभी टेम्पलेट्स",
      bollywood: "बॉलीवुड",
      cricket: "क्रिकेट",
      trending: "ट्रेंडिंग",
      viewAll: "सभी टेम्पलेट्स देखें",
      useTemplate: "टेम्पलेट का उपयोग करें"
    }
  };

  const popularTemplates = templates.filter(template => 
    template.popular && (activeCategory === "all" || template.category === activeCategory)
  ).slice(0, 6);

  return (
    <section id="templates" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-textDark">
            {content[language].title}
          </h2>
          <p className="text-lg text-textLight max-w-2xl mx-auto">
            {content[language].description}
          </p>
        </div>
        
        {/* Template Categories */}
        <div className="mb-8 flex justify-center">
          <div className="category-selector justify-center">
            <button 
              className={`category-pill ${activeCategory === "all" ? "active" : "bg-bgMedium"}`}
              onClick={() => setActiveCategory("all")}
            >
              {content[language].allTemplates}
            </button>
            <button 
              className={`category-pill ${activeCategory === "bollywood" ? "active" : "bg-bgMedium"}`}
              onClick={() => setActiveCategory("bollywood")}
            >
              {content[language].bollywood}
            </button>
            <button 
              className={`category-pill ${activeCategory === "cricket" ? "active" : "bg-bgMedium"}`}
              onClick={() => setActiveCategory("cricket")}
            >
              {content[language].cricket}
            </button>
            <button 
              className={`category-pill ${activeCategory === "trending" ? "active" : "bg-bgMedium"}`}
              onClick={() => setActiveCategory("trending")}
            >
              {content[language].trending}
            </button>
          </div>
        </div>
        
        {/* Templates Gallery */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {popularTemplates.map((template) => (
            <div key={template.id} className="template-card cursor-pointer">
              <img 
                src={template.imageUrl}
                alt={template.name}
                className="w-full rounded-lg"
              />
              <div className="template-card-overlay">
                <p className="text-sm">{content[language].useTemplate}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <button 
            className="chakra-btn-secondary py-3 px-8 rounded-lg"
            onClick={() => window.location.href = "#create"}
          >
            {content[language].viewAll}
          </button>
        </div>
      </div>
    </section>
  );
}
