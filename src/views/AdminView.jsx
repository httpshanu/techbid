import React, { useState } from 'react';
import { 
  Eye, 
  EyeOff, 
  ChevronRight, 
  ChevronLeft, 
  SkipForward, 
  Shuffle, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  Users, 
  Coins, 
  Play, 
  Pause, 
  Tv, 
  Trophy,
  Edit2
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import Timer from '../components/Timer';
import Card3D from '../components/Card3D';

export default function AdminView({ setView }) {
  const {
    deck,
    currentIndex,
    currentCard,
    isRevealed,
    revealCard,
    hideCard,
    nextCard,
    prevCard,
    skipCard,
    teams,
    timeLeft,
    isTimerRunning,
    startTimer,
    pauseTimer,
    resetTimer,
    confirmWinner,
    reshuffle,
    resetEntireGame,
    updateTeamName
  } = useGame();

  const [selectedTeamId, setSelectedTeamId] = useState(teams[0]?.id || '');
  const [bidAmount, setBidAmount] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [editingTeamId, setEditingTeamId] = useState(null);
  const [editedName, setEditedName] = useState('');

  const cardNumber = currentIndex + 1;
  const selectedTeam = teams.find(t => t.id === selectedTeamId) || teams[0];

  const handleConfirmBid = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!bidAmount || isNaN(Number(bidAmount))) {
      setErrorMessage('Please enter a valid numeric bid amount.');
      return;
    }

    const res = confirmWinner(selectedTeamId, Number(bidAmount));
    if (!res.success) {
      setErrorMessage(res.message);
    } else {
      setSuccessMessage(`Card awarded to ${selectedTeam?.name} for ${bidAmount} points!`);
      setBidAmount('');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handleEditTeam = (team) => {
    setEditingTeamId(team.id);
    setEditedName(team.name);
  };

  const handleSaveTeamName = (teamId) => {
    if (editedName.trim()) {
      updateTeamName(teamId, editedName.trim());
    }
    setEditingTeamId(null);
  };

  const handleResetWithConfirm = () => {
    if (window.confirm("⚠️ ARE YOU SURE? This will reset all budgets, cards, and scores to zero.")) {
      resetEntireGame();
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Controller Header */}
      <div className="flex flex-wrap justify-between items-center gap-4 bg-slate-900/90 border border-cyan-500/30 p-4 rounded-3xl backdrop-blur-md">
        <div>
          <h2 className="font-display font-black text-2xl text-white tracking-wide uppercase flex items-center space-x-2">
            <span>HOST CONTROL PANEL</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              OPERATOR MODE
            </span>
          </h2>
          <p className="text-xs font-mono text-slate-400 mt-0.5">
            Card {cardNumber} of {deck.length} • Real-time synced with Projector Display
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setView('display')}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-display font-bold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all"
          >
            <Tv className="w-4 h-4" />
            <span>OPEN DISPLAY MODE</span>
          </button>

          <button
            onClick={reshuffle}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-display font-bold text-xs uppercase tracking-wider transition-all"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>RESHUFFLE DECK</span>
          </button>

          <button
            onClick={handleResetWithConfirm}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-500/40 font-display font-bold text-xs uppercase tracking-wider transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>RESET GAME</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Card Control + Bid Entry Hub + Timer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Live Card Preview & Deck Navigator (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/80 border border-white/10 rounded-3xl p-6 backdrop-blur-md flex flex-col items-center justify-between space-y-6">
          <div className="w-full flex justify-between items-center border-b border-white/10 pb-3">
            <span className="text-xs font-mono uppercase font-bold text-slate-400 tracking-wider">
              ACTIVE DECK CARD
            </span>
            <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full ${
              isRevealed ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' : 'bg-amber-950 text-amber-300 border border-amber-500/40'
            }`}>
              {isRevealed ? 'REVEALED TO ROOM' : 'HIDDEN / ENCRYPTED'}
            </span>
          </div>

          {/* Compact 3D Card Preview */}
          <Card3D
            card={currentCard}
            cardNumber={cardNumber}
            isRevealed={isRevealed}
            onReveal={revealCard}
            size="compact"
          />

          {/* Card Action Controls */}
          <div className="w-full space-y-3">
            <div className="grid grid-cols-2 gap-3">
              {!isRevealed ? (
                <button
                  onClick={revealCard}
                  className="col-span-2 flex items-center justify-center space-x-2 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 text-black font-display font-extrabold text-sm uppercase tracking-wider shadow-[0_0_25px_rgba(0,240,255,0.5)] transition-all"
                >
                  <Eye className="w-5 h-5" />
                  <span>REVEAL CARD ON STAGE</span>
                </button>
              ) : (
                <button
                  onClick={hideCard}
                  className="col-span-2 flex items-center justify-center space-x-2 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-display font-bold text-xs uppercase tracking-wider border border-slate-700 transition-all"
                >
                  <EyeOff className="w-4 h-4" />
                  <span>HIDE CARD (CONCEAL)</span>
                </button>
              )}

              <button
                onClick={prevCard}
                disabled={currentIndex === 0}
                className="flex items-center justify-center space-x-1.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-200 font-display font-bold text-xs uppercase tracking-wider border border-slate-700 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>PREV CARD</span>
              </button>

              <button
                onClick={nextCard}
                disabled={currentIndex >= deck.length - 1}
                className="flex items-center justify-center space-x-1.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-200 font-display font-bold text-xs uppercase tracking-wider border border-slate-700 transition-all"
              >
                <span>NEXT CARD</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={skipCard}
              className="w-full flex items-center justify-center space-x-1.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 font-mono text-xs uppercase tracking-wider border border-slate-800 transition-all"
            >
              <SkipForward className="w-3.5 h-3.5" />
              <span>SKIP CURRENT CARD</span>
            </button>
          </div>
        </div>

        {/* Right Column: Bid Entry Hub + Timer + Live Validation (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Live Timer Control Block */}
          <div className="bg-slate-900/80 border border-white/10 rounded-3xl p-6 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono uppercase font-bold text-slate-400 tracking-wider">
                STAGE TIMER CONTROLLER
              </span>
              <p className="text-xs font-mono text-slate-400 mt-1">
                Controls the live 30-second bidding countdown
              </p>
            </div>

            <Timer
              timeLeft={timeLeft}
              isRunning={isTimerRunning}
              onStart={startTimer}
              onPause={pauseTimer}
              onReset={resetTimer}
              showControls={true}
              size="compact"
            />
          </div>

          {/* Winning Bid Entry Form */}
          <div className="bg-slate-900/80 border border-cyan-500/30 rounded-3xl p-6 backdrop-blur-md shadow-[0_0_30px_rgba(0,240,255,0.15)]">
            <div className="flex justify-between items-center border-b border-white/10 pb-3 mb-5">
              <span className="text-xs font-mono uppercase font-bold text-cyan-300 tracking-wider flex items-center space-x-2">
                <Coins className="w-4 h-4 text-cyan-400" />
                <span>RECORD WINNING BID</span>
              </span>
              <span className="text-xs font-mono text-yellow-400 font-bold">
                CARD VALUE: +{currentCard.value} PTS
              </span>
            </div>

            <form onSubmit={handleConfirmBid} className="space-y-4">
              {/* Select Winning Team */}
              <div>
                <label className="block text-xs font-mono uppercase text-slate-300 font-bold mb-2">
                  1. SELECT WINNING TEAM:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {teams.map(team => (
                    <button
                      key={team.id}
                      type="button"
                      onClick={() => setSelectedTeamId(team.id)}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        selectedTeamId === team.id
                          ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      <div className="font-display font-bold text-sm uppercase">
                        {team.name}
                      </div>
                      <div className="text-[11px] font-mono text-emerald-400 font-semibold mt-1">
                        Budget: {team.remainingBudget} pts
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Enter Winning Bid Amount */}
              <div>
                <label className="block text-xs font-mono uppercase text-slate-300 font-bold mb-2">
                  2. ENTER WINNING BID AMOUNT (Deducted from budget):
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max={selectedTeam?.remainingBudget || 5000}
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    placeholder={`Max valid bid: ${selectedTeam?.remainingBudget || 5000}`}
                    className="w-full bg-slate-950/90 border border-white/20 rounded-2xl px-5 py-3.5 text-lg font-mono text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-xs font-bold text-slate-400">
                    POINTS
                  </span>
                </div>
              </div>

              {/* Error Alert */}
              {errorMessage && (
                <div className="p-3.5 rounded-2xl bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs font-mono font-bold flex items-center space-x-2 animate-shake">
                  <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Success Alert */}
              {successMessage && (
                <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-mono font-bold flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* Confirm Button */}
              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-110 text-black font-display font-black text-sm uppercase tracking-wider shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all flex items-center justify-center space-x-2"
              >
                <CheckCircle2 className="w-5 h-5 fill-current" />
                <span>CONFIRM WINNER & DEDUCT BUDGET</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Team Roster Management */}
      <div className="bg-slate-900/80 border border-white/10 rounded-3xl p-6 backdrop-blur-md">
        <div className="flex justify-between items-center border-b border-white/10 pb-3 mb-4">
          <span className="text-xs font-mono uppercase font-bold text-slate-400 tracking-wider flex items-center space-x-2">
            <Users className="w-4 h-4 text-purple-400" />
            <span>TEAM ROSTER & LIVE BUDGET AUDIT</span>
          </span>
          <span className="text-xs font-mono text-slate-400">
            Click edit icon to rename team
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {teams.map(team => (
            <div
              key={team.id}
              className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between"
            >
              <div className="flex justify-between items-center mb-3">
                {editingTeamId === team.id ? (
                  <div className="flex items-center space-x-1.5 w-full">
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="bg-slate-900 text-xs font-mono px-2 py-1 rounded border border-cyan-400 w-full"
                    />
                    <button
                      onClick={() => handleSaveTeamName(team.id)}
                      className="text-[10px] bg-cyan-500 text-black font-bold px-2 py-1 rounded"
                    >
                      SAVE
                    </button>
                  </div>
                ) : (
                  <>
                    <h4 className="font-display font-black text-base text-white uppercase tracking-wider">
                      {team.name}
                    </h4>
                    <button
                      onClick={() => handleEditTeam(team)}
                      className="text-slate-400 hover:text-cyan-400 p-1"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-white/5">
                <div className="flex flex-col">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">BUDGET</span>
                  <span className="text-sm font-mono font-bold text-emerald-400">
                    {team.remainingBudget}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">SCORE</span>
                  <span className="text-sm font-mono font-bold text-yellow-400">
                    {team.totalCardValue}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">CARDS</span>
                  <span className="text-sm font-mono font-bold text-cyan-300">
                    {team.cardsWon}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
