interface UserGalleryProps {
  language: "english" | "hindi";
}

export default function UserGallery({ language }: UserGalleryProps) {
  const content = {
    english: {
      title: "Trending Memes Gallery",
      description: "Check out what our users are creating",
      viewAll: "View All Memes"
    },
    hindi: {
      title: "ट्रेंडिंग मीम्स गैलरी",
      description: "देखें हमारे यूजर्स क्या बना रहे हैं",
      viewAll: "सभी मीम्स देखें"
    }
  };

  // Sample user generated memes
  const userMemes = [
    {
      id: 1,
      imageUrl: "https://images.unsplash.com/photo-1557180295-76eee20ae8aa?auto=format&fit=crop&w=400&h=300&q=80",
      alt: "User Meme 1"
    },
    {
      id: 2,
      imageUrl: "https://images.unsplash.com/photo-1529243856184-fd5465488984?auto=format&fit=crop&w=400&h=300&q=80",
      alt: "User Meme 2"
    },
    {
      id: 3,
      imageUrl: "https://images.unsplash.com/photo-1536329583941-14287ec6fc4e?auto=format&fit=crop&w=400&h=300&q=80",
      alt: "User Meme 3"
    },
    {
      id: 4,
      imageUrl: "https://images.unsplash.com/photo-1563290443-617817f9fcd2?auto=format&fit=crop&w=400&h=300&q=80",
      alt: "User Meme 4"
    }
  ];

  return (
    <section className="py-16 bg-bgLight">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-textDark">
            {content[language].title}
          </h2>
          <p className="text-lg text-textLight max-w-2xl mx-auto">
            {content[language].description}
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {userMemes.map((meme) => (
            <div 
              key={meme.id}
              className="rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow"
            >
              <img 
                src={meme.imageUrl}
                alt={meme.alt}
                className="w-full"
              />
            </div>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <button 
            className="chakra-btn-primary py-3 px-8 rounded-lg"
            onClick={() => window.location.href = "#create"}
          >
            {content[language].viewAll}
          </button>
        </div>
      </div>
    </section>
  );
}
