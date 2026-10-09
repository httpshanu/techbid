import React from 'react';
import Card3D from '../components/Card3D';
import Timer from '../components/Timer';
import WinnerModal from '../components/WinnerModal';
import { useGame } from '../context/GameContext';
import { Flame, Maximize2, Sparkles, Volume2, Shield } from 'lucide-react';

export default function DisplayView() {
  const {
    deck,
    currentIndex,
    currentCard,
    isRevealed,
    revealCard,
    timeLeft,
    isTimerRunning,
    startTimer,
    pauseTimer,
    resetTimer,
    winnerOverlay,
    teams
  } = useGame();

  const cardNumber = currentIndex + 1;

  // Top 3 Leader preview for side ticker
  const topTeams = [...teams].sort((a, b) => b.totalCardValue - a.totalCardValue).slice(0, 3);

  return (
    <div className="relative min-h-[calc(100vh-65px)] flex flex-col justify-between p-4 sm:p-6 lg:p-8 overflow-hidden">
      {/* Dynamic Background Atmosphere */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* TOP: HUD HEADER */}
      <div className="flex justify-between items-center z-10 border-b border-cyan-500/20 pb-4">
        {/* Left: Stage Title */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-400 flex items-center justify-center shadow-[0_0_20px_rgba(244,63,94,0.5)]">
            <Flame className="w-6 h-6 text-black fill-current animate-pulse" />
          </div>
          <div>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-wider uppercase text-glow-cyan">
              TECH BID
            </h2>
            <p className="text-xs font-mono text-cyan-400 font-semibold tracking-widest">
              LIVE ARENA // PROJECTOR FEED
            </p>
          </div>
        </div>

        {/* Center: Stage Indicator */}
        <div className="hidden md:flex items-center space-x-3 px-5 py-2 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-md">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-mono text-sm font-bold text-slate-200">
            CARD <strong className="text-cyan-400 text-base">{cardNumber}</strong> OF {deck.length}
          </span>
        </div>

        {/* Right: Quick Stage Standings Pill */}
        <div className="flex items-center space-x-2">
          {topTeams.map((team, idx) => (
            <div
              key={team.id}
              className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-mono"
            >
              <span className="font-bold text-amber-400">#{idx + 1}</span>
              <span className="text-slate-300 font-semibold">{team.name}:</span>
              <span className="text-cyan-300 font-bold">{team.totalCardValue}p</span>
            </div>
          ))}
        </div>
      </div>

      {/* CENTER & MAIN ARENA (Optimized for 16:9 Projector Distance Viewing) */}
      <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 my-4 z-10">
        {/* CENTERPIECE: 3D Holographic Collectible Card */}
        <div className="flex flex-col items-center">
          <Card3D
            card={currentCard}
            cardNumber={cardNumber}
            isRevealed={isRevealed}
            onReveal={revealCard}
            size="large"
          />

          {/* Quick Reveal instruction for projector audience */}
          {!isRevealed && (
            <div className="mt-4 flex items-center space-x-2 text-xs font-mono text-cyan-400/80 animate-pulse">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AWAITING HOST REVEAL SIGNAL</span>
            </div>
          )}
        </div>

        {/* RIGHT SIDE: LIVE COUNTDOWN TIMER & ARENA STATUS */}
        <div className="flex flex-col items-center justify-center space-y-6">
          <Timer
            timeLeft={timeLeft}
            isRunning={isTimerRunning}
            onStart={startTimer}
            onPause={pauseTimer}
            onReset={resetTimer}
            showControls={false}
            size="large"
          />

          {/* Live Stage Info Card */}
          <div className="w-full max-w-xs p-5 rounded-3xl bg-slate-950/70 border border-white/10 backdrop-blur-xl flex flex-col space-y-3 text-center">
            <span className="text-[11px] font-mono tracking-widest text-slate-400 uppercase font-semibold">
              CURRENT ROUND
            </span>
            <div className="text-sm font-mono text-slate-300">
              {isRevealed ? (
                <span className="text-emerald-400 font-bold flex items-center justify-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  <span>CARD REVEALED • BIDDING OPEN</span>
                </span>
              ) : (
                <span className="text-amber-400 font-bold flex items-center justify-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  <span>CARD LOCKED • GET READY</span>
                </span>
              )}
            </div>

            <div className="pt-3 border-t border-white/5 flex justify-between items-center text-xs font-mono text-slate-400">
              <span>DECK REMAINING</span>
              <strong className="text-cyan-400">{deck.length - cardNumber} CARDS</strong>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM TICKER: Tournament Teams Quick Budget Bar */}
      <div className="z-10 mt-auto pt-3 border-t border-cyan-500/20">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {teams.map(team => (
            <div
              key={team.id}
              className="px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col items-center backdrop-blur-sm"
            >
              <span className="text-[11px] font-mono font-bold text-slate-300 uppercase">
                {team.name}
              </span>
              <div className="flex items-center space-x-2 mt-0.5">
                <span className="text-xs font-mono text-emerald-400 font-bold">
                  {team.remainingBudget} pts
                </span>
                <span className="text-[10px] font-mono text-yellow-400 font-semibold">
                  ★{team.totalCardValue}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dramatic Winner Overlay when a card is confirmed */}
      <WinnerModal overlay={winnerOverlay} />
    </div>
  );
}
