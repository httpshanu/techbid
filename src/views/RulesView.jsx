import React from 'react';
import { 
  BookOpen, 
  Coins, 
  ShieldAlert, 
  Sparkles, 
  Trophy, 
  CheckCircle, 
  Zap, 
  Layers 
} from 'lucide-react';
import { TIER_CONFIG } from '../data/cardsData';

export default function RulesView({ setView }) {
  const rules = [
    {
      num: 1,
      title: "5000 Starting Budget",
      desc: "Every team enters the live arena with exactly 5,000 bidding points in their wallet.",
      icon: Coins,
      color: "text-cyan-400"
    },
    {
      num: 2,
      title: "One Card at a Time",
      desc: "The host reveals exactly one mystery card per round on the main projector screen.",
      icon: Layers,
      color: "text-purple-400"
    },
    {
      num: 3,
      title: "Live Bidding War",
      desc: "Teams place verbal or paddle bids within the 30-second live countdown clock.",
      icon: Zap,
      color: "text-amber-400"
    },
    {
      num: 4,
      title: "Highest Valid Bid Wins",
      desc: "The team with the highest confirmed bid when time expires secures the character card.",
      icon: Trophy,
      color: "text-yellow-400"
    },
    {
      num: 5,
      title: "Bid Amount is Deducted",
      desc: "The winning bid amount is deducted from the team's remaining budget (Remaining = Budget - Bid).",
      icon: CheckCircle,
      color: "text-rose-400"
    },
    {
      num: 6,
      title: "Card Value Added to Score",
      desc: "CRITICAL: Card Value ≠ Bid Amount! The card's point value is added to your tournament score.",
      icon: Sparkles,
      color: "text-emerald-400"
    },
    {
      num: 7,
      title: "No Negative Budgets",
      desc: "A team can NEVER bid higher than their current remaining balance. Overbids are automatically rejected.",
      icon: ShieldAlert,
      color: "text-red-400"
    },
    {
      num: 8,
      title: "S-Tier & Mythic Relics",
      desc: "S-Tier cards start at 300 base points up to 400 points, granting huge tactical score boosts.",
      icon: Sparkles,
      color: "text-yellow-400"
    },
    {
      num: 9,
      title: "Grand Champion Finale",
      desc: "When the 1-hour event ends, the team with the highest Total Card Value is crowned Tech Bid Champion.",
      icon: Trophy,
      color: "text-cyan-400"
    }
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center py-4">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-cyan-500/40 bg-cyan-950/40 text-cyan-300 text-xs font-mono font-bold uppercase mb-3">
          <BookOpen className="w-4 h-4 text-cyan-400" />
          <span>OFFICIAL RULEBOOK</span>
        </div>
        <h2 className="font-display font-black text-4xl sm:text-5xl text-white uppercase tracking-wider text-glow-cyan">
          TOURNAMENT RULES
        </h2>
        <p className="text-xs sm:text-sm font-mono text-slate-400 mt-2 max-w-xl mx-auto">
          Review the core game mechanics and points allocation formula before the live auction begins.
        </p>
      </div>

      {/* 9 Golden Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {rules.map((rule) => {
          const Icon = rule.icon;
          return (
            <div
              key={rule.num}
              className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 backdrop-blur-md hover:border-cyan-500/50 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 font-mono font-bold text-sm text-cyan-300 flex items-center justify-center">
                    0{rule.num}
                  </span>
                  <Icon className={`w-5 h-5 ${rule.color}`} />
                </div>
                <h3 className="font-display font-black text-lg text-white uppercase tracking-wide">
                  {rule.title}
                </h3>
                <p className="mt-2 text-xs text-slate-300 leading-relaxed font-sans">
                  {rule.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tier Points Table */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 backdrop-blur-md">
        <h3 className="font-display font-black text-xl text-white uppercase tracking-wider mb-4 flex items-center space-x-2">
          <Layers className="w-5 h-5 text-amber-400" />
          <span>75-CARD TIER DISTRIBUTION & BASE VALUES</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {Object.entries(TIER_CONFIG).map(([tierNum, info]) => {
            const counts = { 1: 12, 2: 22, 3: 21, 4: 15, 5: 1, 6: 4 };
            return (
              <div
                key={tierNum}
                className={`p-4 rounded-2xl bg-slate-950/70 border ${info.border} flex flex-col justify-between`}
              >
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${info.badge}`}>
                      {info.label}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      {counts[tierNum] || 0} Cards
                    </span>
                  </div>
                  <h4 className="font-display font-bold text-sm text-slate-200">
                    {info.tagline}
                  </h4>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-baseline">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">BASE VALUE</span>
                  <span className="font-display font-black text-xl text-yellow-400">
                    +{info.value} PTS
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
