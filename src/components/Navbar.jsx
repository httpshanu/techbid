import React from 'react';
import { 
  Tv, 
  Sliders, 
  Trophy, 
  BookOpen, 
  PlayCircle, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize, 
  Flame,
  Award,
  Home
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { soundEngine } from '../sound/soundEngine';

export default function Navbar({ currentView, setView }) {
  const { isSoundMuted, setIsSoundMuted, currentIndex, deck } = useGame();
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  const toggleSound = () => {
    const newState = soundEngine.toggleSound();
    setIsSoundMuted(!newState);
  };

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

  const navItems = [
    { id: 'home', label: 'HUB', icon: Home },
    { id: 'display', label: 'PROJECTOR DISPLAY', icon: Tv, highlight: true },
    { id: 'admin', label: 'HOST PANEL', icon: Sliders },
    { id: 'leaderboard', label: 'LEADERBOARD', icon: Trophy },
    { id: 'rules', label: 'RULES', icon: BookOpen },
    { id: 'demo', label: 'DEMO MODE', icon: PlayCircle },
    { id: 'results', label: 'FINALE', icon: Award }
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-cyan-500/20 bg-slate-950/90 backdrop-blur-xl px-4 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand / Logo */}
        <div 
          onClick={() => setView('home')} 
          className="flex items-center space-x-2.5 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 via-amber-500 to-yellow-400 flex items-center justify-center shadow-[0_0_20px_rgba(244,63,94,0.6)] group-hover:scale-105 transition-transform">
            <Flame className="w-5 h-5 text-black fill-current animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-display font-black text-xl tracking-wider text-white group-hover:text-cyan-300 transition-colors">
                TECH BID
              </span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                LIVE
              </span>
            </div>
            <div className="text-[10px] font-mono text-slate-400">
              CARD {currentIndex + 1} / {deck.length}
            </div>
          </div>
        </div>

        {/* View Switcher Pills */}
        <nav className="hidden lg:flex items-center space-x-1 bg-slate-900/80 border border-slate-800 p-1 rounded-2xl">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl font-display text-xs tracking-wider font-bold transition-all ${
                  isActive
                    ? item.highlight
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-black shadow-[0_0_15px_rgba(0,240,255,0.5)]'
                      : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Quick Utilities (Fullscreen & Audio) */}
        <div className="flex items-center space-x-2">
          {/* Mobile view selector */}
          <select
            value={currentView}
            onChange={(e) => setView(e.target.value)}
            className="lg:hidden bg-slate-900 text-cyan-300 border border-cyan-500/40 rounded-xl px-2.5 py-1.5 text-xs font-mono font-bold"
          >
            {navItems.map(item => (
              <option key={item.id} value={item.id}>{item.label}</option>
            ))}
          </select>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            title={isSoundMuted ? "Unmute SFX" : "Mute SFX"}
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-cyan-400 transition-colors"
          >
            {isSoundMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            title="Toggle Projector Fullscreen"
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-cyan-400 transition-colors"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
}
