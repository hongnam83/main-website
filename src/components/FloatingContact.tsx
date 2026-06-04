'use client';
import { useState } from 'react';
import { MessageCircle, Phone, X } from 'lucide-react';

export default function FloatingContact() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-4"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div 
        className={`flex flex-col gap-4 items-center transition-all duration-300 ease-out origin-bottom ${
          isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-75 opacity-0 translate-y-10 pointer-events-none'
        }`}
      >
        <a 
          href="https://zalo.me" 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-50 transition-colors group relative border border-gray-100"
        >
          <span className="absolute right-full mr-4 bg-gray-900 text-white text-sm px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Chat Zalo
          </span>
          <img src="https://upload.wikimedia.org/wikipedia/commons/9/91/Icon_of_Zalo.svg" alt="Zalo" className="w-8 h-8 object-contain" />
        </a>

        
        <a 
          href="tel:0909090909" 
          className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-green-600 transition-colors group relative"
        >
          <span className="absolute right-full mr-4 bg-gray-900 text-white text-sm px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Gọi Hotline
          </span>
          <Phone className="w-5 h-5 fill-current" />
        </a>
      </div>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-brand-800 rounded-full flex items-center justify-center text-white shadow-[0_0_20px_rgba(0,74,173,0.3)] hover:bg-brand-900 transition-all duration-300 hover:scale-105 relative z-10"
      >
        <MessageCircle className={`w-6 h-6 absolute transition-all duration-300 ${isOpen ? 'scale-0 opacity-0 rotate-90' : 'scale-100 opacity-100 rotate-0'}`} />
        <X className={`w-6 h-6 absolute transition-all duration-300 ${isOpen ? 'scale-100 opacity-100 rotate-0' : 'scale-0 opacity-0 -rotate-90'}`} />
      </button>
    </div>
  );
}
