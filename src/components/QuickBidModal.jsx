import React, { useState } from 'react';
import { Gavel, X, AlertTriangle, CheckCircle, Plus } from 'lucide-react';
import { TIER_CONFIG } from '../data/cardsData';

export default function QuickBidModal({ isOpen, onClose, currentCard, teams, onConfirmBid, onAddTeam }) {
  const [selectedTeamId, setSelectedTeamId] = useState(teams[0]?.id || '');
  const [bidAmount, setBidAmount] = useState(currentCard?.value || 50);
  const [error, setError] = useState('');

  if (!isOpen || !currentCard) return null;

  const selectedTeam = teams.find(t => t.id === selectedTeamId);
  const tierInfo = TIER_CONFIG[currentCard.tier] || TIER_CONFIG[1];

  const handleConfirm = (e) => {
    e.preventDefault();
    setError('');

    const numericBid = parseInt(bidAmount, 10);
    if (isNaN(numericBid) || numericBid <= 0) {
      setError('Please enter a valid bid amount greater than 0.');
      return;
    }

    if (!selectedTeam) {
      setError('Please select a team.');
      return;
    }

    if (numericBid > selectedTeam.remainingBudget) {
      setError(`Insufficient budget! ${selectedTeam.name} only has ${selectedTeam.remainingBudget} PTS remaining.`);
      return;
    }

    const res = onConfirmBid(selectedTeamId, numericBid);
    if (res && !res.success) {
      setError(res.message);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative max-w-lg w-full rounded-3xl border border-white/20 bg-gradient-to-b from-[#161c33] via-[#0b1022] to-[#04060d] shadow-[0_0_80px_rgba(0,240,255,0.4)] p-6 sm:p-8 flex flex-col space-y-5">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center shadow-[0_0_25px_rgba(255,191,0,0.5)]">
            <Gavel className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h2 className="font-display font-black text-xl sm:text-2xl text-white uppercase tracking-wider">
              AUCTION HAMMER // SELL CARD
            </h2>
            <p className="text-xs font-mono text-cyan-400 font-semibold tracking-wider">
              ASSIGN {currentCard.name.toUpperCase()} (+{currentCard.value} PTS) TO WINNING TEAM
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="px-4 py-2.5 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs font-mono flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleConfirm} className="flex flex-col space-y-4">
          {/* Select Winning Team */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-[11px] font-mono text-slate-400 uppercase tracking-widest font-bold">
                1. SELECT WINNING TEAM:
              </label>
              {onAddTeam && (
                <button
                  type="button"
                  onClick={onAddTeam}
                  className="flex items-center space-x-1 text-[10px] font-mono text-cyan-300 hover:text-cyan-200 font-bold uppercase tracking-wider bg-cyan-950/50 hover:bg-cyan-900/60 px-2 py-0.5 rounded-md border border-cyan-500/30 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Team</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-52 overflow-y-auto pr-1">
              {teams.map(team => {
                const isSelected = team.id === selectedTeamId;
                const canAfford = team.remainingBudget >= (parseInt(bidAmount, 10) || 0);

                return (
                  <button
                    key={team.id}
                    type="button"
                    onClick={() => {
                      setSelectedTeamId(team.id);
                      setError('');
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-cyan-400 bg-cyan-950/60 shadow-[0_0_20px_rgba(0,240,255,0.4)] ring-2 ring-cyan-400/50'
                        : 'border-white/10 bg-[#0e1428]/80 hover:bg-[#151e3b] text-slate-300'
                    } ${!canAfford ? 'opacity-50' : ''}`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-display font-bold text-sm text-white">{team.name}</span>
                      {isSelected && <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />}
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 mt-1">
                      Budget: <strong className="text-amber-400">{team.remainingBudget}</strong> PTS
                    </span>
                  </button>
                );
              })}

              {/* Add Team Tile */}
              {onAddTeam && (
                <button
                  type="button"
                  onClick={onAddTeam}
                  className="p-3 rounded-2xl border border-dashed border-cyan-500/40 bg-cyan-950/20 hover:bg-cyan-950/40 text-cyan-300 font-mono text-xs flex flex-col items-center justify-center space-y-1 transition-all min-h-[64px]"
                >
                  <Plus className="w-4 h-4 text-cyan-400" />
                  <span className="text-[11px] font-bold">+ New Team</span>
                </button>
              )}
            </div>
          </div>

          {/* Bid Amount Input */}
          <div>
            <label className="text-[11px] font-mono text-slate-400 uppercase tracking-widest block mb-2 font-bold">
              2. WINNING BID AMOUNT (PTS DEDUCTED FROM BUDGET):
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                min="1"
                max={selectedTeam?.remainingBudget || 5000}
                value={bidAmount}
                onChange={(e) => {
                  setBidAmount(e.target.value);
                  setError('');
                }}
                className="flex-1 bg-[#090e1f] border border-white/20 rounded-2xl px-4 py-3 font-mono text-xl text-amber-300 focus:outline-none focus:border-amber-400 shadow-inner"
                placeholder="Enter bid points..."
                required
              />
              {/* Quick Quick Buttons */}
              <button
                type="button"
                onClick={() => setBidAmount(currentCard.value)}
                className="px-3 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-slate-300 whitespace-nowrap"
                title="Reset to card base value"
              >
                Base (+{currentCard.value})
              </button>
              <button
                type="button"
                onClick={() => setBidAmount((prev) => (parseInt(prev, 10) || 0) + 25)}
                className="px-3 py-3 rounded-2xl bg-amber-500/20 hover:bg-amber-500/35 border border-amber-400/50 text-xs font-mono font-bold text-amber-300 shadow-[0_0_12px_rgba(255,191,0,0.3)] whitespace-nowrap"
                title="Add 25 points"
              >
                +25
              </button>
              <button
                type="button"
                onClick={() => setBidAmount((prev) => (parseInt(prev, 10) || 0) + 50)}
                className="px-3 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-slate-300 whitespace-nowrap"
                title="Add 50 points"
              >
                +50
              </button>
            </div>
          </div>

          {/* Confirmation Action Button */}
          <div className="pt-3">
            <button
              type="submit"
              className="w-full py-4 rounded-2xl font-display font-black text-sm uppercase tracking-widest text-slate-950 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 shadow-[0_0_35px_rgba(255,215,0,0.6)] flex items-center justify-center space-x-2 transition-all transform active:scale-98"
            >
              <Gavel className="w-5 h-5 text-slate-950" />
              <span>CONFIRM AUCTION SALE & NEXT CARD</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
