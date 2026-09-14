import React from 'react';
import { Instagram, Facebook } from 'lucide-react';

export const TikTokIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    aria-hidden="true"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.47 6.27 6.27 0 0 0 1.88-4.47V8.42a8.28 8.28 0 0 0 4.89 1.58V6.69z" />
  </svg>
);

interface SocialIconsProps {
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  className?: string;
}

export const SocialIcons: React.FC<SocialIconsProps> = ({
  instagram = 'https://instagram.com/dentalmatvv',
  facebook = 'https://facebook.com/dentalmatvv',
  tiktok = 'https://tiktok.com/@dentalmatvv',
  className = ''
}) => {
  return (
    <div className={`flex items-center gap-3 text-slate-400 ${className}`}>
      {instagram && (
        <a 
          href={instagram} 
          target="_blank" 
          rel="noopener noreferrer" 
          aria-label="Instagram"
          className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-pink-600 hover:text-white transition-colors cursor-pointer"
        >
          <Instagram className="w-4 h-4" />
        </a>
      )}
      {facebook && (
        <a 
          href={facebook} 
          target="_blank" 
          rel="noopener noreferrer" 
          aria-label="Facebook"
          className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors cursor-pointer"
        >
          <Facebook className="w-4 h-4" />
        </a>
      )}
      {tiktok && (
        <a 
          href={tiktok} 
          target="_blank" 
          rel="noopener noreferrer" 
          aria-label="TikTok"
          className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-slate-700 hover:text-white transition-colors cursor-pointer"
        >
          <TikTokIcon className="w-4 h-4" />
        </a>
      )}
    </div>
  );
};

export { Instagram, Facebook };

