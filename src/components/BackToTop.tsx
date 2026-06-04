'use client';
import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <button
      onClick={scrollToTop}
      aria-label="Quay lại đầu trang"
      className="fixed bottom-6 left-6 z-50 p-3 bg-brand-600 text-white rounded-full shadow-lg hover:bg-brand-700 hover:scale-110 transition-all focus:outline-none"
    >
      <ArrowUp className="w-6 h-6" />
    </button>
  );
}
