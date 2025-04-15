interface FeatureHighlightsProps {
  language: "english" | "hindi";
}

export default function FeatureHighlights({ language }: FeatureHighlightsProps) {
  const content = {
    english: {
      title: "Kya Hai MemeChakra Mein?",
      description: "Bindaas meme banao, share karo, aur desi swag dikhao - wo bhi ekdum AI ke saath!",
      features: [
        {
          icon: "ri-ai-generate",
          title: "AI Meme Generator",
          description: "Type any prompt and our AI will create the perfect meme text for your template. Smart content that understands desi humor!"
        },
        {
          icon: "ri-gallery-line",
          title: "Desi Templates Collection",
          description: "Browse hundreds of popular Indian meme templates from Bollywood, cricket, politics and viral Indian moments."
        },
        {
          icon: "ri-translate-2",
          title: "Multi-Language Support",
          description: "Create memes in Hindi (Roman script), English, or mix both for the authentic desi meme experience."
        }
      ]
    },
    hindi: {
      title: "क्या है मीमचक्र में?",
      description: "बिंदास मीम बनाओ, शेयर करो, और देसी स्वैग दिखाओ - वो भी एकदम AI के साथ!",
      features: [
        {
          icon: "ri-ai-generate",
          title: "AI मीम जेनरेटर",
          description: "कोई भी प्रॉम्प्ट टाइप करें और हमारा AI आपके टेम्पलेट के लिए परफेक्ट मीम टेक्स्ट बनाएगा। स्मार्ट कंटेंट जो देसी ह्यूमर को समझता है!"
        },
        {
          icon: "ri-gallery-line",
          title: "देसी टेम्पलेट्स कलेक्शन",
          description: "बॉलीवुड, क्रिकेट, राजनीति और वायरल भारतीय मोमेंट्स से सैकड़ों लोकप्रिय भारतीय मीम टेम्पलेट्स ब्राउज़ करें।"
        },
        {
          icon: "ri-translate-2",
          title: "मल्टी-लैंग्वेज सपोर्ट",
          description: "हिंदी (रोमन स्क्रिप्ट), अंग्रेजी, या दोनों को मिक्स करके बनाएं असली देसी मीम एक्सपीरियंस!"
        }
      ]
    }
  };

  return (
    <section className="py-16 bg-white" id="features">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-textDark">{content[language].title}</h2>
          <p className="text-lg text-textLight max-w-2xl mx-auto">{content[language].description}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {content[language].features.map((feature, index) => (
            <div key={index} className="feature-card bg-white p-6 shadow">
              <div className="mb-4">
                <i className={`feature-icon ${feature.icon}`}></i>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-textDark">{feature.title}</h3>
              <p className="text-textLight">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
