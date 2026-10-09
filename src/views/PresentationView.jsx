import React, { useState, useEffect } from 'react';
import Card3D from '../components/Card3D';
import AnimatedBackground from '../components/AnimatedBackground';
import MythicShockwave from '../components/MythicShockwave';
import WinnerModal from '../components/WinnerModal';
import QuickBidModal from '../components/QuickBidModal';
import LeaderboardDrawer from '../components/LeaderboardDrawer';
import { useGame } from '../context/GameContext';
import { TIER_CONFIG } from '../data/cardsData';
import { 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  EyeOff, 
  Shuffle, 
  Maximize, 
  Minimize, 
  Volume2, 
  VolumeX, 
  Flame,
  Terminal,
  Activity,
  Gavel,
  Trophy,
  Users,
  Layers
} from 'lucide-react';
import { soundEngine } from '../sound/soundEngine';

export default function PresentationView({ setCurrentView }) {
  const {
    deck,
    currentIndex,
    currentCard,
    isRevealed,
    revealCard,
    hideCard,
    nextCard,
    prevCard,
    reshuffle,
    isSoundMuted,
    setIsSoundMuted,
    teams,
    confirmWinner,
    winnerOverlay,
    addTeam,
    removeTeam,
    setIsSetupModalOpen
  } = useGame();

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [shockwaveActive, setShockwaveActive] = useState(false);
  const [screenShake, setScreenShake] = useState(false);
  const [isBidModalOpen, setIsBidModalOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);

  const cardNumber = currentIndex + 1;
  const tierInfo = TIER_CONFIG[currentCard?.tier] || TIER_CONFIG[1];

  // Trigger Shockwave & Screen Shake on Legendary (Tier 4) & Mythic (Tier 5) reveal
  useEffect(() => {
    if (isRevealed && currentCard?.tier >= 4) {
      setShockwaveActive(true);
      setScreenShake(true);
      soundEngine.playMythicShockwave();

      const shakeTimer = setTimeout(() => {
        setScreenShake(false);
      }, 650);

      const shockwaveTimer = setTimeout(() => {
        setShockwaveActive(false);
      }, 3500);

      return () => {
        clearTimeout(shakeTimer);
        clearTimeout(shockwaveTimer);
      };
    } else {
      setShockwaveActive(false);
      setScreenShake(false);
    }
  }, [isRevealed, currentIndex, currentCard?.tier]);

  // Keyboard Shortcuts (Arrow Left: Prev, Arrow Right: Next, Spacebar: Reveal/Flip, F: Fullscreen)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) return;

      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        e.preventDefault();
        nextCard();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        prevCard();
      } else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (isRevealed) {
          hideCard();
        } else {
          revealCard();
        }
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === 's' || e.key === 'S' || e.key === 'b' || e.key === 'B') {
        e.preventDefault();
        setIsBidModalOpen(true);
      } else if (e.key === 'l' || e.key === 'L') {
        e.preventDefault();
        setIsLeaderboardOpen(prev => !prev);
      } else if (e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        if (setCurrentView) setCurrentView('teamcards');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRevealed, nextCard, prevCard, revealCard, hideCard]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => console.log(err));
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const toggleSound = () => {
    const s = soundEngine.toggleSound();
    setIsSoundMuted(!s);
  };

  return (
    <div className={`relative w-screen h-screen bg-[#04060c] text-slate-100 flex flex-col justify-between p-3 sm:p-5 overflow-hidden select-none ${
      screenShake ? 'animate-screen-shake' : ''
    }`}>
      {/* ========================================================= */}
      {/* 60 FPS DYNAMIC ANIMATED CYBER COMMAND BACKGROUND           */}
      {/* ========================================================= */}
      <AnimatedBackground />

      {/* ========================================================= */}
      {/* MYTHIC SCREEN SHOCKWAVE & GOLD EMBERS BURST OVERLAY        */}
      {/* ========================================================= */}
      <MythicShockwave
        active={shockwaveActive}
        tier={currentCard?.tier}
        cardName={currentCard?.name}
        onComplete={() => setShockwaveActive(false)}
      />

      {/* ========================================================= */}
      {/* TOP HEADER: EXACT MATCH TO REFERENCE UI                   */}
      {/* ========================================================= */}
      <header className="z-20 flex justify-between items-center max-w-7xl mx-auto w-full px-2 sm:px-6 pt-1">
        {/* Left: Brand Flame Logo + TECH BID */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-600 flex items-center justify-center shadow-[0_0_20px_rgba(255,120,0,0.6)]">
            <Flame className="w-6 h-6 text-white fill-current animate-pulse" />
          </div>
          <div>
            <h1 className="font-display font-black text-xl sm:text-2xl text-white tracking-widest uppercase text-glow-cyan leading-none">
              TECH BID
            </h1>
            <span className="text-[9px] font-mono text-cyan-400 font-bold tracking-widest uppercase">
              LIVE CARDS PRESENTATION
            </span>
          </div>
        </div>

        {/* Center: Slide Pill & Tier Badge (Exact from reference) */}
        <div className="flex items-center space-x-2.5 px-5 py-1.5 rounded-full bg-[#0b1021]/80 border border-white/10 backdrop-blur-md shadow-2xl">
          <span className="font-mono text-xs text-slate-400 uppercase font-semibold">CARD:</span>
          <span className="font-display font-black text-sm text-cyan-300">
            {cardNumber} <span className="text-slate-500 font-normal">/ {deck.length}</span>
          </span>
          <span className="w-px h-3.5 bg-slate-700 mx-1" />
          <span className={`text-[11px] font-mono font-extrabold px-3 py-0.5 rounded-full border ${tierInfo.badge}`}>
            {tierInfo.label} (+{currentCard.value} PTS)
          </span>
        </div>

        {/* Right: Teams count/setup, Leaderboard, Audio & Fullscreen Icons */}
        <div className="flex items-center space-x-2">
          {/* Teams Setup / Count Button */}
          <button
            onClick={() => setIsSetupModalOpen(true)}
            title="Configure Teams Count"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#0b1021]/80 hover:bg-[#151f40] border border-cyan-500/40 text-cyan-300 hover:text-cyan-200 text-xs font-mono font-bold transition-all shadow-[0_0_15px_rgba(6,182,212,0.2)]"
          >
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            <span>TEAMS ({teams.length})</span>
          </button>

          {/* Live Standings Button */}
          <button
            onClick={() => setIsLeaderboardOpen(true)}
            title="Open Live Standings (L key)"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#0b1021]/80 hover:bg-[#151f40] border border-amber-400/40 text-amber-300 hover:text-amber-200 text-xs font-mono font-bold transition-all shadow-[0_0_15px_rgba(255,191,0,0.25)]"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">STANDINGS (L)</span>
          </button>

          {/* Team Cards Registry Button */}
          <button
            onClick={() => setCurrentView && setCurrentView('teamcards')}
            title="View Team Cards & Purchased History (C key)"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#0b1021]/80 hover:bg-[#151f40] border border-cyan-400/40 text-cyan-300 hover:text-cyan-200 text-xs font-mono font-bold transition-all shadow-[0_0_15px_rgba(6,182,212,0.25)]"
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">CARDS (C)</span>
          </button>

          <button
            onClick={toggleSound}
            title="Toggle Sound"
            className="p-2 rounded-xl bg-[#0b1021]/80 hover:bg-slate-800 border border-white/10 text-slate-400 hover:text-cyan-400 transition-colors"
          >
            {isSoundMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>

          <button
            onClick={toggleFullscreen}
            title="Fullscreen (F)"
            className="p-2 rounded-xl bg-[#0b1021]/80 hover:bg-slate-800 border border-white/10 text-slate-400 hover:text-cyan-400 transition-colors"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* ========================================================= */}
      {/* CENTER: GIANT HOLOGRAPHIC BRUSHED-METAL SLAB CARD         */}
      {/* ========================================================= */}
      <div className="flex-1 flex flex-col items-center justify-center z-10 my-auto py-2">
        <Card3D
          card={currentCard}
          cardNumber={cardNumber}
          isRevealed={isRevealed}
          onReveal={revealCard}
          size="large"
        />
      </div>

      {/* ========================================================= */}
      {/* TACTICAL INTEL BRIEFING BAR (High Projector Legibility)    */}
      {/* ========================================================= */}
      {isRevealed && currentCard?.desc && (
        <div className="z-20 max-w-3xl mx-auto w-full px-4 -mt-1 mb-2">
          <div className="px-5 py-2.5 rounded-2xl bg-[#090d1c]/90 border border-cyan-500/30 backdrop-blur-xl shadow-2xl flex items-center space-x-3 text-left">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping shrink-0" />
            <div className="text-xs sm:text-[13px] text-slate-200 font-sans tracking-wide">
              <span className="text-cyan-300 font-mono font-bold uppercase mr-2 tracking-wider">
                {currentCard.name} // INTEL:
              </span>
              <span>{currentCard.desc}</span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* BOTTOM REMOTE BAR: EXACT MATCH TO REFERENCE CAPSULE       */}
      {/* ========================================================= */}
      <footer className="z-20 flex flex-col items-center pb-2">
        {/* Capsule Remote Controls */}
        <div className="flex items-center space-x-2 bg-[#090d1c]/90 border border-white/15 px-4 py-2 rounded-full backdrop-blur-xl shadow-[0_0_40px_rgba(0,0,0,0.9)]">
          {/* Previous Button */}
          <button
            onClick={prevCard}
            disabled={currentIndex === 0}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-full bg-[#121933] hover:bg-[#1a2347] disabled:opacity-30 disabled:cursor-not-allowed text-slate-200 font-display font-bold text-xs uppercase tracking-wider border border-white/10 transition-all"
            title="Previous Card (← Arrow)"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>PREV</span>
          </button>

          {/* Reveal / Conceal Card Button */}
          <button
            onClick={() => {
              if (isRevealed) hideCard();
              else revealCard();
            }}
            className={`flex items-center space-x-2 px-6 py-2 rounded-full font-display font-black text-xs uppercase tracking-wider transition-all border ${
              !isRevealed
                ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:brightness-110 text-black border-amber-300 shadow-[0_0_25px_rgba(255,160,0,0.5)]'
                : 'bg-[#121933] hover:bg-[#1a2347] text-slate-200 border-white/15'
            }`}
          >
            {!isRevealed ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            <span>{!isRevealed ? 'REVEAL CARD (SPACE)' : 'HIDE CARD'}</span>
          </button>

          {/* Live Auction Hammer Button */}
          <button
            onClick={() => setIsBidModalOpen(true)}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 hover:from-amber-500/35 hover:to-yellow-500/35 text-amber-300 font-display font-bold text-xs uppercase tracking-wider border border-amber-400/40 shadow-[0_0_15px_rgba(255,191,0,0.25)] transition-all"
            title="Auction Hammer: Sell Card to Winning Team (S or B key)"
          >
            <Gavel className="w-3.5 h-3.5 text-amber-400" />
            <span>SOLD (S)</span>
          </button>

          {/* Next Button */}
          <button
            onClick={nextCard}
            disabled={currentIndex >= deck.length - 1}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-full bg-[#121933] hover:bg-[#1a2347] disabled:opacity-30 disabled:cursor-not-allowed text-slate-200 font-display font-bold text-xs uppercase tracking-wider border border-white/10 transition-all"
            title="Next Card (→ Arrow)"
          >
            <span>NEXT</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <span className="w-px h-5 bg-white/10 mx-1" />

          {/* Shuffle Deck Button */}
          <button
            onClick={() => {
              if (window.confirm("Shuffle all 75 cards?")) {
                reshuffle();
              }
            }}
            className="p-2 rounded-full bg-[#121933] hover:bg-[#1a2347] text-slate-300 hover:text-cyan-400 border border-white/10 transition-colors"
            title="Shuffle 75 Cards"
          >
            <Shuffle className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Keyboard Remote Hint Strip (Subtle under remote) */}
        <div className="mt-2 text-[10px] font-mono text-slate-500 flex items-center space-x-3">
          <span>⌨️ Remote:</span>
          <span><kbd className="px-1 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">←</kbd> Prev</span>
          <span><kbd className="px-1 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">→</kbd> Next</span>
          <span><kbd className="px-1 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">Space</kbd> Reveal</span>
          <span><kbd className="px-1 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">S</kbd> Sold</span>
          <span><kbd className="px-1 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">L</kbd> Standings</span>
          <span><kbd className="px-1 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">C</kbd> Cards</span>
          <span><kbd className="px-1 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">F</kbd> Fullscreen</span>
        </div>
      </footer>

      {/* Quick Auction Sale Modal */}
      <QuickBidModal
        isOpen={isBidModalOpen}
        onClose={() => setIsBidModalOpen(false)}
        currentCard={currentCard}
        teams={teams}
        onConfirmBid={confirmWinner}
        onAddTeam={addTeam}
      />

      {/* Slide-In Leaderboard Drawer */}
      <LeaderboardDrawer
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        teams={teams}
        onAddTeam={addTeam}
        onRemoveTeam={removeTeam}
        onOpenTeamCards={() => {
          setIsLeaderboardOpen(false);
          if (setCurrentView) setCurrentView('teamcards');
        }}
      />

      {/* Celebratory Winner Announcement Modal */}
      <WinnerModal overlay={winnerOverlay} />
    </div>
  );
}
