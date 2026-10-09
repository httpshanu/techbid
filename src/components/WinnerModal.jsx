import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Sparkles, CheckCircle2 } from 'lucide-react';
import { TIER_CONFIG } from '../data/cardsData';

export default function WinnerModal({ overlay }) {
  useEffect(() => {
    if (overlay) {
      // Fire confetti bursts
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    }
  }, [overlay]);

  if (!overlay) return null;

  const tierInfo = TIER_CONFIG[overlay.tier] || TIER_CONFIG[1];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="relative max-w-lg w-full mx-4 p-8 sm:p-10 rounded-3xl border-2 border-yellow-400 bg-gradient-to-b from-[#161c33] via-[#090e1f] to-[#04060d] shadow-[0_0_80px_rgba(255,215,0,0.6)] text-center flex flex-col items-center">
        {/* Glowing Trophy Crest */}
        <div className="w-24 h-24 rounded-3xl bg-yellow-400/20 border-2 border-yellow-400 flex items-center justify-center shadow-[0_0_35px_rgba(255,215,0,0.7)] animate-bounce mb-4">
          <Trophy className="w-12 h-12 text-yellow-300 fill-current" />
        </div>

        {/* Title */}
        <div className="flex items-center space-x-2 text-yellow-400 font-display font-black text-2xl sm:text-3xl tracking-wider uppercase text-glow-gold">
          <Sparkles className="w-6 h-6" />
          <span>CARD WON!</span>
          <Sparkles className="w-6 h-6" />
        </div>

        {/* Winning Team */}
        <div className="mt-5 px-6 py-2 rounded-2xl bg-cyan-950/80 border border-cyan-500/50 shadow-[0_0_25px_rgba(0,240,255,0.4)]">
          <span className="font-display font-black text-3xl sm:text-4xl text-cyan-300 tracking-wide uppercase text-glow-cyan">
            {overlay.teamName}
          </span>
        </div>

        {/* Character Won */}
        <div className="mt-6 flex flex-col items-center">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">
            ACQUIRED CHARACTER
          </span>
          <h4 className="font-display font-black text-2xl text-white uppercase tracking-wider mt-1">
            {overlay.cardName}
          </h4>
          <span className={`mt-1 text-xs font-mono px-3 py-0.5 rounded-full border ${tierInfo.badge}`}>
            {tierInfo.label} (+{overlay.cardValue} PTS VALUE)
          </span>
        </div>

        {/* Bid Paid */}
        <div className="mt-6 w-full pt-4 border-t border-white/10 flex justify-between items-center px-4">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold">
            WINNING BID PAID
          </span>
          <div className="flex items-baseline space-x-1">
            <span className="font-display font-black text-3xl text-rose-400 text-glow-crimson">
              -{overlay.bidAmount}
            </span>
            <span className="text-xs font-mono text-rose-300 font-bold uppercase">
              PTS
            </span>
          </div>
        </div>

        {/* Auto Next Indicator */}
        <div className="mt-6 flex items-center space-x-2 text-[11px] font-mono text-slate-400">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>Advancing to next card automatically...</span>
        </div>
      </div>
    </div>
  );
}
