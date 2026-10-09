import React from 'react';
import { 
  Tv, 
  Sliders, 
  Trophy, 
  BookOpen, 
  PlayCircle, 
  Flame, 
  Sparkles, 
  ShieldCheck, 
  Layers, 
  Clock, 
  Zap 
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import imageList from "../data/char2Images.json";

// Transparent placeholder (1x1 pixel)
const placeholder = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMB/6X1nEAAAAAASUVORK5CYII=";

const ImageCard = ({ src, alt }) => {
  const [imgSrc, setImgSrc] = React.useState(src);
  const handleError = () => setImgSrc(placeholder);
  return (
    <div className="image-card">
      <img src={imgSrc} alt={alt} onError={handleError} className="image-card-img" />
    </div>
  );
};

const ImageCardGrid = () => {
  const uniqueImages = Array.from(new Map(imageList.map(name => [name.toLowerCase(), name])).values());
  return (
    <div className="image-card-grid">
      {uniqueImages.map(fileName => (
        <ImageCard key={fileName} src={`/char2/${fileName}`} alt={fileName} />
      ))}
    </div>
  );
};

export default function HomeView({ setView }) {
  const { currentIndex, deck, teams, startingBudget } = useGame();

  const currentCard = deck[currentIndex];

  const features = [
    {
      id: 'display',
      title: 'PROJECTOR DISPLAY',
      desc: '16:9 dedicated cinema screen mode with 3D card flips, giant timer, and winner celebrations.',
      icon: Tv,
      color: 'from-cyan-500 to-blue-600',
      badge: 'Main Stage'
    },
    {
      id: 'admin',
      title: 'HOST CONTROL PANEL',
      desc: 'Operate the auction from your laptop: reveal cards, control timer, record bids & validate budgets.',
      icon: Sliders,
      color: 'from-purple-500 to-indigo-600',
      badge: 'Host Laptop'
    },
    {
      id: 'leaderboard',
      title: 'LIVE LEADERBOARD',
      desc: 'Real-time standings tracking Total Card Value, Cards Won, Remaining Budget, and Total Spent.',
      icon: Trophy,
      color: 'from-amber-500 to-yellow-500',
      badge: 'Rankings'
    },
    {
      id: 'demo',
      title: 'DEMO SIMULATION',
      desc: 'Test the live auction flow with automated bot bids and simulated rounds before your event.',
      icon: PlayCircle,
      color: 'from-emerald-500 to-teal-600',
      badge: 'Testing'
    },
    {
      id: 'rules',
      title: 'TOURNAMENT RULES',
      desc: 'The 9 golden bidding rules, scoring formula, and tier point values.',
      icon: BookOpen,
      color: 'from-rose-500 to-pink-600',
      badge: 'Guide'
    }
  ];

  return (
    <div className="min-h-[calc(100vh-65px)] flex flex-col justify-between p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Hero Header */}
      <div className="text-center mt-4 sm:mt-8">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-cyan-500/40 bg-cyan-950/40 text-cyan-300 text-xs font-mono font-bold tracking-widest uppercase mb-4 shadow-[0_0_20px_rgba(0,240,255,0.3)] animate-pulse">
          <Sparkles className="w-3.5 h-3.5" />
          <span>OFFICIAL LIVE TOURNAMENT PLATFORM</span>
        </div>

        <h1 className="font-display font-black text-5xl sm:text-7xl lg:text-8xl tracking-tight text-white uppercase drop-shadow-2xl">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-rose-500 to-amber-400">
            TECH BID
          </span>
        </h1>

        <p className="mt-4 text-base sm:text-xl font-mono text-slate-300 max-w-2xl mx-auto tracking-wide leading-relaxed font-semibold">
          "BUILD YOUR COLLECTION. BID SMART. BECOME THE CHAMPION."
        </p>

        {/* Quick Match Status Bar */}
        <div className="mt-6 inline-flex flex-wrap justify-center items-center gap-3 sm:gap-6 px-6 py-3 rounded-2xl bg-slate-900/90 border border-white/10 backdrop-blur-md shadow-2xl">
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono text-slate-300">
              DECK: <strong className="text-white">{deck.length} CARDS (75 UNIQUE)</strong>
            </span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-slate-700" />
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-mono text-slate-300">
              TEAMS: <strong className="text-white">{teams.length} ROSTERED</strong>
            </span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-slate-700" />
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-mono text-slate-300">
              STARTING BUDGET: <strong className="text-yellow-400">{startingBudget} PTS</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Main Mode Launch Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-8">
        {features.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              onClick={() => setView(item.id)}
              className="group relative rounded-3xl p-6 border border-white/10 bg-gradient-to-b from-[#0e162e]/90 to-[#060914]/90 backdrop-blur-md hover:border-cyan-400/80 hover:shadow-[0_0_40px_rgba(0,240,255,0.25)] transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${item.color} flex items-center justify-center text-black shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 stroke-[2.2]" />
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {item.badge}
                  </span>
                </div>

                <h3 className="font-display font-black text-xl text-white uppercase tracking-wider group-hover:text-cyan-300 transition-colors">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs text-slate-400 font-sans leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono font-bold text-cyan-400 group-hover:translate-x-1 transition-transform">
                <span>LAUNCH VIEW</span>
                <span>→</span>
              </div>
            </div>
          );
        })}
      </div>
      {/* Image Card Grid */}
      <ImageCardGrid />


      {/* Footer Info */}
      <div className="text-center py-4 border-t border-white/5">
        <p className="text-xs font-mono text-slate-500">
          TECH BID LIVE AUCTION ARENA • 1-HOUR EVENT EDITION • 75 UNIQUE CARDS
        </p>
      </div>
    </div>
  );
}
