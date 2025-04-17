export default function Footer() {
  return (
    <footer className="bg-textDark text-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="flex items-center space-x-3 mb-6 md:mb-0">
            <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center">
              <i className="ri-emotion-laugh-line text-white text-xl"></i>
            </div>
            <span className="text-xl font-bold">MemeChakra</span>
          </div>
          
          <div className="flex space-x-6">
            <a href="#" className="hover:text-primary transition-colors"><i className="ri-instagram-line text-2xl"></i></a>
            <a href="#" className="hover:text-primary transition-colors"><i className="ri-twitter-line text-2xl"></i></a>
            <a href="#" className="hover:text-primary transition-colors"><i className="ri-facebook-line text-2xl"></i></a>
            <a href="#" className="hover:text-primary transition-colors"><i className="ri-whatsapp-line text-2xl"></i></a>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p>&copy; 2023 MemeChakra. All rights reserved.</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Contact Us</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
