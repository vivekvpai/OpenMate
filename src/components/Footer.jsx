import React from "react";

function Footer() {
  return (
    
    <footer className="bg-black text-white border-t border-gray-800 ">
      <div className="max-w-7xl px-8  py-12 grid grid-cols-1 md:grid-cols-3 ">
        
        {/* Column 1: Logo & Description */}
        <div className="flex flex-col space-y-4">
          <h1 className="text-2xl font-robotoslab text-red-600">OpenMate</h1>
          <p className="font-inter text-sm text-gray-400">
            One-key access to all your local projects. Open, manage, and navigate your code faster than ever.
          </p>
        </div>

        {/* Column 2: Quick Links */}
        <div className="flex flex-col space-y-2 px-30">
          <h2 className="text-lg font-inter font-semibold text-white">Quick Links</h2>
          <a href="/docs" className="text-gray-400 hover:text-red-600 transition">Docs</a>
          <a href="/#part-2" className="text-gray-400 hover:text-red-600 transition">Features</a>
          <a href="/#part-3" className="text-gray-400 hover:text-red-600 transition">Supported Editors</a>
        </div>

        {/* Column 3: Social / Contact */}
        <div className="flex flex-col space-y-2 px-30">
          <h2 className="text-lg font-inter font-semibold text-white">Connect</h2>
          <div className="flex space-x-4 mt-2 font-inter">
            <a href="https://x.com/Achuta_Rao_" target="blank" className="text-gray-400 hover:text-red-600 transition">Twitter</a>
            <a href="https://github.com/vivekvpai" target="blank" className="text-gray-400 hover:text-red-600 transition">GitHub</a>
            <a href="https://www.linkedin.com/in/vivek-v-pai/" target="blank" className="text-gray-400 hover:text-red-600 transition">LinkedIn</a>
          </div>
        </div>
      </div>
      

      {/* Bottom copyright */}
      <div className=" mt-1 pb-6 text-center text-gray-500 text-sm font-inter">
        © {new Date().getFullYear()} OpenMate. All rights reserved.
      </div>
    </footer>
    
  );
}

export default Footer;
