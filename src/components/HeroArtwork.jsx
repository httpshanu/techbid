import React, { useState, useEffect } from 'react';

/**
 * 100% COPYRIGHT-FREE HERO ARTWORK ENGINE
 * Exactly matches the reference image:
 * High-tech concentric radar target reticle + steel bezel circular medallion + bespoke metallic weapon/emblem.
 */
export default function HeroArtwork({ card, className = "" }) {
  if (!card) return null;

  const { name, tier, color = "#00f0ff", accent = "#ffd700", symbol = "⚡", universe, image } = card;

  const [imgFailed, setImgFailed] = useState(false);

  // Critical fix: Reset failed state whenever card changes so subsequent cards load correctly
  useEffect(() => {
    setImgFailed(false);
  }, [card?.id, image]);

  if (image && !imgFailed) {
    return (
      <div className={`card-image-container relative w-full h-full rounded-2xl overflow-hidden flex items-center justify-center bg-[#070b14]/90 border border-white/10 group ${className}`}>
        {/* Real HD Comic Portrait - 100% visible, uncropped, centered, aspect ratio preserved */}
        <img
          key={card?.id || image}
          src={image}
          alt={name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-contain object-center block select-none filter contrast-[1.05]"
          onError={() => setImgFailed(true)}
        />

        {/* Outer Corner Tech Accents */}
        <span className="pointer-events-none absolute top-1.5 left-2 text-[8px] font-mono text-cyan-400/70 z-10 select-none">⌜ HD // COMIC</span>
        <span className="pointer-events-none absolute bottom-1.5 right-2 text-[8px] font-mono text-emerald-400/80 font-bold z-10 select-none">ONLINE ⌟</span>
      </div>
    );
  }

  // Render character-specific bespoke weapon / insignia in the center medallion
  const renderMedallionEmblem = () => {
    switch (name) {
      case "Steppenwolf":
        return (
          <g>
            {/* Electro-Axe of Apokolips (Exact from reference) */}
            <rect x="97" y="76" width="6" height="52" rx="2" fill="url(#steelGrad)" stroke="#4a5568" strokeWidth="1" transform="rotate(-25 100 100)" />
            {/* Double-Headed Serrated Blade */}
            <path d="M84,80 C74,72 70,60 88,55 C98,68 96,82 84,95 Z" fill="url(#silverGrad)" stroke="#fff" strokeWidth="1.5" />
            <path d="M110,88 C118,78 126,76 122,64 C108,70 104,80 110,88 Z" fill="url(#silverGrad)" stroke="#fff" strokeWidth="1" />
            <circle cx="96" cy="74" r="3.5" fill="#ff0055" filter="url(#glowRed)" />
          </g>
        );

      case "Batman":
        return (
          <g>
            <path
              d="M100,82 L105,92 C112,89 125,89 132,98 C128,105 120,107 115,105 C116,112 110,121 100,125 C90,121 84,112 85,105 C80,107 72,105 68,98 C75,89 88,89 95,92 Z"
              fill="#060912"
              stroke="#ecc94b"
              strokeWidth="2"
            />
          </g>
        );

      case "Spider-Man":
        return (
          <g>
            <ellipse cx="100" cy="100" rx="8" ry="13" fill="#e53e3e" filter="url(#glowRed)" />
            <circle cx="100" cy="84" r="5" fill="#e53e3e" />
            <path d="M96,94 C82,88 78,76 74,72" stroke="#e53e3e" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M104,94 C118,88 122,76 126,72" stroke="#e53e3e" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M96,104 C82,108 78,116 74,124" stroke="#e53e3e" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M104,104 C118,108 122,116 126,124" stroke="#e53e3e" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </g>
        );

      case "Iron Man":
        return (
          <g>
            <polygon points="100,80 118,112 82,112" fill="none" stroke="#00f0ff" strokeWidth="3" filter="url(#glowCyan)" />
            <circle cx="100" cy="100" r="10" fill="#ffffff" filter="url(#glowCyan)" />
            <circle cx="100" cy="100" r="4" fill="#00f0ff" />
          </g>
        );

      case "Thor":
        return (
          <g>
            <rect x="80" y="80" width="40" height="24" rx="3" fill="url(#silverGrad)" stroke="#00f0ff" strokeWidth="2" filter="url(#glowCyan)" />
            <rect x="97" y="104" width="6" height="34" fill="#6d4c41" rx="1.5" />
            <circle cx="100" cy="92" r="6" fill="none" stroke="#00f0ff" strokeWidth="1.5" />
          </g>
        );

      case "Superman":
        return (
          <g>
            <polygon points="100,75 125,83 118,115 100,128 82,115 75,83" fill="#c53030" stroke="#ffd700" strokeWidth="2.5" />
            <polygon points="100,80 120,86 114,111 100,122 86,111 80,86" fill="#ffd700" />
            <path d="M112,90 C106,86 92,86 90,94 C89,102 110,103 110,110 C110,116 98,118 88,114 L92,108 C98,112 105,112 105,108 C105,103 84,103 84,93 C84,85 102,82 110,86 Z" fill="#c53030" />
          </g>
        );

      case "Hulk":
        return (
          <g>
            <circle cx="100" cy="100" r="18" fill="#22543d" stroke="#48bb78" strokeWidth="3" filter="url(#glowGreen)" />
            <path d="M100,72 L100,86 M80,110 L92,102 M120,110 L108,102" stroke="#68d391" strokeWidth="4" strokeLinecap="round" />
          </g>
        );

      case "Captain America":
        return (
          <g>
            <circle cx="100" cy="100" r="24" fill="#c53030" stroke="#fff" strokeWidth="2" />
            <circle cx="100" cy="100" r="18" fill="#ffffff" />
            <circle cx="100" cy="100" r="13" fill="#c53030" />
            <circle cx="100" cy="100" r="8" fill="#2b6cb0" />
            <polygon points="100,94 102,99 107,99 103,102 105,107 100,104 95,107 97,102 93,99 98,99" fill="#ffffff" />
          </g>
        );

      case "Doctor Strange":
        return (
          <g>
            <circle cx="100" cy="100" r="22" fill="none" stroke="#ecc94b" strokeWidth="2" strokeDasharray="4 3" className="animate-spin origin-center" style={{ animationDuration: '16s' }} />
            <path d="M78,100 Q100,82 122,100 Q100,118 78,100 Z" fill="#975a16" stroke="#ecc94b" strokeWidth="2" />
            <circle cx="100" cy="100" r="7" fill="#00ff88" filter="url(#glowGreen)" />
          </g>
        );

      case "Flash":
        return (
          <g>
            <circle cx="100" cy="100" r="22" fill="#c53030" stroke="#ecc94b" strokeWidth="2" />
            <polygon points="104,74 82,102 96,102 90,126 116,98 100,98" fill="#ffd700" filter="url(#glowYellow)" />
          </g>
        );

      case "INFINITY GAUNTLET":
        return (
          <g>
            <circle cx="100" cy="100" r="11" fill="#ffff00" filter="url(#glowYellow)" />
            <circle cx="84" cy="85" r="6" fill="#b026ff" filter="url(#glowPurple)" />
            <circle cx="98" cy="78" r="6" fill="#00f0ff" filter="url(#glowCyan)" />
            <circle cx="112" cy="84" r="6" fill="#ff0055" filter="url(#glowRed)" />
            <circle cx="118" cy="98" r="6" fill="#ff7700" filter="url(#glowYellow)" />
            <circle cx="82" cy="104" r="6" fill="#00ff88" filter="url(#glowGreen)" />
          </g>
        );

      case "AVENGERS ASSEMBLE":
        return (
          <g>
            <path d="M100,68 L80,126 L94,126 L99,110 L108,110 L104,90 Z" fill="url(#cyanGrad)" />
            <path d="M100,68 L120,126 L108,126 L102,110 L94,110" fill="url(#goldGrad)" />
            <line x1="86" y1="112" x2="128" y2="112" stroke="#00f0ff" strokeWidth="4" strokeLinecap="round" />
          </g>
        );

      case "JUSTICE LEAGUE":
        return (
          <g>
            <polygon points="100,72 124,80 120,118 100,128 80,118 76,80" fill="#1e3a8a" stroke="#ffd700" strokeWidth="2.5" />
            <polygon points="100,84 105,96 118,96 107,103 111,115 100,107 89,115 93,103 82,96 95,96" fill="#ffd700" filter="url(#glowYellow)" />
          </g>
        );

      // Default: Clean Metallic Emblem with character symbol
      default:
        return (
          <text x="100" y="112" textAnchor="middle" fontSize="34" filter="url(#glowCyan)">
            {symbol}
          </text>
        );
    }
  };

  return (
    <div className={`relative w-full h-full overflow-hidden flex items-center justify-center ${className}`}>
      {/* Dynamic Reticle SVG Canvas */}
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full relative z-10"
      >
        <defs>
          {/* Metallic Gradients */}
          <linearGradient id="steelPlate" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2b3347" />
            <stop offset="40%" stopColor="#1e2538" />
            <stop offset="70%" stopColor="#141a29" />
            <stop offset="100%" stopColor="#0c101b" />
          </linearGradient>

          <linearGradient id="bezelOuter" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4a5568" />
            <stop offset="50%" stopColor="#2d3748" />
            <stop offset="100%" stopColor="#1a202c" />
          </linearGradient>

          <radialGradient id="innerCavity" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#141c2e" />
            <stop offset="70%" stopColor="#0a0f1c" />
            <stop offset="100%" stopColor="#04060c" />
          </radialGradient>

          <linearGradient id="silverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#cbd5e0" />
            <stop offset="100%" stopColor="#718096" />
          </linearGradient>

          <linearGradient id="steelGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#718096" />
            <stop offset="50%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#4a5568" />
          </linearGradient>

          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fff59d" />
            <stop offset="50%" stopColor="#ffd700" />
            <stop offset="100%" stopColor="#b7791f" />
          </linearGradient>

          <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e0fcff" />
            <stop offset="50%" stopColor="#00f0ff" />
            <stop offset="100%" stopColor="#0987a0" />
          </linearGradient>

          {/* Glow Filters */}
          <filter id="glowYellow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <filter id="glowCyan" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <filter id="glowRed" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <filter id="glowGreen" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* ======================================================== */}
        {/* CONCENTRIC RADAR TARGET RETICLE (EXACT REFERENCE DESIGN) */}
        {/* ======================================================== */}
        
        {/* Outer Ring at r=82 */}
        <circle cx="100" cy="100" r="82" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
        
        {/* Ring 2 at r=72 with tick marks */}
        <circle cx="100" cy="100" r="72" fill="none" stroke="#475569" strokeWidth="1.5" opacity="0.7" />
        {/* Circular tick marks */}
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(deg => (
          <line
            key={deg}
            x1="100"
            y1="24"
            x2="100"
            y2="30"
            stroke="#64748b"
            strokeWidth="1.5"
            transform={`rotate(${deg} 100 100)`}
          />
        ))}

        {/* Ring 3 at r=62 (Dashed tracking orbit) */}
        <circle cx="100" cy="100" r="62" fill="none" stroke="#64748b" strokeWidth="1" strokeDasharray="8 6" opacity="0.8" />

        {/* Ring 4 at r=50 */}
        <circle cx="100" cy="100" r="50" fill="none" stroke="#475569" strokeWidth="1.2" opacity="0.7" />

        {/* Ring 5 at r=40 */}
        <circle cx="100" cy="100" r="40" fill="none" stroke="#334155" strokeWidth="1" opacity="0.6" />

        {/* Hairline Crosshairs */}
        <line x1="20" y1="100" x2="180" y2="100" stroke="#475569" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />
        <line x1="100" y1="20" x2="100" y2="180" stroke="#475569" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />

        {/* ======================================================== */}
        {/* CENTER STEEL BEZEL MEDALLION                             */}
        {/* ======================================================== */}
        
        {/* Outer Heavy Steel Bezel Rim */}
        <circle cx="100" cy="100" r="32" fill="url(#bezelOuter)" stroke="#64748b" strokeWidth="2.5" filter="drop-shadow(0 0 15px rgba(0,0,0,0.9))" />
        
        {/* Rivets/Bolts along the bezel */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => (
          <circle
            key={deg}
            cx="100"
            cy="71"
            r="1.5"
            fill="#cbd5e0"
            stroke="#1a202c"
            strokeWidth="0.5"
            transform={`rotate(${deg} 100 100)`}
          />
        ))}

        {/* Deep Inset Dark Cavity */}
        <circle cx="100" cy="100" r="28" fill="url(#innerCavity)" stroke="#1a202c" strokeWidth="1.5" />

        {/* Embossed Weapon / Character Insignia */}
        {renderMedallionEmblem()}
      </svg>
    </div>
  );
}
