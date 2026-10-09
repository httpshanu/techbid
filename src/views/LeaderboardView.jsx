import React, { useState } from 'react';
import { Trophy, Medal, Shield, Award, Sparkles, ChevronDown, ChevronUp, ShoppingBag } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { TIER_CONFIG } from '../data/cardsData';

export default function LeaderboardView({ setView }) {
  const { teams } = useGame();
  const [expandedTeamId, setExpandedTeamId] = useState(null);

  // Sort teams primarily by totalCardValue, secondarily by remainingBudget
  const rankedTeams = [...teams].sort((a, b) => {
    if (b.totalCardValue !== a.totalCardValue) {
      return b.totalCardValue - a.totalCardValue;
    }
    return b.remainingBudget - a.remainingBudget;
  });

  const toggleExpand = (id) => {
    setExpandedTeamId(expandedTeamId === id ? null : id);
  };

  const getRankBadge = (index) => {
    if (index === 0) {
      return (
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-yellow-500 to-amber-300 text-black flex items-center justify-center font-display font-black text-lg shadow-[0_0_20px_rgba(255,215,0,0.6)]">
          1
        </div>
      );
    }
    if (index === 1) {
      return (
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-slate-300 to-slate-100 text-black flex items-center justify-center font-display font-black text-lg shadow-[0_0_15px_rgba(226,232,240,0.4)]">
          2
        </div>
      );
    }
    if (index === 2) {
      return (
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-700 to-amber-500 text-white flex items-center justify-center font-display font-black text-lg shadow-[0_0_15px_rgba(217,119,6,0.4)]">
          3
        </div>
      );
    }
    return (
      <div className="w-10 h-10 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center font-mono font-bold text-sm border border-slate-700">
        #{index + 1}
      </div>
    );
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Title Header */}
      <div className="text-center py-4">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-yellow-500/40 bg-yellow-950/40 text-yellow-300 text-xs font-mono font-bold uppercase mb-3 shadow-[0_0_20px_rgba(255,215,0,0.3)]">
          <Trophy className="w-4 h-4 text-yellow-400" />
          <span>OFFICIAL STANDINGS</span>
        </div>
        <h2 className="font-display font-black text-4xl sm:text-5xl text-white uppercase tracking-wider text-glow-gold">
          LIVE LEADERBOARD
        </h2>
        <p className="text-xs sm:text-sm font-mono text-slate-400 mt-2">
          Rankings are calculated dynamically based on Total Card Value points collected.
        </p>

        {setView && (
          <div className="mt-4 flex justify-center">
            <button
              onClick={() => setView('teamcards')}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 hover:from-cyan-500/35 hover:to-purple-500/35 border border-cyan-400/40 text-cyan-300 font-display font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(0,240,255,0.25)] hover:scale-105"
            >
              <ShoppingBag className="w-4 h-4 text-cyan-400" />
              <span>VIEW TEAM CARDS & BID LEDGER</span>
            </button>
          </div>
        )}
      </div>

      {/* Leaderboard Table / Cards */}
      <div className="space-y-3">
        {rankedTeams.map((team, index) => {
          const isLeader = index === 0;
          const isExpanded = expandedTeamId === team.id;

          return (
            <div
              key={team.id}
              className={`rounded-3xl border transition-all duration-300 overflow-hidden ${
                isLeader
                  ? 'bg-gradient-to-r from-[#1c190a]/90 via-[#0a0f1d]/90 to-[#070b14]/90 border-yellow-400/80 shadow-[0_0_35px_rgba(255,215,0,0.25)]'
                  : 'bg-slate-900/80 border-white/10 hover:border-cyan-500/40'
              }`}
            >
              {/* Row Banner */}
              <div 
                onClick={() => toggleExpand(team.id)}
                className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer"
              >
                {/* Rank & Team Name */}
                <div className="flex items-center space-x-4">
                  {getRankBadge(index)}
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-display font-black text-xl sm:text-2xl text-white uppercase tracking-wide">
                        {team.name}
                      </h3>
                      {isLeader && (
                        <span className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-yellow-400 text-black">
                          <Sparkles className="w-3 h-3" />
                          <span>CURRENT #1</span>
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-mono text-slate-400">
                      Won {team.cardsWon} {team.cardsWon === 1 ? 'Card' : 'Cards'}
                    </span>
                  </div>
                </div>

                {/* Scoreboard Stats Badges */}
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-6 items-center">
                  {/* Score */}
                  <div className="flex flex-col text-right sm:text-left">
                    <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold">
                      CARD VALUE
                    </span>
                    <span className="font-display font-black text-xl sm:text-2xl text-yellow-400 text-glow-gold">
                      {team.totalCardValue} <span className="text-xs text-yellow-300 font-mono">PTS</span>
                    </span>
                  </div>

                  {/* Budget Remaining */}
                  <div className="flex flex-col text-right sm:text-left">
                    <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold">
                      BUDGET LEFT
                    </span>
                    <span className="font-mono font-bold text-lg sm:text-xl text-emerald-400">
                      {team.remainingBudget} <span className="text-xs text-emerald-500">PTS</span>
                    </span>
                  </div>

                  {/* Total Spent */}
                  <div className="flex flex-col text-right sm:text-left">
                    <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold">
                      TOTAL SPENT
                    </span>
                    <span className="font-mono font-bold text-lg sm:text-xl text-rose-400">
                      {team.totalSpent} <span className="text-xs text-rose-500">PTS</span>
                    </span>
                  </div>

                  {/* Expand Won Cards Toggle */}
                  <div className="hidden sm:flex items-center justify-end">
                    <button
                      type="button"
                      className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-slate-800 text-xs font-mono text-slate-300 border border-slate-700 hover:border-cyan-400"
                    >
                      <span>CARDS ({team.wonCards.length})</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Expanded Card Vault View */}
              {isExpanded && (
                <div className="p-4 sm:p-5 bg-slate-950/80 border-t border-white/10">
                  <span className="text-xs font-mono uppercase font-bold text-cyan-300 tracking-wider mb-3 block">
                    CARD VAULT // {team.name.toUpperCase()} ACQUIRED CARDS
                  </span>

                  {team.wonCards.length === 0 ? (
                    <p className="text-xs font-mono text-slate-500 italic py-2">
                      No cards acquired yet in this match.
                    </p>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                      {team.wonCards.map((card, idx) => {
                        const tierInfo = TIER_CONFIG[card.tier] || TIER_CONFIG[1];
                        return (
                          <div
                            key={idx}
                            className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between overflow-hidden"
                          >
                            {card.image && (
                              <div className="h-20 -mx-3 -mt-3 mb-2 overflow-hidden bg-slate-950 flex items-center justify-center">
                                <img
                                  src={card.image}
                                  alt={card.name}
                                  className="w-full h-full object-contain object-center"
                                  onError={(e) => { e.target.style.display = 'none'; }}
                                />
                              </div>
                            )}
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm">{card.symbol || '⭐'}</span>
                              <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${tierInfo.badge}`}>
                                TIER {card.tier}
                              </span>
                            </div>
                            <h5 className="font-display font-bold text-xs text-white uppercase truncate">
                              {card.name}
                            </h5>
                            <div className="mt-2 pt-2 border-t border-white/5 flex justify-between items-center text-[10px] font-mono">
                              <span className="text-yellow-400 font-bold">+{card.value}p</span>
                              <span className="text-rose-400 font-bold">Bid: {card.winningBid}p</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
