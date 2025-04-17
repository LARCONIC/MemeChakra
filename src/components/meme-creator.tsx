import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { templates, defaultCategories } from "@/data/templates";
import { generateMemeText } from "@/lib/gemini";

export default function MemeCreator({ language }: { language: string }) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [topText, setTopText] = useState("");
  const [bottomText, setBottomText] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const selectedTemplateData = selectedTemplate 
    ? templates.find(t => t.id === selectedTemplate)
    : null;

  const categorySlug = selectedTemplateData 
    ? defaultCategories.find(c => c.id === selectedTemplateData.categoryId)?.slug || 'all'
    : 'all';

  const handleGenerate = async () => {
    if (!selectedTemplate || !prompt) {
      toast({
        title: language === "hindi" ? "जरूरी जानकारी चाहिए" : "Required Information",
        description: language === "hindi" 
          ? "कृपया एक टेम्पलेट और प्रॉम्प्ट चुनें" 
          : "Please select a template and enter a prompt",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      const result = await generateMemeText(prompt);
      setTopText(result.topText || "");
      setBottomText(result.bottomText || "");
      toast({
        title: language === "hindi" ? "मीम तैयार है" : "Meme Generated",
        description: language === "hindi" 
          ? "आपका मीम तैयार हो गया है" 
          : "Your meme has been generated"
      });
    } catch (error) {
      toast({
        title: language === "hindi" ? "एरर" : "Error",
        description: language === "hindi"
          ? "मीम जनरेट करने में समस्या आई है"
          : "There was an error generating your meme",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;
    
    const link = document.createElement('a');
    link.download = 'meme.png';
    link.href = canvasRef.current.toDataURL();
    link.click();
  };

  return (
    <section className="py-16" id="creator">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            {language === "hindi" ? "मीम बनाएं" : "Create Meme"}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {language === "hindi"
              ? "AI की मदद से अपना मीम बनाएं"
              : "Create your meme with AI assistance"}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">
                {language === "hindi" ? "टेम्पलेट चुनें" : "Choose Template"}
              </h3>
              <div className="grid grid-cols-2 gap-4 max-h-[400px] overflow-y-auto p-2">
                {templates.filter(template =>
                  categorySlug === 'all' ? true : template.category === categorySlug
                ).map((template) => (
                  <Card
                    key={template.id}
                    className={`cursor-pointer transition-all ${
                      selectedTemplate === template.id
                        ? "ring-2 ring-primary"
                        : "hover:ring-1 hover:ring-muted-foreground"
                    }`}
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    <img
                      src={template.imageUrl}
                      alt={template.name}
                      className="w-full aspect-square object-cover rounded-t-lg"
                    />
                    <div className="p-2 text-center text-sm">{template.name}</div>
                  </Card>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  {language === "hindi" ? "अपना आइडिया लिखें" : "Enter Your Idea"}
                </label>
                <Input
                  placeholder={
                    language === "hindi"
                      ? "जैसे: जब मम्मी स्कूल के मार्क्स पूछती हैं..."
                      : "Example: When mom asks about school marks..."
                  }
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </div>

              <Button 
                onClick={handleGenerate}
                disabled={isGenerating || !selectedTemplate || !prompt}
                className="w-full"
              >
                {isGenerating ? (
                  language === "hindi" ? "बन रहा है..." : "Generating..."
                ) : (
                  language === "hindi" ? "मीम बनाएं" : "Generate Meme"
                )}
              </Button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">
              {language === "hindi" ? "प्रीव्यू" : "Preview"}
            </h3>
            <Card className="p-4">
              <div className="relative aspect-square">
                {selectedTemplateData ? (
                  <>
                    <img
                      src={selectedTemplateData.imageUrl}
                      alt={selectedTemplateData.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-x-0 top-4 text-center">
                      <h3 className="text-white text-2xl font-bold stroke-text">
                        {topText}
                      </h3>
                    </div>
                    <div className="absolute inset-x-0 bottom-4 text-center">
                      <h3 className="text-white text-2xl font-bold stroke-text">
                        {bottomText}
                      </h3>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted rounded-lg">
                    <p className="text-muted-foreground">
                      {language === "hindi"
                        ? "टेम्पलेट चुनें"
                        : "Select a template"}
                    </p>
                  </div>
                )}
                <canvas ref={canvasRef} className="hidden" />
              </div>

              {selectedTemplateData && (topText || bottomText) && (
                <div className="mt-4 flex gap-4">
                  <Button onClick={handleDownload} className="flex-1">
                    {language === "hindi" ? "डाउनलोड करें" : "Download"}
                  </Button>
                  <Button variant="outline" className="flex-1">
                    {language === "hindi" ? "शेयर करें" : "Share"}
                  </Button>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
