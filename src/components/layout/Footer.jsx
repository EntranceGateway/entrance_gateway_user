import React from "react";
import { Mail, Facebook, Instagram, Linkedin } from "lucide-react"; // Lucide React icons

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Newsletter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-b border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-white">Newsletter</h2>
            <p className="text-sm text-gray-400 mt-2">
              Subscribe to stay updated with our latest content.
            </p>
          </div>
          <form className="flex items-center w-full md:w-1/2 bg-gray-800 rounded-lg overflow-hidden">
            <Mail className="w-6 h-6 ml-3 text-gray-400" />
            <input
              type="email"
              className="flex-1 px-3 py-2 bg-transparent text-gray-200 placeholder-gray-400 focus:outline-none"
              placeholder="Enter your email address"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 font-medium transition"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Footer Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Column 1 */}
        <div>
          <h3 className="text-white font-semibold mb-4">ENTRANCE GATEWAY</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-white cursor-pointer">About</li>
            <li className="hover:text-white cursor-pointer">Contents</li>
            <li className="hover:text-white cursor-pointer">Events</li>
          </ul>
        </div>

        {/* Column 2 */}
        <div>
          <h3 className="text-white font-semibold mb-4">Contact</h3>
          <p className="text-sm">Address: Your Address Here</p>
          <p className="text-sm">Phone: +977 98XXXXXX</p>
          <p className="text-sm">Email: info@entracegateway.com</p>
        </div>

        {/* Column 3 */}
        <div>
          <h3 className="text-white font-semibold mb-4">Useful Links</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-white cursor-pointer">Privacy Policy</li>
            <li className="hover:text-white cursor-pointer">Terms & Conditions</li>
            <li className="hover:text-white cursor-pointer">FAQ</li>
          </ul>
        </div>

        {/* Column 4 */}
        <div>
          <h3 className="text-white font-semibold mb-4">Follow Us</h3>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-white transition-transform transform hover:scale-110">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-white transition-transform transform hover:scale-110">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-white transition-transform transform hover:scale-110">
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

   {/* Bottom Bar */}
<div className="bg-gray-800 py-4">
  <div className="max-w-7xl mx-auto px-4 text-center">
    <p className="text-sm text-gray-400">
      &copy; 2025 entracegateway. All rights reserved.
    </p>
  </div>
</div>

    </footer>
  );
}
