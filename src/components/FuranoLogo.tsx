export default function FuranoLogo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 480 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Icon */}
      <circle cx="50" cy="35" r="15" fill="#1A2B5E" />
      <path d="M 35 60 A 30 30 0 0 0 90 90 L 90 75 A 15 15 0 0 1 50 60 Z" fill="#3DCAA0" />
      
      {/* FURANO Text */}
      <text x="110" y="85" fontFamily="Inter, sans-serif" fontWeight="800" fontSize="72" fill="#1A2B5E" letterSpacing="2">
        FURANO
      </text>
    </svg>
  );
}
