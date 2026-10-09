import React, { useState, useEffect } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import PresentationView from './views/PresentationView';
import HomeView from './views/HomeView';
import DisplayView from './views/DisplayView';
import AdminView from './views/AdminView';
import LeaderboardView from './views/LeaderboardView';
import TeamCardsView from './views/TeamCardsView';
import RulesView from './views/RulesView';
import DemoView from './views/DemoView';
import ResultsView from './views/ResultsView';
import TeamSetupModal from './components/TeamSetupModal';
import LoginView from './views/LoginView';
import { Sliders, Tv, Home, Lock, LogOut } from 'lucide-react';

function AppContent() {
  const { teams, isSetupModalOpen, setIsSetupModalOpen, setupTeamsCount } = useGame();

  // Authentication gate: always requires login when opening the app freshly
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      if (typeof window !== 'undefined') {
        return sessionStorage.getItem('techbid_auth') === 'true';
      }
    } catch (e) {}
    return false;
  });

  // Default to 'ppt' (Presentation Mode) as requested by user!
  const [currentView, setCurrentView] = useState(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const clean = window.location.hash.replace('#', '').replace('/', '');
      if (['ppt', 'home', 'display', 'admin', 'leaderboard', 'rules', 'demo', 'results', 'teamcards'].includes(clean)) {
        return clean;
      }
    }
    return 'ppt';
  });

  useEffect(() => {
    if (isAuthenticated) {
      window.location.hash = `/${currentView}`;
    }
  }, [currentView, isAuthenticated]);

  const handleLogin = (userProfile, targetView = 'ppt') => {
    try {
      sessionStorage.setItem('techbid_auth', 'true');
    } catch (e) {}
    setIsAuthenticated(true);
    setCurrentView(targetView);
  };

  const handleLogout = () => {
    try {
      sessionStorage.removeItem('techbid_auth');
      localStorage.removeItem('techbid_remember_auth');
    } catch (e) {}
    setIsAuthenticated(false);
  };

  // If not authenticated, render futuristic Login Gate!
  if (!isAuthenticated) {
    return <LoginView onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-[#05070f] text-slate-100 flex flex-col font-sans">
      {/* If in PPT mode, show pure PPT presentation with minimal floating mode switcher */}
      {currentView === 'ppt' ? (
        <div className="relative w-full h-full">
          <PresentationView setCurrentView={setCurrentView} />

          {/* Discreet floating mode switcher in bottom-right corner */}
          <div className="fixed bottom-4 right-4 z-50 flex items-center space-x-1.5 bg-slate-950/80 border border-slate-800 p-1.5 rounded-2xl backdrop-blur-md opacity-40 hover:opacity-100 transition-opacity">
            <button
              onClick={() => setCurrentView('leaderboard')}
              className="px-2 py-1 rounded-xl text-[10px] font-mono text-slate-400 hover:text-cyan-400 hover:bg-slate-800"
              title="View Leaderboard"
            >
              Standings
            </button>
            <button
              onClick={() => setCurrentView('teamcards')}
              className="px-2 py-1 rounded-xl text-[10px] font-mono text-slate-400 hover:text-cyan-400 hover:bg-slate-800"
              title="Team Cards"
            >
              Cards
            </button>
            <button
              onClick={() => setCurrentView('rules')}
              className="px-2 py-1 rounded-xl text-[10px] font-mono text-slate-400 hover:text-cyan-400 hover:bg-slate-800"
              title="View Rules"
            >
              Rules
            </button>
            <button
              onClick={() => setCurrentView('admin')}
              className="px-2 py-1 rounded-xl text-[10px] font-mono text-slate-400 hover:text-cyan-400 hover:bg-slate-800"
              title="Open Host Panel"
            >
              Host
            </button>
            <button
              onClick={handleLogout}
              className="px-2 py-1 rounded-xl text-[10px] font-mono text-rose-400 hover:text-rose-300 hover:bg-rose-950/50 flex items-center space-x-1"
              title="Lock / Logout"
            >
              <Lock className="w-2.5 h-2.5" />
              <span>Lock</span>
            </button>
          </div>
        </div>
      ) : (
        /* If in other views (Leaderboard, Rules, Host Admin), provide a top bar to easily return to PPT */
        <div className="min-h-screen flex flex-col">
          <header className="sticky top-0 z-40 w-full border-b border-cyan-500/20 bg-slate-950/90 backdrop-blur-xl px-4 py-2.5 flex justify-between items-center">
            <button
              onClick={() => setCurrentView('ppt')}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-display font-bold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all"
            >
              <span>◀ RETURN TO PPT MODE</span>
            </button>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentView('leaderboard')}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold ${
                  currentView === 'leaderboard' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'
                }`}
              >
                LEADERBOARD
              </button>
              <button
                onClick={() => setCurrentView('teamcards')}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold ${
                  currentView === 'teamcards' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'
                }`}
              >
                TEAM CARDS
              </button>
              <button
                onClick={() => setCurrentView('rules')}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold ${
                  currentView === 'rules' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'
                }`}
              >
                RULES
              </button>
              <button
                onClick={() => setCurrentView('admin')}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold ${
                  currentView === 'admin' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'
                }`}
              >
                HOST PANEL
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-rose-500/40 text-rose-300 hover:bg-rose-950/40 text-xs font-mono font-bold transition-all ml-1"
                title="Lock Application and Log Out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>LOGOUT</span>
              </button>
            </div>
          </header>

          <main className="flex-1 w-full">
            {currentView === 'leaderboard' && <LeaderboardView setView={setCurrentView} />}
            {currentView === 'teamcards' && <TeamCardsView setView={setCurrentView} />}
            {currentView === 'rules' && <RulesView setView={setCurrentView} />}
            {currentView === 'admin' && <AdminView setView={setCurrentView} />}
            {currentView === 'results' && <ResultsView setView={setCurrentView} />}
            {currentView === 'demo' && <DemoView />}
          </main>
        </div>
      )}

      {/* Team Setup Prompt on Website Launch */}
      <TeamSetupModal
        isOpen={isSetupModalOpen}
        initialCount={teams.length}
        onClose={() => setIsSetupModalOpen(false)}
        onConfirm={(count) => {
          setupTeamsCount(count);
          setIsSetupModalOpen(false);
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}
