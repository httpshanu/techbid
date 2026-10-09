import React, { useState, useEffect, useRef } from 'react';
import Card3D from '../components/Card3D';
import Timer from '../components/Timer';
import WinnerModal from '../components/WinnerModal';
import { INITIAL_CARDS } from '../data/cardsData';
import { soundEngine } from '../sound/soundEngine';
import { Play, Pause, RotateCcw, Bot, Sparkles, CheckCircle2 } from 'lucide-react';

const MOCK_TEAMS = [
  { id: 'mock_a', name: 'Alpha Squad', remainingBudget: 5000, totalCardValue: 0, cardsWon: 0, wonCards: [] },
  { id: 'mock_b', name: 'Beta Titans', remainingBudget: 5000, totalCardValue: 0, cardsWon: 0, wonCards: [] },
  { id: 'mock_c', name: 'Cyber Wolves', remainingBudget: 5000, totalCardValue: 0, cardsWon: 0, wonCards: [] },
  { id: 'mock_d', name: 'Delta Force', remainingBudget: 5000, totalCardValue: 0, cardsWon: 0, wonCards: [] }
];

export default function DemoView() {
  const [deck] = useState(() => [...INITIAL_CARDS].slice(0, 10)); // Take 10 sample cards
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [teams, setTeams] = useState(MOCK_TEAMS);
  const [timeLeft, setTimeLeft] = useState(10); // 10s fast rounds for demo
  const [isSimulating, setIsSimulating] = useState(false);
  const [stepStatus, setStepStatus] = useState('Idle. Click "Start Automated Simulation"');
  const [winnerOverlay, setWinnerOverlay] = useState(null);

  const timerRef = useRef(null);

  const currentCard = deck[currentIndex];

  // Auto-simulation step runner
  useEffect(() => {
    let timeout = null;

    if (isSimulating) {
      if (!isRevealed) {
        // Step 1: Wait 1s then reveal
        setStepStatus('Bot host is revealing mystery card...');
        timeout = setTimeout(() => {
          setIsRevealed(true);
          soundEngine.playCardFlip();
          setStepStatus('Card revealed! Starting simulated 10s auction countdown...');
          setTimeLeft(10);
        }, 1500);
      } else if (timeLeft > 0) {
        // Step 2: Tick timer
        timerRef.current = setInterval(() => {
          setTimeLeft(prev => {
            if (prev <= 1) {
              clearInterval(timerRef.current);
              return 0;
            }
            soundEngine.playTimerTick();
            return prev - 1;
          });
        }, 1000);
      } else if (timeLeft === 0 && !winnerOverlay) {
        // Step 3: Simulate Bot Bid & Winner
        soundEngine.playTimesUp();
        setStepStatus("Time's up! Calculating highest simulated bot bid...");

        timeout = setTimeout(() => {
          const eligibleTeams = teams.filter(t => t.remainingBudget >= currentCard.value);
          const winningTeam = eligibleTeams[Math.floor(Math.random() * eligibleTeams.length)] || teams[0];
          const simulatedBid = Math.min(
            winningTeam.remainingBudget,
            Math.floor(currentCard.value * (0.8 + Math.random() * 0.4))
          );

          soundEngine.playBidWin();

          // Update Mock Teams
          setTeams(prev => prev.map(t => {
            if (t.id === winningTeam.id) {
              return {
                ...t,
                remainingBudget: t.remainingBudget - simulatedBid,
                totalCardValue: t.totalCardValue + currentCard.value,
                cardsWon: t.cardsWon + 1,
                wonCards: [...t.wonCards, { ...currentCard, winningBid: simulatedBid }]
              };
            }
            return t;
          }));

          setWinnerOverlay({
            teamName: winningTeam.name,
            bidAmount: simulatedBid,
            cardName: currentCard.name,
            cardValue: currentCard.value,
            tier: currentCard.tier
          });

          setStepStatus(`Simulated winner: ${winningTeam.name} with bid of ${simulatedBid} pts!`);

          // Advance to next round after 3.5s
          setTimeout(() => {
            setWinnerOverlay(null);
            if (currentIndex < deck.length - 1) {
              setCurrentIndex(prev => prev + 1);
              setIsRevealed(false);
              setTimeLeft(10);
            } else {
              setIsSimulating(false);
              setStepStatus('Demo sequence completed 10 rounds!');
            }
          }, 3500);

        }, 1500);
      }
    }

    return () => {
      clearTimeout(timeout);
      clearInterval(timerRef.current);
    };
  }, [isSimulating, isRevealed, timeLeft, currentIndex, currentCard, teams, winnerOverlay, deck.length]);

  const handleResetDemo = () => {
    setIsSimulating(false);
    setCurrentIndex(0);
    setIsRevealed(false);
    setTimeLeft(10);
    setTeams(MOCK_TEAMS);
    setWinnerOverlay(null);
    setStepStatus('Demo reset to initial state.');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Demo Banner */}
      <div className="p-5 rounded-3xl bg-emerald-950/40 border border-emerald-500/40 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-black flex items-center justify-center font-bold">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-black text-xl text-white uppercase tracking-wider">
              DEMO SIMULATION MODE
            </h3>
            <p className="text-xs font-mono text-emerald-400">
              Safe testing sandbox • Does NOT touch or modify your real tournament match data.
            </p>
          </div>
        </div>

        {/* Sim Controls */}
        <div className="flex items-center space-x-3">
          {!isSimulating ? (
            <button
              onClick={() => setIsSimulating(true)}
              className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-display font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>START SIMULATION</span>
            </button>
          ) : (
            <button
              onClick={() => setIsSimulating(false)}
              className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-display font-bold text-xs uppercase tracking-wider transition-all"
            >
              <Pause className="w-4 h-4 fill-current" />
              <span>PAUSE SIMULATION</span>
            </button>
          )}

          <button
            onClick={handleResetDemo}
            className="flex items-center space-x-1.5 px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs uppercase tracking-wider transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>RESET</span>
          </button>
        </div>
      </div>

      {/* Status Bar */}
      <div className="px-5 py-3 rounded-2xl bg-slate-900 border border-white/10 text-center font-mono text-xs font-bold text-cyan-300">
        AI SIMULATOR LOG: <span className="text-white">{stepStatus}</span>
      </div>

      {/* Main Interactive Stage Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Card Stage */}
        <div className="lg:col-span-6 flex flex-col items-center">
          <Card3D
            card={currentCard}
            cardNumber={currentIndex + 1}
            isRevealed={isRevealed}
            onReveal={() => setIsRevealed(true)}
            size="large"
          />
        </div>

        {/* Demo Timer & Mock Leaderboard */}
        <div className="lg:col-span-6 space-y-6">
          <Timer
            timeLeft={timeLeft}
            isRunning={isSimulating && isRevealed && timeLeft > 0}
            showControls={false}
            size="large"
          />

          {/* Simulated Teams Leaderboard */}
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-white/10 backdrop-blur-md">
            <span className="text-xs font-mono uppercase font-bold text-slate-400 tracking-wider mb-3 block">
              SIMULATED BOT ROSTER (LIVE UPDATING)
            </span>

            <div className="space-y-2">
              {[...teams].sort((a, b) => b.totalCardValue - a.totalCardValue).map((team, idx) => (
                <div
                  key={team.id}
                  className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex justify-between items-center"
                >
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-amber-400">#{idx + 1}</span>
                    <span className="font-display font-bold text-sm text-white">{team.name}</span>
                  </div>
                  <div className="flex items-center space-x-4 text-xs font-mono">
                    <span className="text-yellow-400 font-bold">{team.totalCardValue} pts</span>
                    <span className="text-emerald-400 font-semibold">{team.remainingBudget} left</span>
                    <span className="text-slate-400">{team.cardsWon} won</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <WinnerModal overlay={winnerOverlay} />
    </div>
  );
}
