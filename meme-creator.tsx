import { useState, useEffect, useRef } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { defaultTemplates, defaultCategories } from "@/data/templates";
import { generateMeme, downloadMeme } from "@/lib/meme-utils";
import { useQuery } from "@tanstack/react-query";
import { Template, Category } from "@shared/schema";

// Add category field to templates
function adaptTemplates(templates: any[]): any[] {
  if (!Array.isArray(templates)) return defaultTemplates;
  
  return templates.map(template => {
    // Template already has category field, just return it
    if (template.category) return template;
    
    // Add category field based on categoryId
    return {
      ...template,
      category: template.categoryId ? 
        defaultCategories.find(c => c.id === template.categoryId)?.slug || 'all' : 
        'all'
    };
  });
}

interface MemeCreatorProps {
  language: "english" | "hindi";
}

export default function MemeCreator({ language }: MemeCreatorProps) {
  // Fetch templates and categories from API directly in component
  const templatesQuery = useQuery({
    queryKey: ['/api/templates'],
    refetchOnWindowFocus: false
  });
  
  const categoriesQuery = useQuery({
    queryKey: ['/api/categories'],
    refetchOnWindowFocus: false
  });

  const templates = templatesQuery.data ? adaptTemplates(templatesQuery.data as any[]) : defaultTemplates;
  const categories = categoriesQuery.data as Category[] || defaultCategories;
  
  const [selectedTemplate, setSelectedTemplate] = useState<any>(defaultTemplates[0]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [topText, setTopText] = useState("When your friend says");
  const [bottomText, setBottomText] = useState("AI memes aren't funny");
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const memeImageRef = useRef<HTMLImageElement>(null);
  const { toast } = useToast();
  
  // Set initial template only on first load
  const initialLoadRef = useRef(false);
  useEffect(() => {
    if (!initialLoadRef.current && templates && templates.length > 0) {
      setSelectedTemplate(templates[0]);
      initialLoadRef.current = true;
    }
  }, [templates]);

  const content = {
    english: {
      createTitle: "Create Your Meme",
      createDescription: "Select a template, add your text, and generate your perfect desi meme in seconds!",
      chooseTemplate: "Choose Template",
      categories: "Categories",
      searchPlaceholder: "Search templates...",
      aiMemeGenerator: "AI Meme Generator",
      aiPromptPlaceholder: "Describe your meme idea...",
      generateButton: "Generate",
      topText: "Top Text",
      topTextPlaceholder: "Add top text here...",
      bottomText: "Bottom Text",
      bottomTextPlaceholder: "Add bottom text here...",
      textStyle: "Text Style",
      previewAndSave: "Preview & Save",
      downloadMeme: "Download Meme",
      share: "Share"
    },
    hindi: {
      createTitle: "अपना मीम बनाएँ",
      createDescription: "टेम्पलेट चुनें, अपना टेक्स्ट जोड़ें, और सेकंड्स में अपना परफेक्ट देसी मीम जेनरेट करें!",
      chooseTemplate: "टेम्पलेट चुनें",
      categories: "श्रेणियाँ",
      searchPlaceholder: "टेम्पलेट खोजें...",
      aiMemeGenerator: "AI मीम जेनरेटर",
      aiPromptPlaceholder: "अपना मीम आइडिया बताएँ...",
      generateButton: "जेनरेट करें",
      topText: "ऊपर वाला टेक्स्ट",
      topTextPlaceholder: "ऊपर का टेक्स्ट लिखें...",
      bottomText: "नीचे वाला टेक्स्ट",
      bottomTextPlaceholder: "नीचे का टेक्स्ट लिखें...",
      textStyle: "टेक्स्ट स्टाइल",
      previewAndSave: "प्रीव्यू और सेव",
      downloadMeme: "मीम डाउनलोड करें",
      share: "शेयर करें"
    }
  };

  useEffect(() => {
    if (memeImageRef.current) {
      const img = memeImageRef.current;
      img.onload = () => {
        renderMeme();
      };
      img.src = selectedTemplate.imageUrl;
    }
  }, [selectedTemplate, topText, bottomText]);

  const renderMeme = () => {
    if (canvasRef.current && memeImageRef.current) {
      generateMeme(canvasRef.current, memeImageRef.current, topText, bottomText);
    }
  };

  const filteredTemplates = templates
    .filter(template => 
      (selectedCategory === "all" || template.category === selectedCategory) &&
      (searchQuery === "" || template.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );

  const handleAIGenerate = async () => {
    if (!aiPrompt.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a prompt first",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await apiRequest("POST", "/api/meme/generate", { prompt: aiPrompt });
      const data = await response.json();
      
      setTopText(data.topText);
      setBottomText(data.bottomText);
      
      toast({
        title: "Success",
        description: "AI text generated successfully!",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to generate",
        description: error instanceof Error ? error.message : "Unknown error occurred",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (canvasRef.current) {
      downloadMeme(canvasRef.current, "memechakra-meme.png");
      toast({
        title: "Success",
        description: "Meme downloaded successfully!",
      });
    }
  };

  const handleShare = (platform: string) => {
    toast({
      title: "Shared",
      description: `Shared on ${platform}!`,
    });
  };

  return (
    <section id="create" className="py-10 md:py-16 bg-bgLight">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4 text-textDark">{content[language].createTitle}</h2>
          <p className="text-base md:text-lg text-textLight max-w-2xl mx-auto">{content[language].createDescription}</p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
          {/* Left Side - Template Selection */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-xl shadow-md p-4 mb-4 transition-all hover:shadow-lg">
              <h3 className="text-xl font-semibold mb-4 text-textDark flex items-center">
                <i className="ri-gallery-line mr-2 text-primary"></i> 
                {content[language].chooseTemplate}
              </h3>
              
              {/* Categories */}
              <div className="mb-4">
                <label className="block text-textLight mb-2 font-medium">{content[language].categories}</label>
                <div className="category-selector flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button 
                      key={category.slug}
                      className={`category-pill transition-all ${selectedCategory === category.slug 
                        ? 'active bg-primary text-white font-medium shadow-md' 
                        : 'bg-bgMedium hover:bg-bgDark'}`}
                      onClick={() => setSelectedCategory(category.slug)}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Search */}
              <div className="mb-4">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder={content[language].searchPlaceholder}
                    className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-textLight">
                    <i className="ri-search-line"></i>
                  </span>
                </div>
              </div>
              
              {/* Templates Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto p-1">
                {filteredTemplates.length > 0 ? (
                  filteredTemplates.map((template) => (
                    <div 
                      key={template.id}
                      className={`template-card cursor-pointer rounded-lg shadow-sm transition-all hover:shadow-md 
                        ${selectedTemplate.id === template.id 
                          ? 'ring-2 ring-primary transform scale-[1.02]' 
                          : 'hover:scale-[1.03]'}`} 
                      onClick={() => setSelectedTemplate(template)}
                    >
                      <img 
                        src={template.imageUrl} 
                        alt={template.name} 
                        className="w-full rounded-lg"
                      />
                      <div className="template-card-overlay bg-gradient-to-t from-black/60 to-transparent rounded-lg">
                        <p className="text-sm font-medium text-white">{template.name}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 p-6 text-center text-textLight">
                    <i className="ri-error-warning-line text-3xl block mb-2"></i>
                    No templates found. Try a different search.
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Middle - Meme Editor */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-xl shadow-md p-4 mb-6 transition-all hover:shadow-lg">
              <h3 className="text-xl font-semibold mb-4 text-textDark flex items-center">
                <i className="ri-magic-line mr-2 text-primary"></i>
                {content[language].aiMemeGenerator}
              </h3>
              
              {/* AI Text Generation */}
              <div className="mb-5 p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-100">
                <label className="block text-textDark font-medium mb-2 flex items-center">
                  <i className="ri-ai-generate mr-2 text-purple-500"></i>
                  {content[language].aiMemeGenerator}
                </label>
                <div className="flex">
                  <input 
                    type="text" 
                    placeholder={content[language].aiPromptPlaceholder}
                    className="flex-grow px-4 py-3 rounded-l-lg border border-r-0 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                  />
                  <button 
                    className="bg-gradient-to-r from-primary to-purple-600 text-white px-4 py-3 rounded-r-lg transition-all hover:opacity-90 flex items-center justify-center min-w-20"
                    onClick={handleAIGenerate}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <div className="loading-spinner w-5 h-5 border-2 border-white"></div>
                    ) : (
                      <>
                        <i className="ri-magic-line mr-1"></i> {content[language].generateButton}
                      </>
                    )}
                  </button>
                </div>
                {isGenerating && (
                  <div className="mt-2 text-sm text-purple-700">
                    <i className="ri-loader-4-line animate-spin inline-block mr-1"></i> 
                    ए.आई. मजेदार मीम टेक्स्ट बना रहा है...
                  </div>
                )}
              </div>
              
              {/* Manual Text Input */}
              <div className="mb-4">
                <label className="block text-textDark font-medium mb-2 flex items-center">
                  <i className="ri-text mr-2 text-primary"></i>
                  {content[language].topText}
                </label>
                <textarea 
                  rows={2} 
                  placeholder={content[language].topTextPlaceholder}
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  value={topText}
                  onChange={(e) => setTopText(e.target.value)}
                ></textarea>
              </div>
              
              <div className="mb-5">
                <label className="block text-textDark font-medium mb-2 flex items-center">
                  <i className="ri-text mr-2 text-primary"></i>
                  {content[language].bottomText}
                </label>
                <textarea 
                  rows={2} 
                  placeholder={content[language].bottomTextPlaceholder}
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  value={bottomText}
                  onChange={(e) => setBottomText(e.target.value)}
                ></textarea>
              </div>
              
              {/* Text Customization */}
              <div className="mb-4">
                <label className="block text-textDark font-medium mb-2 flex items-center">
                  <i className="ri-font-size mr-2 text-primary"></i>
                  {content[language].textStyle}
                </label>
                <div className="flex flex-wrap gap-2">
                  <button className="chakra-btn bg-bgMedium text-textDark hover:bg-bgDark py-2 px-3 rounded transition-all hover:shadow">
                    <i className="ri-bold"></i>
                  </button>
                  <button className="chakra-btn bg-bgMedium text-textDark hover:bg-bgDark py-2 px-3 rounded transition-all hover:shadow">
                    <i className="ri-italic"></i>
                  </button>
                  <button className="chakra-btn bg-bgMedium text-textDark hover:bg-bgDark py-2 px-3 rounded transition-all hover:shadow">
                    <i className="ri-font-size"></i>
                  </button>
                  <button className="chakra-btn bg-bgMedium text-textDark hover:bg-bgDark py-2 px-3 rounded transition-all hover:shadow">
                    <i className="ri-font-color"></i>
                  </button>
                  <button className="chakra-btn bg-bgMedium text-textDark hover:bg-bgDark py-2 px-3 rounded transition-all hover:shadow">
                    <i className="ri-align-center"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Side - Preview and Save */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-xl shadow-md p-4 mb-4 transition-all hover:shadow-lg">
              <h3 className="text-xl font-semibold mb-4 text-textDark flex items-center">
                <i className="ri-image-line mr-2 text-primary"></i>
                {content[language].previewAndSave}
              </h3>
              
              {/* Meme Preview */}
              <div className="meme-canvas-container mb-6 bg-gray-50 p-2 rounded-lg border relative" style={{ height: "350px" }}>
                <div className="absolute top-3 right-3 z-10 bg-white/80 px-2 py-1 rounded text-xs font-medium text-textDark shadow-sm">
                  <i className="ri-image-2-line mr-1"></i> {selectedTemplate.name}
                </div>
                <div className="meme-canvas relative h-full">
                  <img
                    ref={memeImageRef}
                    id="memeTemplateImage"
                    src={selectedTemplate.imageUrl}
                    alt={selectedTemplate.name}
                    className="w-full h-full object-cover"
                    style={{ display: "none" }}
                  />
                  <canvas 
                    ref={canvasRef}
                    width="500"
                    height="350"
                    className="w-full h-full object-contain rounded border shadow-sm"
                  ></canvas>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <button 
                  className="bg-primary hover:bg-primary/90 text-white w-full py-3 flex justify-center items-center gap-2 rounded-lg transition-all shadow-sm hover:shadow"
                  onClick={handleDownload}
                >
                  <i className="ri-download-2-line text-xl"></i> {content[language].downloadMeme}
                </button>
                
                <p className="text-center text-sm text-textLight mb-1">{language === 'english' ? 'Or share on social media:' : 'या सोशल मीडिया पर शेयर करें:'}</p>
                
                <div className="flex gap-2">
                  <button 
                    className="bg-[#25D366] text-white hover:bg-[#128C7E] flex-1 py-2 px-1 share-button rounded-lg transition-all shadow-sm hover:shadow flex items-center justify-center gap-1"
                    onClick={() => handleShare("WhatsApp")}
                  >
                    <i className="ri-whatsapp-line text-lg"></i> 
                    <span className="text-sm">{content[language].share}</span>
                  </button>
                  <button 
                    className="bg-[#0866FF] text-white hover:bg-[#0557D5] flex-1 py-2 px-1 share-button rounded-lg transition-all shadow-sm hover:shadow flex items-center justify-center gap-1"
                    onClick={() => handleShare("Facebook")}
                  >
                    <i className="ri-facebook-fill text-lg"></i> 
                    <span className="text-sm">{content[language].share}</span>
                  </button>
                  <button 
                    className="bg-[#1DA1F2] text-white hover:bg-[#0D8ECF] flex-1 py-2 px-1 share-button rounded-lg transition-all shadow-sm hover:shadow flex items-center justify-center gap-1"
                    onClick={() => handleShare("Twitter")}
                  >
                    <i className="ri-twitter-x-line text-lg"></i> 
                    <span className="text-sm">{content[language].share}</span>
                  </button>
                </div>
                
                <div className="mt-2 text-center">
                  <p className="text-xs text-textLight">
                    {language === 'english' 
                      ? 'Created with ❤️ using MemeChakra' 
                      : 'MemeChakra का उपयोग करके ❤️ के साथ बनाया गया'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
