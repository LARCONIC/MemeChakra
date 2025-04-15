interface HeroSectionProps {
  language: "english" | "hindi";
}

export default function HeroSection({ language }: HeroSectionProps) {
  const content = {
    english: {
      title: "Unleash Your Meme Shakti with AI",
      description: "Create culturally relevant Desi memes in seconds with our AI-powered platform. Express your humor in any Indian language!",
      buttonText: "Start Creating"
    },
    hindi: {
      title: "AI के साथ अपनी मीम शक्ति दिखाओ",
      description: "AI-पावर्ड प्लेटफॉर्म से सेकंड्स में देसी मीम्स बनाओ। किसी भी भारतीय भाषा में अपना हास्य व्यक्त करो!",
      buttonText: "शुरू करें"
    }
  };

  return (
    <section className="gradient-bg py-16 text-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0 animate-slide-up opacity-0" style={{ animationDelay: "0.1s" }}>
            <h1 className="text-display-4 font-bold mb-4">{content[language].title}</h1>
            <p className="text-lg mb-6">{content[language].description}</p>
            <a href="#create" className="chakra-btn-accent py-3 px-8 rounded-lg shadow-lg inline-block">
              {content[language].buttonText}
            </a>
          </div>
          <div className="md:w-1/2 flex justify-center animate-slide-up opacity-0" style={{ animationDelay: "0.3s" }}>
            <div className="relative w-full max-w-md">
              <img 
                src="https://images.unsplash.com/photo-1531747118685-ca8fa6e08806?auto=format&fit=crop&w=600&h=500&q=80" 
                alt="Meme Example" 
                className="rounded-lg shadow-2xl w-full" 
              />
              <div className="absolute top-4 w-full text-center">
                <p className="meme-text top text-2xl">When someone tells me</p>
              </div>
              <div className="absolute bottom-4 w-full text-center">
                <p className="meme-text bottom text-2xl">AI can't make desi memes</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
