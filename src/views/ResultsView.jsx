import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Crown, Sparkles, Award, RotateCcw, Home } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { soundEngine } from '../sound/soundEngine';
import { TIER_CONFIG } from '../data/cardsData';

export default function ResultsView({ setView }) {
  const { teams, resetEntireGame } = useGame();

  // Sort teams by Total Card Value (primary), then remainingBudget (tie-breaker)
  const rankedTeams = [...teams].sort((a, b) => {
    if (b.totalCardValue !== a.totalCardValue) {
      return b.totalCardValue - a.totalCardValue;
    }
    return b.remainingBudget - a.remainingBudget;
  });

  const champion = rankedTeams[0] || teams[0];

  useEffect(() => {
    soundEngine.playChampionFanfare();

    // Continuous fireworks confetti animation
    const duration = 4.5 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#ffd700', '#00f0ff', '#ff0055']
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#ffd700', '#00f0ff', '#ff0055']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-10 text-center">
      {/* Grand Title Banner */}
      <div className="flex flex-col items-center">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-yellow-400 bg-yellow-950/60 text-yellow-300 text-xs font-mono font-bold uppercase mb-4 animate-bounce">
          <Crown className="w-4 h-4 text-yellow-400 fill-current" />
          <span>TOURNAMENT CONCLUDED</span>
        </div>

        <h1 className="font-display font-black text-5xl sm:text-7xl text-white uppercase tracking-wider text-glow-gold">
          GAME COMPLETE
        </h1>
        <p className="font-mono text-sm sm:text-base text-slate-300 mt-2">
          THE ULTIMATE BIDDING WAR HAS ENDED. HAIL THE VICTOR!
        </p>
      </div>

      {/* 🏆 TECH BID CHAMPION SHOWCASE */}
      <div className="relative max-w-2xl mx-auto p-8 sm:p-12 rounded-3xl border-2 border-yellow-400 bg-gradient-to-b from-[#241c04]/90 via-[#0f1429]/95 to-[#060812]/95 shadow-[0_0_80px_rgba(255,215,0,0.6)] backdrop-blur-2xl flex flex-col items-center">
        {/* Animated Trophy Aura */}
        <div className="relative w-32 h-32 rounded-3xl bg-yellow-400/20 border-2 border-yellow-400 flex items-center justify-center shadow-[0_0_50px_rgba(255,215,0,0.8)] mb-6">
          <Trophy className="w-16 h-16 text-yellow-300 fill-current animate-pulse" />
          <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-yellow-400 text-black flex items-center justify-center font-display font-black text-base shadow-lg">
            #1
          </div>
        </div>

        <span className="font-mono text-xs tracking-widest text-yellow-400 uppercase font-bold">
          OFFICIAL TOURNAMENT CHAMPION
        </span>

        <h2 className="font-display font-black text-4xl sm:text-6xl text-white uppercase tracking-wider mt-2 text-glow-gold">
          {champion.name}
        </h2>

        {/* Champion Key Stats */}
        <div className="grid grid-cols-3 gap-4 w-full mt-8 pt-6 border-t border-yellow-400/30">
          <div className="flex flex-col">
            <span className="text-[11px] font-mono text-slate-400 uppercase font-semibold">TOTAL SCORE</span>
            <span className="font-display font-black text-2xl sm:text-3xl text-yellow-400 text-glow-gold mt-1">
              {champion.totalCardValue} <span className="text-xs font-mono">PTS</span>
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-mono text-slate-400 uppercase font-semibold">CARDS WON</span>
            <span className="font-display font-black text-2xl sm:text-3xl text-cyan-300 mt-1">
              {champion.cardsWon}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-mono text-slate-400 uppercase font-semibold">REMAINING</span>
            <span className="font-display font-black text-2xl sm:text-3xl text-emerald-400 mt-1">
              {champion.remainingBudget} <span className="text-xs font-mono">PTS</span>
            </span>
          </div>
        </div>

        {/* Champion Won Cards Highlights */}
        {champion.wonCards.length > 0 && (
          <div className="w-full mt-6 text-left">
            <span className="text-[11px] font-mono uppercase text-slate-400 font-bold block mb-2 text-center">
              CHAMPION'S ACQUIRED HEROES
            </span>
            <div className="flex flex-wrap justify-center gap-2">
              {champion.wonCards.map((c, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-xl bg-slate-900 border border-yellow-500/40 text-xs font-mono text-slate-200"
                >
                  {c.symbol} {c.name} (+{c.value}p)
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Complete Final Standings Table */}
      <div className="max-w-4xl mx-auto p-6 rounded-3xl bg-slate-900/80 border border-white/10 backdrop-blur-md text-left">
        <h3 className="font-display font-black text-xl text-white uppercase tracking-wider mb-4 flex items-center space-x-2">
          <Award className="w-5 h-5 text-cyan-400" />
          <span>FINAL TOURNAMENT STANDINGS</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 uppercase">
                <th className="py-3 px-3">RANK</th>
                <th className="py-3 px-3">TEAM</th>
                <th className="py-3 px-3 text-right">CARDS WON</th>
                <th className="py-3 px-3 text-right">TOTAL SPENT</th>
                <th className="py-3 px-3 text-right">BUDGET LEFT</th>
                <th className="py-3 px-3 text-right text-yellow-400 font-bold">TOTAL SCORE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {rankedTeams.map((team, idx) => (
                <tr
                  key={team.id}
                  className={`${idx === 0 ? 'bg-yellow-500/10 font-bold' : ''} hover:bg-white/5`}
                >
                  <td className="py-3.5 px-3">
                    <span className={`px-2 py-0.5 rounded ${idx === 0 ? 'bg-yellow-400 text-black font-extrabold' : 'text-slate-400'}`}>
                      #{idx + 1}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 font-display text-sm uppercase text-white font-bold">
                    {team.name}
                  </td>
                  <td className="py-3.5 px-3 text-right text-cyan-300">{team.cardsWon}</td>
                  <td className="py-3.5 px-3 text-right text-rose-400">{team.totalSpent} pts</td>
                  <td className="py-3.5 px-3 text-right text-emerald-400">{team.remainingBudget} pts</td>
                  <td className="py-3.5 px-3 text-right text-yellow-400 text-sm font-extrabold font-display">
                    {team.totalCardValue} PTS
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reset & Return Actions */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
        <button
          onClick={() => setView('home')}
          className="flex items-center space-x-2 px-5 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-display font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all"
        >
          <Home className="w-4 h-4" />
          <span>RETURN TO HUB</span>
        </button>

        <button
          onClick={() => {
            if (window.confirm("Start a new game? This will reset all budgets and scores.")) {
              resetEntireGame();
              setView('home');
            }
          }}
          className="flex items-center space-x-2 px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-display font-bold text-xs uppercase tracking-wider border border-slate-700 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          <span>START NEW TOURNAMENT</span>
        </button>
      </div>
    </div>
  );
}
