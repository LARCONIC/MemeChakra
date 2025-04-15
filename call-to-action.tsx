interface CallToActionProps {
  language: "english" | "hindi";
}

export default function CallToAction({ language }: CallToActionProps) {
  const content = {
    english: {
      title: "Ready to Create Your First Meme?",
      description: "Join thousands of users creating and sharing desi memes with MemeChakra!",
      buttonText: "Start Creating Now"
    },
    hindi: {
      title: "अपना पहला मीम बनाने के लिए तैयार हैं?",
      description: "हजारों यूजर्स के साथ जुड़ें जो मीमचक्र के साथ देसी मीम बना और शेयर कर रहे हैं!",
      buttonText: "अभी बनाना शुरू करें"
    }
  };

  return (
    <section className="gradient-bg py-16 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          {content[language].title}
        </h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          {content[language].description}
        </p>
        <a 
          href="#create" 
          className="chakra-btn-accent py-3 px-8 text-lg shadow-lg rounded-lg inline-block"
        >
          {content[language].buttonText}
        </a>
      </div>
    </section>
  );
}
