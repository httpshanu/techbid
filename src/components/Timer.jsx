import React from 'react';
import { Play, Pause, RotateCcw, AlertTriangle } from 'lucide-react';

export default function Timer({
  timeLeft,
  isRunning,
  onStart,
  onPause,
  onReset,
  showControls = false,
  size = "large"
}) {
  const isWarning = timeLeft <= 5 && timeLeft > 0;
  const isTimesUp = timeLeft === 0;

  // Format MM:SS
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const isLarge = size === "large";

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Timer HUD Frame */}
      <div
        className={`relative flex flex-col items-center justify-center rounded-3xl border-2 transition-all duration-300 ${
          isTimesUp
            ? 'bg-rose-950/80 border-rose-500 shadow-[0_0_50px_rgba(244,63,94,0.7)] animate-pulse'
            : isWarning
            ? 'bg-amber-950/80 border-rose-500 shadow-[0_0_40px_rgba(244,63,94,0.6)] animate-pulse'
            : 'bg-slate-950/80 border-cyan-500/40 shadow-[0_0_35px_rgba(0,240,255,0.25)]'
        } backdrop-blur-xl ${
          isLarge ? 'px-8 sm:px-12 py-5 sm:py-7 min-w-[240px] sm:min-w-[300px]' : 'px-5 py-3 min-w-[180px]'
        }`}
      >
        {/* Top Status */}
        <div className="flex items-center space-x-2 mb-1">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              isRunning ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'
            }`}
          />
          <span className="text-[11px] font-mono tracking-widest uppercase font-bold text-slate-400">
            {isTimesUp ? "STATUS // EXPIRED" : isRunning ? "BID TIMER ACTIVE" : "TIMER PAUSED"}
          </span>
        </div>

        {/* Digital Countdown Display */}
        <div
          className={`font-display font-black tracking-tight leading-none ${
            isLarge ? 'text-6xl sm:text-7xl md:text-8xl' : 'text-4xl'
          } ${
            isTimesUp
              ? 'text-rose-400 text-glow-crimson'
              : isWarning
              ? 'text-rose-400 text-glow-crimson'
              : 'text-cyan-300 text-glow-cyan'
          }`}
        >
          {isTimesUp ? "00:00" : formatted}
        </div>

        {/* TIME'S UP Alert Badge */}
        {isTimesUp && (
          <div className="mt-2 flex items-center space-x-1.5 px-3 py-1 rounded-full bg-rose-500 text-black font-display font-extrabold text-xs uppercase tracking-wider animate-bounce">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>TIME'S UP!</span>
          </div>
        )}
      </div>

      {/* Host Controls */}
      {showControls && (
        <div className="flex items-center space-x-2 sm:space-x-3 mt-4">
          {!isRunning ? (
            <button
              onClick={onStart}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-display font-bold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>START</span>
            </button>
          ) : (
            <button
              onClick={onPause}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-display font-bold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(245,158,11,0.4)] transition-all"
            >
              <Pause className="w-4 h-4 fill-current" />
              <span>PAUSE</span>
            </button>
          )}

          <button
            onClick={onReset}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-display font-bold text-xs uppercase tracking-wider transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>RESET</span>
          </button>
        </div>
      )}
    </div>
  );
}
