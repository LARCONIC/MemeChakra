import { useState } from "react";

interface NavbarProps {
  language: "english" | "hindi";
  onLanguageChange: (language: "english" | "hindi") => void;
}

export default function Navbar({ language, onLanguageChange }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 w-full will-change-transform touch-none select-none">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <a href="#" className="flex items-center space-x-3 -webkit-tap-highlight-color-transparent">
            <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center">
              <i className="ri-emotion-laugh-line text-white text-xl"></i>
            </div>
            <span className="text-xl font-bold text-textDark">MemeChakra</span>
          </a>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-textDark hover:text-primary transition-colors">Home</a>
            <a href="#create" className="text-textDark hover:text-primary transition-colors">Create</a>
            <a href="#templates" className="text-textDark hover:text-primary transition-colors">Templates</a>
            <a href="#features" className="text-textDark hover:text-primary transition-colors">Features</a>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="language-toggle mr-2 hidden md:flex">
              <button 
                className={language === "english" ? "active" : ""} 
                onClick={() => onLanguageChange("english")}
              >
                ENG
              </button>
              <button 
                className={language === "hindi" ? "active" : ""} 
                onClick={() => onLanguageChange("hindi")}
              >
                हिंदी
              </button>
            </div>
            <a href="#create" className="chakra-btn-primary py-2 px-4 rounded-lg hidden md:flex">
              Create Meme
            </a>
            <button 
              id="mobileMenuButton" 
              className="md:hidden text-textDark p-2 -webkit-tap-highlight-color-transparent active:bg-gray-100 rounded-full"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              <i className="ri-menu-line text-2xl"></i>
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        <div 
          className={`md:hidden py-4 animate-fade-in ${mobileMenuOpen ? 'block' : 'hidden'}`}
          style={{
            maxHeight: mobileMenuOpen ? '300px' : '0',
            overflow: 'hidden',
            transition: 'max-height 0.3s ease'
          }}
        >
          <div className="flex flex-col space-y-3">
            <a 
              href="#" 
              className="text-textDark py-3 px-4 hover:bg-bgMedium rounded-lg active:bg-bgMedium touch-manipulation -webkit-tap-highlight-color-transparent"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </a>
            <a 
              href="#create" 
              className="text-textDark py-3 px-4 hover:bg-bgMedium rounded-lg active:bg-bgMedium touch-manipulation -webkit-tap-highlight-color-transparent"
              onClick={() => setMobileMenuOpen(false)}
            >
              Create
            </a>
            <a 
              href="#templates" 
              className="text-textDark py-3 px-4 hover:bg-bgMedium rounded-lg active:bg-bgMedium touch-manipulation -webkit-tap-highlight-color-transparent"
              onClick={() => setMobileMenuOpen(false)}
            >
              Templates
            </a>
            <a 
              href="#features" 
              className="text-textDark py-3 px-4 hover:bg-bgMedium rounded-lg active:bg-bgMedium touch-manipulation -webkit-tap-highlight-color-transparent"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </a>
            <div className="language-toggle mx-4 mt-2">
              <button 
                className={language === "english" ? "active" : ""} 
                onClick={() => {
                  onLanguageChange("english");
                  setMobileMenuOpen(false);
                }}
              >
                ENG
              </button>
              <button 
                className={language === "hindi" ? "active" : ""} 
                onClick={() => {
                  onLanguageChange("hindi");
                  setMobileMenuOpen(false);
                }}
              >
                हिंदी
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
