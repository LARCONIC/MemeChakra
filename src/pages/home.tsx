import Navbar from "@/components/navbar";
import HeroSection from "@/components/hero-section";
import FeatureHighlights from "@/components/feature-highlights";
import MemeCreator from "@/components/meme-creator";
import PopularTemplates from "@/components/popular-templates";
import UserGallery from "@/components/user-gallery";
import CallToAction from "@/components/call-to-action";
import Footer from "@/components/footer";
import { useState } from "react";

export default function Home() {
  const [language, setLanguage] = useState<"english" | "hindi">("english");

  const toggleLanguage = (lang: "english" | "hindi") => {
    setLanguage(lang);
  };

  return (
    <div className="min-h-screen bg-bgLight text-textMedium">
      <Navbar language={language} onLanguageChange={toggleLanguage} />
      <HeroSection language={language} />
      <FeatureHighlights language={language} />
      <MemeCreator language={language} />
      <PopularTemplates language={language} />
      <UserGallery language={language} />
      <CallToAction language={language} />
      <Footer />
      
      {/* Toast Notification - Hidden by default */}
      <div id="toast" className="toast">
        <div className="flex items-center">
          <i className="ri-check-line text-success-color mr-2"></i>
          <span id="toastMessage">Meme downloaded successfully!</span>
        </div>
      </div>
    </div>
  );
}
