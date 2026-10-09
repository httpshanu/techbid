import React, { useState } from 'react';
import { Trophy, X, Shield, Award, Sparkles, Plus, Trash2, ShoppingBag, ChevronDown, ChevronUp } from 'lucide-react';

export default function LeaderboardDrawer({ isOpen, onClose, teams = [], onAddTeam, onRemoveTeam, onOpenTeamCards }) {
  const [expandedTeamId, setExpandedTeamId] = useState(null);
  if (!isOpen) return null;

  // Sort teams by totalCardValue descending, then remaining budget
  const sortedTeams = [...teams].sort((a, b) => {
    if (b.totalCardValue !== a.totalCardValue) {
      return b.totalCardValue - a.totalCardValue;
    }
    return b.remainingBudget - a.remainingBudget;
  });

  const getRankBadge = (index) => {
    if (index === 0) return { icon: '🥇', label: '1ST', color: 'text-amber-400 bg-amber-950/80 border-amber-400/60 shadow-[0_0_15px_rgba(255,215,0,0.5)]' };
    if (index === 1) return { icon: '🥈', label: '2ND', color: 'text-slate-300 bg-slate-900 border-slate-400/50' };
    if (index === 2) return { icon: '🥉', label: '3RD', color: 'text-amber-600 bg-amber-950/50 border-amber-700/50' };
    return { icon: `#${index + 1}`, label: `#${index + 1}`, color: 'text-slate-500 bg-slate-900/60 border-white/5' };
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Click outside to close */}
      <div className="flex-1" onClick={onClose} />

      {/* Drawer Body */}
      <div className="relative w-full max-w-md h-full bg-gradient-to-b from-[#13192f] via-[#090e1f] to-[#04060d] border-l border-white/15 shadow-[0_0_80px_rgba(0,0,0,0.9)] p-6 flex flex-col justify-between overflow-y-auto z-10">
        <div>
          {/* Header */}
          <div className="flex justify-between items-center pb-5 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center shadow-[0_0_20px_rgba(255,191,0,0.4)]">
                <Trophy className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="font-display font-black text-xl text-white uppercase tracking-wider">
                  LIVE LEADERBOARD
                </h3>
                <p className="text-[10px] font-mono text-cyan-400 font-semibold tracking-wider">
                  AUCTION STANDINGS // 5000 PTS BUDGET
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Teams Header Bar with Add Team */}
          <div className="flex justify-between items-center mt-5 mb-1">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest font-semibold">
              {teams.length} Active Teams
            </span>
            {onAddTeam && (
              <button
                onClick={onAddTeam}
                className="flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold transition-all shadow-[0_0_15px_rgba(0,240,255,0.25)]"
                title="Add a new team (e.g. Team 7, Team 8)"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Team</span>
              </button>
            )}
          </div>

          {/* Teams List */}
          <div className="mt-5 space-y-3">
            {sortedTeams.map((team, index) => {
              const rank = getRankBadge(index);
              const budgetPercent = Math.max(0, Math.min(100, (team.remainingBudget / (team.startingBudget || 5000)) * 100));

              return (
                <div
                  key={team.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    index === 0
                      ? 'bg-gradient-to-r from-amber-950/40 via-[#101730] to-[#090d1f] border-amber-400/50 shadow-[0_0_25px_rgba(255,215,0,0.2)]'
                      : 'bg-[#0a0f22]/90 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3">
                      {/* Rank Badge */}
                      <span className={`w-8 h-8 rounded-xl border flex items-center justify-center font-display font-black text-xs ${rank.color}`}>
                        {rank.icon}
                      </span>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-display font-bold text-base text-white tracking-wide">
                            {team.name}
                          </h4>
                          {onRemoveTeam && team.cardsWon === 0 && teams.length > 2 && (
                            <button
                              onClick={() => onRemoveTeam(team.id)}
                              className="text-slate-500 hover:text-rose-400 p-0.5 rounded transition-colors"
                              title={`Delete ${team.name}`}
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">
                          {team.cardsWon} {team.cardsWon === 1 ? 'Card' : 'Cards'} Owned
                        </span>
                      </div>
                    </div>

                    {/* Total Card Value Points */}
                    <div className="text-right">
                      <span className="font-display font-black text-2xl text-amber-400 text-glow-gold leading-none">
                        +{team.totalCardValue}
                      </span>
                      <span className="block text-[9px] font-mono text-slate-400 uppercase font-semibold">
                        SCORE PTS
                      </span>
                    </div>
                  </div>

                  {/* Remaining Budget Bar */}
                  <div className="mt-3 pt-3 border-t border-white/5">
                    <div className="flex justify-between items-center text-[10px] font-mono mb-1">
                      <span className="text-slate-400">Remaining Budget:</span>
                      <span className="text-cyan-300 font-bold">{team.remainingBudget} / {team.startingBudget || 5000} PTS</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-500"
                        style={{ width: `${budgetPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Won Cards Mini Badges / Detailed List */}
                  {team.wonCards && team.wonCards.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-white/5">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-mono text-cyan-300 font-bold uppercase">
                          Purchased Cards ({team.wonCards.length}):
                        </span>
                        <button
                          onClick={() => setExpandedTeamId(expandedTeamId === team.id ? null : team.id)}
                          className="text-[10px] font-mono text-slate-400 hover:text-white flex items-center space-x-0.5"
                        >
                          <span>{expandedTeamId === team.id ? 'Collapse' : 'Details'}</span>
                          {expandedTeamId === team.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>
                      </div>

                      {expandedTeamId === team.id ? (
                        <div className="space-y-1.5 mt-2">
                          {team.wonCards.map((c, i) => (
                            <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-slate-900/90 border border-white/5 text-[11px] font-mono">
                              <div className="flex items-center space-x-2 min-w-0">
                                {c.image ? (
                                  <img src={c.image} alt={c.name} className="w-6 h-6 rounded-md object-contain object-center bg-slate-950 shrink-0" />
                                ) : (
                                  <span className="w-6 h-6 rounded-md bg-slate-800 flex items-center justify-center text-xs shrink-0">{c.symbol || '⭐'}</span>
                                )}
                                <span className="font-bold text-white uppercase truncate">{c.name}</span>
                              </div>
                              <div className="flex items-center space-x-3 shrink-0">
                                <span className="text-amber-400 font-bold">+{c.value} pts</span>
                                <span className="text-rose-400 font-bold">Bid: {c.winningBid}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {team.wonCards.map((c, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded-md text-[9px] font-mono bg-[#141d3b] border border-white/10 text-slate-300"
                              title={`${c.name} (+${c.value} pts) - Bid: ${c.winningBid} pts`}
                            >
                              {c.name} <span className="text-amber-400">+{c.value}</span> / <span className="text-rose-400">{c.winningBid}b</span>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Info with Team Cards link */}
        <div className="pt-4 border-t border-white/10 space-y-2 text-center">
          {onOpenTeamCards && (
            <button
              onClick={onOpenTeamCards}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/35 hover:to-blue-500/35 border border-cyan-500/40 text-cyan-300 font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-[0_0_15px_rgba(0,240,255,0.2)]"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>VIEW FULL TEAM CARDS & BID REGISTRY</span>
            </button>
          )}
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">
            LIVE DUAL-SYNC ENABLED • UPDATES IN REAL-TIME
          </span>
        </div>
      </div>
    </div>
  );
}
