import React, { useState } from 'react';
import { Users, Plus, Minus, ArrowRight, Shield, Sparkles, X } from 'lucide-react';

export default function TeamSetupModal({ isOpen, onConfirm, onClose, initialCount = 4 }) {
  const [count, setCount] = useState(initialCount);

  if (!isOpen) return null;

  const presets = [2, 3, 4, 5, 6, 7, 8, 10, 12];

  const handleIncrement = () => setCount(prev => Math.min(20, prev + 1));
  const handleDecrement = () => setCount(prev => Math.max(2, prev - 1));

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(count);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 animate-in fade-in duration-300">
      <div className="relative max-w-xl w-full rounded-3xl border-2 border-cyan-500/40 bg-gradient-to-b from-[#151c35] via-[#090e1f] to-[#04060d] shadow-[0_0_90px_rgba(0,240,255,0.45)] p-6 sm:p-10 flex flex-col space-y-6">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 transition-colors"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        {/* Glow Accent Header */}
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border-2 border-cyan-400/50 flex items-center justify-center shadow-[0_0_30px_rgba(0,240,255,0.5)]">
            <Users className="w-8 h-8 text-cyan-300" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-widest">
                SYSTEM INITIALIZATION
              </span>
            </div>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-wider leading-none mt-1">
              KITNI TEAMS ADD KARNI HAIN?
            </h2>
            <p className="text-xs font-mono text-slate-400 mt-1">
              Select total competing teams (Each gets 5000 PTS starting budget)
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
          {/* Quick Preset Buttons */}
          <div>
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest block mb-2 font-bold">
              QUICK SELECT:
            </span>
            <div className="grid grid-cols-5 gap-2">
              {presets.map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setCount(p)}
                  className={`py-2.5 rounded-xl font-display font-bold text-sm transition-all border ${
                    count === p
                      ? 'bg-cyan-500 text-black border-cyan-300 shadow-[0_0_20px_rgba(0,240,255,0.6)] font-black scale-105'
                      : 'bg-[#101730] hover:bg-[#182348] border-white/10 text-slate-300'
                  }`}
                >
                  {p} Teams
                </button>
              ))}
            </div>
          </div>

          {/* Stepper Counter */}
          <div className="p-4 rounded-2xl bg-[#090e1f] border border-white/15 flex items-center justify-between">
            <span className="text-xs font-mono text-slate-300 font-bold uppercase tracking-wider">
              CUSTOM TEAM COUNT:
            </span>
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={handleDecrement}
                disabled={count <= 2}
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 border border-white/10 flex items-center justify-center text-white transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>

              <div className="w-16 text-center">
                <span className="font-display font-black text-3xl text-amber-400 text-glow-gold">
                  {count}
                </span>
              </div>

              <button
                type="button"
                onClick={handleIncrement}
                disabled={count >= 20}
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 border border-white/10 flex items-center justify-center text-white transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Live Preview Badges */}
          <div>
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest block mb-2 font-bold">
              GENERATING {count} NUMBERED TEAMS:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-36 overflow-y-auto pr-1">
              {Array.from({ length: count }, (_, i) => (
                <div
                  key={i}
                  className="px-3 py-2 rounded-xl bg-[#0c1328] border border-cyan-500/20 text-slate-300 flex flex-col justify-between"
                >
                  <span className="font-display font-bold text-xs text-white">Team {i + 1}</span>
                  <span className="text-[10px] font-mono text-amber-400 font-semibold">5000 PTS</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Launch Button */}
          <button
            type="submit"
            className="w-full py-4 rounded-2xl font-display font-black text-sm uppercase tracking-widest text-slate-950 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 shadow-[0_0_35px_rgba(255,215,0,0.6)] flex items-center justify-center space-x-2 transition-all transform active:scale-98"
          >
            <span>CONFIRM {count} TEAMS & START AUCTION</span>
            <ArrowRight className="w-5 h-5 text-slate-950" />
          </button>
        </form>
      </div>
    </div>
  );
}
