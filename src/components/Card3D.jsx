import React from 'react';
import HeroArtwork from './HeroArtwork';
import { TIER_CONFIG } from '../data/cardsData';
import { Sparkles, Shield, Zap } from 'lucide-react';

export default function Card3D({ card, cardNumber, isRevealed, onReveal, size = "large" }) {
  if (!card) return null;

  const [tilt, setTilt] = React.useState({ x: 0, y: 0, glareX: 50, glareY: 50, isHovering: false });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = Number((((y - centerY) / centerY) * -11).toFixed(2));
    const rotateY = Number((((x - centerX) / centerX) * 11).toFixed(2));

    const glareX = Math.round((x / rect.width) * 100);
    const glareY = Math.round((y / rect.height) * 100);

    setTilt({ x: rotateX, y: rotateY, glareX, glareY, isHovering: true });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0, glareX: 50, glareY: 50, isHovering: false });
  };

  const tierInfo = TIER_CONFIG[card.tier] || TIER_CONFIG[1];
  const isSpecial = !!card.isSpecial;

  // Glow color mapping based on tier
  const tierGlowMap = {
    1: 'border-cyan-400 shadow-[0_0_50px_rgba(0,240,255,0.45)] text-cyan-400',
    2: 'border-purple-400 shadow-[0_0_55px_rgba(176,38,255,0.45)] text-purple-400',
    3: 'border-amber-400 shadow-[0_0_60px_rgba(255,165,0,0.55)] text-amber-400',
    4: 'border-rose-500 shadow-[0_0_65px_rgba(244,63,94,0.6)] text-rose-400',
    5: 'border-yellow-300 shadow-[0_0_75px_rgba(255,215,0,0.8)] text-yellow-300'
  };

  const activeGlow = tierGlowMap[card.tier] || tierGlowMap[1];

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative perspective-1000 w-[350px] sm:w-[410px] md:w-[450px] h-[580px] sm:h-[630px] md:h-[670px] select-none transition-transform duration-200 ease-out ${
        tilt.isHovering ? '' : 'animate-card-idle'
      }`}
      style={{
        transform: `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`
      }}
    >
      <div
        className={`w-full h-full duration-700 preserve-3d transition-transform ${
          isRevealed ? 'rotate-y-180' : ''
        }`}
      >
        {/* ==================================================== */}
        {/* BACK: UNREVEALED ENCRYPTED METALLIC SLAB             */}
        {/* ==================================================== */}
        <div
          onClick={onReveal}
          className={`absolute inset-0 backface-hidden rounded-[32px] p-5 flex flex-col justify-between cursor-pointer border-2 bg-gradient-to-b from-[#182138]/90 via-[#0a0f1d]/95 to-[#04060c] ${activeGlow} backdrop-blur-xl group hover:scale-[1.01] transition-all overflow-hidden`}
        >
          {/* Subtle Back Specular Sheen */}
          <div
            className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-300"
            style={{
              opacity: tilt.isHovering ? 0.35 : 0.1,
              background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(0,240,255,0.4) 0%, transparent 60%)`,
              mixBlendMode: 'color-dodge'
            }}
          />
          {/* Card Top Pill Header */}
          <div className="flex justify-between items-center z-10 px-1">
            <span className="px-3 py-1 rounded-md text-[10px] font-mono tracking-widest font-black uppercase bg-[#141b30] border border-white/10 text-slate-300">
              {card.universe === 'Special' ? 'MYTHIC' : card.universe.toUpperCase()}
            </span>
            <span className={`px-3 py-1 rounded-md text-[10px] font-mono font-black tracking-widest uppercase border ${tierInfo.badge}`}>
              {tierInfo.label}
            </span>
          </div>

          {/* Center Encrypted Target Plate */}
          <div className="relative my-3 flex-1 rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-b from-[#1c2336] via-[#101626] to-[#090d19] flex flex-col items-center justify-center p-4">
            {/* Corner Tech Brackets */}
            <span className="absolute top-2 left-2 text-slate-500 font-mono text-xs">⌜</span>
            <span className="absolute top-2 right-2 text-slate-500 font-mono text-xs">⌝</span>
            <span className="absolute bottom-2 left-2 text-slate-500 font-mono text-xs">⌞</span>
            <span className="absolute bottom-2 right-2 text-slate-500 font-mono text-xs">⌟</span>

            {/* Concentric Radar Rings */}
            <div className="relative w-52 h-52 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-white/15 animate-spin" style={{ animationDuration: '30s' }} />
              <div className="absolute inset-4 rounded-full border border-dotted border-white/20 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '20s' }} />
              <div className="absolute inset-10 rounded-full border border-white/10" />

              {/* Crosshair Hairlines */}
              <div className="absolute w-full h-px bg-white/10" />
              <div className="absolute h-full w-px bg-white/10" />

              {/* Steel Bezel Medal Center */}
              <div className="relative z-10 w-24 h-24 rounded-full bg-gradient-to-b from-[#2a344d] via-[#141b2c] to-[#090d18] border-2 border-white/20 shadow-[0_0_30px_rgba(0,0,0,0.9)] flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="font-display font-black text-5xl text-slate-300 drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
                  ?
                </span>
              </div>
            </div>

            <span className="mt-4 font-mono text-[10px] tracking-widest text-slate-400 font-bold uppercase">
              ENCRYPTED ASSET #{cardNumber} // LOCKED
            </span>
          </div>

          {/* Lower Info Area */}
          <div className="bg-[#0b1021]/90 border border-white/10 rounded-2xl p-4 flex flex-col space-y-2">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-display font-black text-2xl text-slate-300 uppercase tracking-wider">
                  CLASSIFIED
                </h3>
                <p className="text-[11px] font-mono text-cyan-400 tracking-wider">
                  CLICK CARD OR PRESS SPACE TO REVEAL
                </p>
              </div>
              <span className="text-xl">🔒</span>
            </div>

            <div className="pt-2 border-t border-white/10 flex justify-between items-center">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                CARD VALUE
              </span>
              <span className="font-display font-black text-2xl text-slate-400">
                +{card.value} <span className="text-xs font-mono">PTS</span>
              </span>
            </div>
          </div>

          {/* Bottom Card Rim Indicator */}
          <div className="text-center pt-2">
            <span className="text-[9px] font-mono text-cyan-400/80 tracking-widest uppercase font-semibold animate-pulse">
              ● READY TO BID • AWAITING REVEAL
            </span>
          </div>
        </div>

        {/* ==================================================== */}
        {/* FRONT: REVEALED METALLIC SLAB (EXACT TO REFERENCE)   */}
        {/* ==================================================== */}
        <div
          className={`absolute inset-0 backface-hidden rotate-y-180 rounded-[32px] p-5 flex flex-col justify-between border-2 bg-gradient-to-b from-[#182138]/90 via-[#0a0f1d]/95 to-[#04060c] ${activeGlow} backdrop-blur-xl overflow-hidden ${
            isSpecial ? 'holographic-foil border-yellow-300' : ''
          }`}
        >
          {/* ==================================================== */}
          {/* HOLOGRAPHIC FOIL & SECRET RARE PRISM GLARE OVERLAY   */}
          {/* ==================================================== */}
          {/* 1. Dynamic Cursor-Tracking Specular Glare */}
          <div
            className="pointer-events-none absolute inset-0 z-30 transition-opacity duration-300"
            style={{
              opacity: tilt.isHovering
                ? card.tier >= 4 ? 0.75 : 0.48
                : card.tier === 5 ? 0.38 : 0.18,
              background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255,255,255,0.48) 0%, rgba(255,230,120,0.28) 22%, rgba(100,240,255,0.22) 42%, rgba(220,110,255,0.25) 65%, transparent 85%)`,
              mixBlendMode: 'color-dodge',
            }}
          />

          {/* 2. Diagonal Prism Rainbow Foil Shimmer */}
          <div
            className="pointer-events-none absolute inset-0 z-25 transition-opacity duration-300 mix-blend-overlay"
            style={{
              opacity: tilt.isHovering
                ? card.tier >= 4 ? 0.6 : 0.38
                : card.tier >= 4 ? 0.35 : 0.15,
              background: `linear-gradient(${115 + tilt.y * 2.8}deg, transparent 20%, rgba(255,255,255,0.25) 35%, rgba(255,215,0,0.38) 50%, rgba(0,240,255,0.3) 65%, transparent 80%)`,
              backgroundSize: '200% 200%',
              backgroundPosition: `${tilt.glareX}% ${tilt.glareY}%`
            }}
          />

          {/* 3. Micro-etched Holographic Security Mesh */}
          <div 
            className="pointer-events-none absolute inset-0 z-20 opacity-15 mix-blend-screen"
            style={{
              backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.12) 0, rgba(255,255,255,0.12) 1px, transparent 0, transparent 4px)'
            }}
          />

          {/* Card Top Pill Header */}
          <div className="flex justify-between items-center z-10 px-1">
            <span className="px-3 py-1 rounded-md text-[10px] font-mono tracking-widest font-black uppercase bg-[#141b30] border border-white/10 text-slate-300">
              {card.universe === 'Special' ? 'MYTHIC' : card.universe.toUpperCase()}
            </span>
            <span className={`px-3 py-1 rounded-md text-[10px] font-mono font-black tracking-widest uppercase border ${tierInfo.badge}`}>
              {tierInfo.label}
            </span>
          </div>

          {/* Center Brushed Titanium Artwork Frame (Exact Reference Look) */}
          <div className="relative my-2.5 flex-1 rounded-2xl overflow-hidden border border-white/15 bg-gradient-to-b from-[#242b3e] via-[#151c2c] to-[#0c101c] shadow-2xl flex flex-col justify-between p-3">
            {/* Corner Tech Brackets & ID */}
            <div className="flex justify-between items-center text-slate-500 font-mono text-[9px] z-20">
              <span>⌜</span>
              <span className="text-slate-400">{cardNumber < 10 ? `0${cardNumber}` : cardNumber}</span>
              <span>⌝</span>
            </div>

            {/* Dedicated Hero Artwork Engine */}
            <div className="relative flex-1 min-h-0 w-full flex items-center justify-center my-1 overflow-hidden">
              <HeroArtwork key={card?.id} card={card} className="w-full h-full" />
            </div>

            {/* Bottom Tech Frame Label */}
            <div className="flex justify-between items-center text-slate-400 font-mono text-[8px] tracking-wider z-20 pt-1 border-t border-white/5">
              <span>⌞ SC // VECTOR ART</span>
              <span>VECTOR ART • 100% LEGAL ⌟</span>
            </div>
          </div>

          {/* Lower Info Panel (Exact Reference Typography) */}
          <div className="bg-[#0b1021]/90 border border-white/10 rounded-2xl p-3 sm:p-4 flex flex-col space-y-2 z-10">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-wider leading-none drop-shadow-md">
                  {card.name}
                </h3>
                <p className="text-[11px] font-mono text-cyan-300 tracking-wider mt-1 font-semibold">
                  {card.title || tierInfo.tagline}
                </p>
              </div>

              {/* Glowing Weapon / Hero Symbol */}
              <div className="text-2xl filter drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]">
                {card.symbol}
              </div>
            </div>

            {/* Tactical Powers & Lore Briefing */}
            {card.desc && (
              <div className="p-2 sm:p-2.5 rounded-xl bg-[#060a17]/90 border border-cyan-500/25 shadow-inner">
                <div className="flex items-center space-x-1.5 mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-[9px] font-mono font-bold tracking-widest text-cyan-400 uppercase">
                    HERO DOSSIER & ABILITIES
                  </span>
                </div>
                <p className="text-[12px] sm:text-[13px] font-sans text-slate-200 leading-snug tracking-normal font-medium">
                  {card.desc}
                </p>
              </div>
            )}

            {/* Card Value Row */}
            <div className="pt-2 border-t border-white/10 flex justify-between items-center">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">
                CARD VALUE
              </span>
              <div className="flex items-baseline space-x-1">
                <span className="font-display font-black text-2xl sm:text-3xl text-amber-400 text-glow-gold">
                  +{card.value}
                </span>
                <span className="text-xs font-mono text-amber-300 font-bold uppercase">
                  PTS
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Card Rim Indicator */}
          <div className="text-center pt-2">
            <span className="text-[9px] font-mono text-emerald-400 tracking-widest uppercase font-bold flex items-center justify-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span>CARD REVEALED • READY FOR BIDDING</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
