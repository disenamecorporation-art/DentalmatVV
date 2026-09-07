import React from 'react';

interface ProductSVGProps {
  type: string;
  className?: string;
}

export const ProductSVG: React.FC<ProductSVGProps> = ({ type, className = "w-full h-full" }) => {
  // Define premium SVG illustrations with clinical light blue, silver metal, and dark accents
  switch (type) {
    case 'turbina':
    case 'turbina_smax':
      return (
        <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="metalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="35%" stopColor="#E2E8F0" />
              <stop offset="70%" stopColor="#94A3B8" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>
            <linearGradient id="blueGlow" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0284C7" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="laserGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0066FF" />
              <stop offset="100%" stopColor="#38BDF8" />
            </linearGradient>
          </defs>
          {/* Background soft decorative circle */}
          <circle cx="100" cy="100" r="80" fill="#F0F9FF" />
          
          {/* Handpiece body shadow */}
          <path d="M45 160 L145 65 C150 60 160 62 165 67 L167 69 C172 74 170 84 165 89 L65 180 Z" fill="#000000" fillOpacity="0.04" />
          
          {/* Handpiece metal body */}
          <path d="M40 155 L140 60 C145 55 155 57 160 62 L162 64 C167 69 165 79 160 84 L60 175 Z" fill="url(#metalGrad)" stroke="#64748B" strokeWidth="1.5" />
          
          {/* Grip Knurling Patterns */}
          <line x1="80" y1="115" x2="100" y2="95" stroke="#94A3B8" strokeWidth="1.5" />
          <line x1="85" y1="120" x2="105" y2="100" stroke="#94A3B8" strokeWidth="1.5" />
          <line x1="90" y1="125" x2="110" y2="105" stroke="#94A3B8" strokeWidth="1.5" />
          <line x1="95" y1="130" x2="115" y2="110" stroke="#94A3B8" strokeWidth="1.5" />
          <line x1="100" y1="135" x2="120" y2="115" stroke="#94A3B8" strokeWidth="1.5" />
          
          {/* LED Optical Ring */}
          <rect x="135" y="58" width="8" height="15" rx="2" transform="rotate(-45 135 58)" fill="url(#laserGrad)" />
          
          {/* Head assembly of the turbine */}
          <path d="M142 55 L160 37 C164 33 171 33 175 37 L177 39 C181 43 181 50 177 54 L159 72 Z" fill="url(#metalGrad)" stroke="#475569" strokeWidth="1.5" />
          
          {/* Head cap */}
          <ellipse cx="168" cy="46" rx="9" ry="5" transform="rotate(-45 168 46)" fill="#64748B" />
          
          {/* Miniature Burr (Fresa) */}
          <rect x="175" y="32" width="3" height="14" rx="0.5" transform="rotate(-45 175 32)" fill="#334155" />
          <rect x="180" y="27" width="2" height="6" rx="0.5" transform="rotate(-45 180 27)" fill="#94A3B8" />
          
          {/* Triple Spray Water Jets effect */}
          <path d="M165 42 L185 22 M168 39 L192 25 M162 45 L178 14" stroke="#0EA5E9" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 3" />
          <circle cx="185" cy="22" r="2" fill="#38BDF8" />
          <circle cx="192" cy="25" r="1.5" fill="#38BDF8" />
          <circle cx="178" cy="14" r="2" fill="#38BDF8" />
          
          {/* Fiberoptic Glowing light source */}
          <circle cx="145" cy="51" r="5" fill="#38BDF8" />
          <circle cx="145" cy="51" r="12" fill="url(#blueGlow)" />
        </svg>
      );

    case 'apex':
    case 'obturacion':
      return (
        <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#E2E8F0" />
            </linearGradient>
            <linearGradient id="screenGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0F172A" />
              <stop offset="100%" stopColor="#1E293B" />
            </linearGradient>
            <linearGradient id="rootGraphGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#EF4444" />
              <stop offset="50%" stopColor="#EAB308" />
              <stop offset="100%" stopColor="#22C55E" />
            </linearGradient>
          </defs>
          <circle cx="100" cy="100" r="80" fill="#F0FDF4" />
          
          {/* Apex Locator Device Body */}
          <rect x="55" y="45" width="90" height="110" rx="16" fill="url(#bodyGrad)" stroke="#CBD5E1" strokeWidth="2" />
          {/* Stand holder */}
          <path d="M50 145 H150 L140 160 H60 Z" fill="#94A3B8" />
          
          {/* Digital Screen */}
          <rect x="63" y="53" width="74" height="66" rx="8" fill="url(#screenGrad)" stroke="#475569" strokeWidth="1.5" />
          
          {/* Dental canal graphic visualization */}
          {/* Curved canal path */}
          <path d="M80 65 Q95 75 90 108" stroke="#334155" strokeWidth="8" strokeLinecap="round" />
          <path d="M80 65 Q95 75 90 108" stroke="url(#rootGraphGrad)" strokeWidth="5" strokeLinecap="round" />
          
          {/* Target apical limit line */}
          <line x1="80" y1="104" x2="104" y2="104" stroke="#22C55E" strokeWidth="2.5" strokeDasharray="2 1" />
          
          {/* Numeric Readout Indicator */}
          <text x="112" y="75" fill="#22C55E" fontSize="13" fontWeight="bold" fontFamily="monospace">0.0</text>
          <text x="112" y="85" fill="#38BDF8" fontSize="7" fontWeight="bold" fontFamily="sans-serif">APEX</text>
          
          {/* Status signal waves */}
          <path d="M120 92 A 8 8 0 0 1 130 98" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M123 89 A 12 12 0 0 1 135 98" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" />
          
          {/* Control Buttons */}
          <circle cx="80" cy="135" r="8" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1" />
          <polygon points="78,132 78,138 84,135" fill="#475569" />
          
          <circle cx="100" cy="135" r="8" fill="#0066FF" />
          <path d="M97 135 H103 M100 132 V138" stroke="#FFFFFF" strokeWidth="1.5" />
          
          <circle cx="120" cy="135" r="8" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1" />
          <rect x="117" y="132" width="6" height="6" rx="1" fill="#475569" />
        </svg>
      );

    case 'resina':
    case 'resina_bulk':
      return (
        <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="plunger" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#475569" />
              <stop offset="50%" stopColor="#1E293B" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>
            <linearGradient id="barrel" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
              <stop offset="40%" stopColor="#F1F5F9" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#94A3B8" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient id="compGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#B45309" />
            </linearGradient>
          </defs>
          <circle cx="100" cy="100" r="80" fill="#FFFBEB" />
          
          {/* Medical composite syringe syringe */}
          {/* Plunger back handle */}
          <rect x="25" y="93" width="10" height="14" rx="2" fill="url(#plunger)" />
          <rect x="35" y="97" width="45" height="6" fill="url(#plunger)" />
          
          {/* Syringe finger flange wings */}
          <rect x="74" y="80" width="8" height="40" rx="3" fill="#334155" />
          
          {/* Main Syringe Syringe Barrel body */}
          <rect x="80" y="88" width="80" height="24" rx="2" fill="url(#barrel)" stroke="#64748B" strokeWidth="1" />
          <rect x="80" y="88" width="80" height="24" fill="#0066FF" fillOpacity="0.03" />
          
          {/* Measurement ticks on composite barrel */}
          <line x1="90" y1="88" x2="90" y2="95" stroke="#475569" strokeWidth="1" />
          <line x1="100" y1="88" x2="100" y2="93" stroke="#475569" strokeWidth="1" />
          <line x1="110" y1="88" x2="110" y2="95" stroke="#475569" strokeWidth="1" />
          <line x1="120" y1="88" x2="120" y2="93" stroke="#475569" strokeWidth="1" />
          <line x1="130" y1="88" x2="130" y2="95" stroke="#475569" strokeWidth="1" />
          <line x1="140" y1="88" x2="140" y2="93" stroke="#475569" strokeWidth="1" />
          <line x1="150" y1="88" x2="150" y2="95" stroke="#475569" strokeWidth="1" />
          
          {/* Composite material visible inside syringe */}
          <rect x="115" y="91" width="42" height="18" fill="url(#compGrad)" rx="1" />
          
          {/* Label band on syringe */}
          <rect x="92" y="96" width="20" height="8" fill="#3B82F6" rx="1" />
          <text x="94" y="103" fill="#FFFFFF" fontSize="6" fontWeight="bold">3M A2</text>
          
          {/* Syringe nozzle tapered tip */}
          <path d="M160 92 L178 97 C181 98 181 102 178 103 L160 108 Z" fill="#1E293B" stroke="#0F172A" strokeWidth="1" />
          
          {/* Bright orange protective cap */}
          <path d="M172 94 L188 96 C191 97 191 103 188 104 L172 106 Z" fill="#F97316" />
        </svg>
      );

    case 'lampara':
      return (
        <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="bodyLamp" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="50%" stopColor="#F1F5F9" />
              <stop offset="100%" stopColor="#CBD5E1" />
            </linearGradient>
            <linearGradient id="amberShield" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F97316" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#EA580C" stopOpacity="0.95" />
            </linearGradient>
            <radialGradient id="lightCone" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.9" />
              <stop offset="30%" stopColor="#0284C7" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#0066FF" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="100" cy="100" r="80" fill="#EEF2FF" />
          
          {/* Ergonomic handle Base of the curing wand */}
          <rect x="40" y="115" width="45" height="50" rx="8" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="1" />
          
          {/* Curing light wand body */}
          <path d="M45 145 L135 65 C138 62 143 62 146 65 L150 69 C153 72 153 77 150 80 L60 160 Z" fill="url(#bodyLamp)" stroke="#64748B" strokeWidth="1.5" />
          
          {/* Status Indicator OLED Screen on Handle */}
          <rect x="68" y="118" width="18" height="12" rx="2" fill="#0F172A" transform="rotate(-40 68 118)" />
          <text x="64" y="114" fill="#38BDF8" fontSize="5" fontWeight="bold" transform="rotate(-40 64 114)">10s</text>
          
          {/* Orange anti-glare protective shield */}
          <circle cx="120" cy="80" r="28" fill="url(#amberShield)" stroke="#D97706" strokeWidth="1" />
          <circle cx="120" cy="80" r="8" fill="#FFF" fillOpacity="0.3" />
          
          {/* Cure tip light-emitting glass guide */}
          <path d="M142 61 L168 38 C172 34 178 34 182 38 L185 41 C189 45 189 51 185 55 L159 78 Z" fill="#94A3B8" stroke="#475569" strokeWidth="1" />
          
          {/* Blue active LED emitter beam */}
          <path d="M182 38 L198 22 M185 41 L200 27" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" />
          
          {/* Blue light burst glow */}
          <circle cx="192" cy="30" r="18" fill="url(#lightCone)" />
        </svg>
      );

    case 'ultrasonido':
      return (
        <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="80" fill="#ECFDF5" />
          <path d="M45 130 H155 V155 H45 Z" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.5" />
          <rect x="55" y="80" width="90" height="50" rx="12" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1.5" />
          
          {/* Knobs and switches */}
          <circle cx="75" cy="105" r="8" fill="#0066FF" />
          <circle cx="75" cy="105" r="3" fill="#FFFFFF" />
          
          <rect x="95" y="100" width="35" height="10" rx="3" fill="#E2E8F0" />
          <rect x="105" y="102" width="6" height="6" rx="1" fill="#10B981" />
          
          {/* Handpiece on cradle */}
          <path d="M125 70 L165 40" stroke="#64748B" strokeWidth="8" strokeLinecap="round" />
          <path d="M125 70 L165 40" stroke="#E2E8F0" strokeWidth="5" strokeLinecap="round" />
          <path d="M165 40 L175 32" stroke="#94A3B8" strokeWidth="2" />
          
          {/* Spray mist */}
          <path d="M175 32 Q190 25 185 10 M175 32 Q195 35 198 20" stroke="#60A5FA" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 2" />
        </svg>
      );

    case 'silicona':
      return (
        <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="80" fill="#F1F5F9" />
          
          {/* Base putty tub (Blue) */}
          <path d="M40 100 H110 V140 C110 148 102 155 92 155 H58 C48 155 40 148 40 140 Z" fill="#0284C7" stroke="#0369A1" strokeWidth="1.5" />
          <ellipse cx="75" cy="100" rx="35" ry="10" fill="#38BDF8" stroke="#0284C7" strokeWidth="1.5" />
          <text x="58" y="128" fill="#FFFFFF" fontSize="9" fontWeight="bold">BASE</text>
          
          {/* Catalizador putty tub (Grey) */}
          <path d="M95 80 H160 V120 C160 128 152 135 142 135 H113 C103 135 95 128 95 120 Z" fill="#64748B" stroke="#475569" strokeWidth="1.5" />
          <ellipse cx="127" cy="80" rx="32" ry="10" fill="#94A3B8" stroke="#64748B" strokeWidth="1.5" />
          <text x="108" y="108" fill="#FFFFFF" fontSize="8" fontWeight="bold">CATALYST</text>
          
          {/* Brand sticker look */}
          <rect x="55" y="134" width="40" height="10" fill="#FFFFFF" rx="2" />
          <text x="58" y="141" fill="#0F172A" fontSize="5" fontWeight="bold">Zhermack</text>
        </svg>
      );

    case 'pulido':
    case 'clinpro':
    case 'fresa':
    default:
      return (
        <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="80" fill="#F0F9FF" />
          {/* Medical capsule bottle shape */}
          <rect x="65" y="60" width="70" height="90" rx="12" fill="#FFFFFF" stroke="#0066FF" strokeWidth="1.5" />
          <rect x="75" y="45" width="50" height="15" rx="3" fill="#0066FF" />
          
          {/* Cross symbol */}
          <path d="M100 85 V115 M85 100 H115" stroke="#38BDF8" strokeWidth="5" strokeLinecap="round" />
          
          <rect x="73" y="125" width="54" height="15" fill="#E0F2FE" rx="2" />
          <text x="82" y="135" fill="#0369A1" fontSize="8" fontWeight="bold">DENTALMAT</text>
        </svg>
      );
  }
};
