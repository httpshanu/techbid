import React, { useState, useMemo } from 'react';
import { 
  ShoppingBag, 
  Users, 
  Search, 
  Grid, 
  List, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Award, 
  Trophy, 
  Sparkles, 
  Flame, 
  ArrowUpDown, 
  Download, 
  Printer 
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { TIER_CONFIG } from '../data/cardsData';

const TEAM_COLOR_PALETTES = [
  { bg: 'from-cyan-950/70 to-blue-950/90', border: 'border-cyan-500/40', text: 'text-cyan-300', glow: 'shadow-[0_0_20px_rgba(0,240,255,0.2)]', badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40', dot: 'bg-cyan-400' },
  { bg: 'from-purple-950/70 to-indigo-950/90', border: 'border-purple-500/40', text: 'text-purple-300', glow: 'shadow-[0_0_20px_rgba(168,85,247,0.2)]', badge: 'bg-purple-500/20 text-purple-300 border-purple-500/40', dot: 'bg-purple-400' },
  { bg: 'from-amber-950/70 to-orange-950/90', border: 'border-amber-500/40', text: 'text-amber-300', glow: 'shadow-[0_0_20px_rgba(245,158,11,0.2)]', badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40', dot: 'bg-amber-400' },
  { bg: 'from-rose-950/70 to-red-950/90', border: 'border-rose-500/40', text: 'text-rose-300', glow: 'shadow-[0_0_20px_rgba(244,63,94,0.2)]', badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40', dot: 'bg-rose-400' },
  { bg: 'from-emerald-950/70 to-teal-950/90', border: 'border-emerald-500/40', text: 'text-emerald-300', glow: 'shadow-[0_0_20px_rgba(16,185,129,0.2)]', badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40', dot: 'bg-emerald-400' },
  { bg: 'from-blue-950/70 to-sky-950/90', border: 'border-blue-500/40', text: 'text-blue-300', glow: 'shadow-[0_0_20px_rgba(59,130,246,0.2)]', badge: 'bg-blue-500/20 text-blue-300 border-blue-500/40', dot: 'bg-blue-400' },
  { bg: 'from-fuchsia-950/70 to-pink-950/90', border: 'border-fuchsia-500/40', text: 'text-fuchsia-300', glow: 'shadow-[0_0_20px_rgba(217,70,239,0.2)]', badge: 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/40', dot: 'bg-fuchsia-400' },
  { bg: 'from-yellow-950/70 to-lime-950/90', border: 'border-yellow-500/40', text: 'text-yellow-300', glow: 'shadow-[0_0_20px_rgba(234,179,8,0.2)]', badge: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40', dot: 'bg-yellow-400' },
];

function TierBadge({ tier }) {
  const cfg = TIER_CONFIG[tier] || TIER_CONFIG[1];
  return (
    <span className={`text-[10px] font-mono font-black px-2 py-0.5 rounded border uppercase tracking-wider ${cfg.badge}`}>
      {cfg.label}
    </span>
  );
}

export default function TeamCardsView() {
  const { teams } = useGame();
  const [selectedTeamId, setSelectedTeamId] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [searchTerm, setSearchTerm] = useState('');
  const [tierFilter, setTierFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent'); // 'recent' | 'bid_high' | 'points_high' | 'roi_high' | 'name'

  // Flatten all purchases with team context
  const allPurchases = useMemo(() => {
    return teams.flatMap((team, teamIndex) => {
      const won = team.wonCards || [];
      return won.map((card, cardIndex) => {
        const winningBid = card.winningBid || 0;
        const cardValue = card.value || 0;
        const netROI = cardValue - winningBid;
        return {
          ...card,
          uniqueKey: `${team.id}-${card.id || card.name}-${cardIndex}`,
          teamId: team.id,
          teamName: team.name,
          teamIndex,
          winningBid,
          cardValue,
          netROI,
          purchaseOrder: card.wonAt ? new Date(card.wonAt).getTime() : cardIndex
        };
      });
    });
  }, [teams]);

  // Filtered and sorted purchases
  const filteredPurchases = useMemo(() => {
    let list = [...allPurchases];

    if (selectedTeamId !== 'all') {
      list = list.filter(item => item.teamId === selectedTeamId);
    }

    if (tierFilter !== 'all') {
      list = list.filter(item => String(item.tier) === String(tierFilter));
    }

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(item => 
        item.name.toLowerCase().includes(q) ||
        item.teamName.toLowerCase().includes(q) ||
        (item.universe && item.universe.toLowerCase().includes(q))
      );
    }

    // Sort
    list.sort((a, b) => {
      if (sortBy === 'recent') return b.purchaseOrder - a.purchaseOrder;
      if (sortBy === 'bid_high') return b.winningBid - a.winningBid;
      if (sortBy === 'points_high') return b.cardValue - a.cardValue;
      if (sortBy === 'roi_high') return b.netROI - a.netROI;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

    return list;
  }, [allPurchases, selectedTeamId, tierFilter, searchTerm, sortBy]);

  // Overall Statistics
  const totalCardsSold = allPurchases.length;
  const totalPointsValue = allPurchases.reduce((s, c) => s + c.cardValue, 0);
  const totalBidsSpent = allPurchases.reduce((s, c) => s + c.winningBid, 0);
  const totalNetGain = totalPointsValue - totalBidsSpent;
  const highestBid = allPurchases.reduce((max, c) => c.winningBid > max ? c.winningBid : max, 0);

  // Selected Team Info (if single team selected)
  const currentTeam = selectedTeamId !== 'all' ? teams.find(t => t.id === selectedTeamId) : null;
  const currentTeamIndex = selectedTeamId !== 'all' ? teams.findIndex(t => t.id === selectedTeamId) : 0;
  const currentTeamColor = TEAM_COLOR_PALETTES[currentTeamIndex % TEAM_COLOR_PALETTES.length];

  // Export CSV Handler
  const handleExportCSV = () => {
    if (allPurchases.length === 0) {
      alert('No purchases recorded yet to export.');
      return;
    }
    const headers = ['Card Name', 'Universe', 'Tier', 'Card Points', 'Winning Team', 'Winning Bid', 'Net Points ROI'];
    const rows = allPurchases.map(c => [
      `"${c.name}"`,
      `"${c.universe || 'Comic'}"`,
      `"Tier ${c.tier}"`,
      c.cardValue,
      `"${c.teamName}"`,
      c.winningBid,
      c.netROI
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `techbid_team_cards_ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print Handler
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* ========================================================= */}
      {/* HEADER BANNER                                             */}
      {/* ========================================================= */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-2 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-cyan-500/40 bg-cyan-950/40 text-cyan-300 text-xs font-mono font-bold uppercase mb-2 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
            <ShoppingBag className="w-3.5 h-3.5 text-cyan-400" />
            <span>OFFICIAL AUCTION LEDGER</span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-white uppercase tracking-wider text-glow-cyan">
            TEAM CARDS & PURCHASES
          </h2>
          <p className="text-xs sm:text-sm font-mono text-slate-400 mt-1">
            Konsi team ne konsa card kitne points ka khareeda aur uske card points kitne mile — full breakdown
          </p>
        </div>

        {/* Action Buttons: Export CSV & Print */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/15 text-slate-200 hover:text-white text-xs font-mono font-bold transition-all"
            title="Download CSV Ledger"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>EXPORT CSV</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/15 text-slate-200 hover:text-white text-xs font-mono font-bold transition-all"
            title="Print Official Ledger"
          >
            <Printer className="w-3.5 h-3.5 text-amber-400" />
            <span>PRINT</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* KPI STATS OVERVIEW CARDS                                  */}
      {/* ========================================================= */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Cards Sold */}
        <div className="rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-white/10 p-4 relative overflow-hidden">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider">CARDS SOLD</span>
            <ShoppingBag className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="font-display font-black text-2xl sm:text-3xl text-white leading-none">
            {totalCardsSold}
          </p>
          <span className="text-[10px] font-mono text-slate-500 mt-1 block">across all {teams.length} teams</span>
        </div>

        {/* Total Card Points Claimed */}
        <div className="rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-amber-500/30 p-4 relative overflow-hidden shadow-[0_0_20px_rgba(245,158,11,0.1)]">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-mono text-amber-400 uppercase font-bold tracking-wider">CARD VALUE</span>
            <Trophy className="w-4 h-4 text-amber-400" />
          </div>
          <p className="font-display font-black text-2xl sm:text-3xl text-amber-400 text-glow-gold leading-none">
            +{totalPointsValue} <span className="text-xs font-mono text-amber-300 font-normal">PTS</span>
          </p>
          <span className="text-[10px] font-mono text-slate-500 mt-1 block">total team points acquired</span>
        </div>

        {/* Total Bids Spent */}
        <div className="rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-rose-500/30 p-4 relative overflow-hidden shadow-[0_0_20px_rgba(244,63,94,0.1)]">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-mono text-rose-400 uppercase font-bold tracking-wider">BUDGET SPENT</span>
            <DollarSign className="w-4 h-4 text-rose-400" />
          </div>
          <p className="font-display font-black text-2xl sm:text-3xl text-rose-400 leading-none">
            {totalBidsSpent} <span className="text-xs font-mono text-rose-300 font-normal">PTS</span>
          </p>
          <span className="text-[10px] font-mono text-slate-500 mt-1 block">highest bid: {highestBid} pts</span>
        </div>

        {/* Net Profit / Return on Investment */}
        <div className="rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-emerald-500/30 p-4 relative overflow-hidden shadow-[0_0_20px_rgba(16,185,129,0.1)]">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold tracking-wider">NET GAIN / ROI</span>
            {totalNetGain >= 0 ? <TrendingUp className="w-4 h-4 text-emerald-400" /> : <TrendingDown className="w-4 h-4 text-red-400" />}
          </div>
          <p className={`font-display font-black text-2xl sm:text-3xl leading-none ${totalNetGain >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {totalNetGain >= 0 ? '+' : ''}{totalNetGain} <span className="text-xs font-mono font-normal">PTS</span>
          </p>
          <span className="text-[10px] font-mono text-slate-500 mt-1 block">(Card Points - Bid Amount)</span>
        </div>
      </div>

      {/* ========================================================= */}
      {/* TEAM SELECTION TABS                                       */}
      {/* ========================================================= */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        <button
          onClick={() => setSelectedTeamId('all')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider shrink-0 transition-all border ${
            selectedTeamId === 'all'
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/60 shadow-[0_0_15px_rgba(0,240,255,0.25)]'
              : 'bg-slate-900/70 text-slate-400 border-white/10 hover:border-white/25 hover:text-white'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>ALL TEAMS ({allPurchases.length})</span>
        </button>

        {teams.map((team, idx) => {
          const color = TEAM_COLOR_PALETTES[idx % TEAM_COLOR_PALETTES.length];
          const wonCount = (team.wonCards || []).length;
          const isSelected = selectedTeamId === team.id;

          return (
            <button
              key={team.id}
              onClick={() => setSelectedTeamId(team.id)}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider shrink-0 transition-all border ${
                isSelected
                  ? `${color.badge} ${color.glow} font-black`
                  : 'bg-slate-900/70 text-slate-400 border-white/10 hover:border-white/25 hover:text-white'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${color.dot}`} />
              <span>{team.name}</span>
              <span className="px-1.5 py-0.2 rounded bg-black/40 text-[10px]">
                {wonCount}
              </span>
            </button>
          );
        })}
      </div>

      {/* ========================================================= */}
      {/* SINGLE TEAM SPOTLIGHT CARD (If single team selected)      */}
      {/* ========================================================= */}
      {currentTeam && (
        <div className={`p-5 rounded-3xl border bg-gradient-to-br ${currentTeamColor.bg} ${currentTeamColor.border} ${currentTeamColor.glow} space-y-4`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div className="flex items-center space-x-3">
              <div className={`w-4 h-4 rounded-full ${currentTeamColor.dot} animate-pulse`} />
              <div>
                <h3 className={`font-display font-black text-2xl uppercase tracking-wider ${currentTeamColor.text}`}>
                  {currentTeam.name}
                </h3>
                <p className="text-xs font-mono text-slate-300">
                  {currentTeam.wonCards?.length || 0} Cards Acquired • Starting Budget: {currentTeam.startingBudget || 5000} pts
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Card Points</span>
                <span className="font-display font-black text-xl text-amber-400">+{currentTeam.totalCardValue || 0} pts</span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Spent Bids</span>
                <span className="font-mono font-bold text-xl text-rose-400">{currentTeam.totalSpent || 0} pts</span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Net Gain</span>
                <span className={`font-mono font-bold text-xl ${(currentTeam.totalCardValue - currentTeam.totalSpent) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {(currentTeam.totalCardValue - currentTeam.totalSpent) >= 0 ? '+' : ''}{(currentTeam.totalCardValue - currentTeam.totalSpent)}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Budget Left</span>
                <span className="font-mono font-bold text-xl text-cyan-300">{currentTeam.remainingBudget} pts</span>
              </div>
            </div>
          </div>

          {/* Budget Meter Bar */}
          <div>
            <div className="flex justify-between text-[11px] font-mono mb-1 text-slate-300">
              <span>Budget Utilization:</span>
              <span>{currentTeam.remainingBudget} pts remaining of {currentTeam.startingBudget || 5000} pts</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-900/80 overflow-hidden border border-white/10">
              <div 
                className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${Math.max(0, Math.min(100, (currentTeam.remainingBudget / (currentTeam.startingBudget || 5000)) * 100))}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* FILTER & VIEW MODE CONTROLS                               */}
      {/* ========================================================= */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-slate-950/70 border border-white/10 p-3 rounded-2xl backdrop-blur-md">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search character name, team or universe..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-500 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter by Tier */}
        <div className="flex items-center space-x-2">
          <span className="text-[10px] font-mono text-slate-400 uppercase">TIER:</span>
          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            className="bg-slate-900 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-400"
          >
            <option value="all">All Tiers</option>
            <option value="1">Tier 1 • A-Tier (50 pts)</option>
            <option value="2">Tier 2 • A-Tier (100 pts)</option>
            <option value="3">Tier 3 • A-Tier (150 pts)</option>
            <option value="4">Tier 4 • S-Tier (300 pts)</option>
            <option value="5">Tier 5 • S-Tier (350 pts)</option>
            <option value="6">Special • S-Tier (400 pts)</option>
          </select>
        </div>

        {/* Sort By */}
        <div className="flex items-center space-x-2">
          <span className="text-[10px] font-mono text-slate-400 uppercase">SORT:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-900 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-400"
          >
            <option value="recent">Latest Purchases First</option>
            <option value="bid_high">Highest Bid First</option>
            <option value="points_high">Highest Card Points</option>
            <option value="roi_high">Best Return / ROI</option>
            <option value="name">Character Name (A-Z)</option>
          </select>
        </div>

        {/* View Switcher: Grid vs Table */}
        <div className="flex items-center bg-slate-900 border border-white/10 rounded-xl p-0.5">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'grid' ? 'bg-cyan-500 text-black shadow-md' : 'text-slate-400 hover:text-white'
            }`}
            title="Card Gallery Grid"
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'table' ? 'bg-cyan-500 text-black shadow-md' : 'text-slate-400 hover:text-white'
            }`}
            title="Detailed Table / Ledger"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* PURCHASES LIST / GRID                                     */}
      {/* ========================================================= */}
      {filteredPurchases.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-12 text-center space-y-3">
          <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto" />
          <h4 className="font-display font-black text-xl text-white uppercase tracking-wider">
            {allPurchases.length === 0 ? 'NO CARDS PURCHASED YET' : 'NO MATCHING PURCHASES FOUND'}
          </h4>
          <p className="text-xs font-mono text-slate-400 max-w-md mx-auto">
            {allPurchases.length === 0
              ? 'Auction me jab kisi card ka hammer girta hai aur winner select hota hai, to vo card yaha team ke name, winning bid aur points ke sath appear hoga.'
              : 'Try changing your search term or tier filters.'}
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        /* ========================================================= */
        /* GALLERY GRID VIEW                                         */
        /* ========================================================= */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredPurchases.map((card) => {
            const teamColor = TEAM_COLOR_PALETTES[card.teamIndex % TEAM_COLOR_PALETTES.length];
            const isProfitable = card.netROI >= 0;

            return (
              <div
                key={card.uniqueKey}
                className="group rounded-3xl bg-slate-900/90 border border-white/10 hover:border-cyan-400/50 transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-xl hover:shadow-[0_0_25px_rgba(0,240,255,0.15)]"
              >
                <div>
                  {/* Card Image Banner */}
                  <div className="relative h-48 w-full bg-slate-950 overflow-hidden flex items-center justify-center">
                    {card.image ? (
                      <img
                        src={card.image}
                        alt={card.name}
                        className="w-full h-full object-contain object-center"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl">
                        {card.symbol || '⭐'}
                      </div>
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-black/60 pointer-events-none" />

                    {/* Top Badges: Tier & Universe */}
                    <div className="absolute top-3 left-3 right-3 flex justify-between items-center pointer-events-none">
                      <TierBadge tier={card.tier} />
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-slate-300 font-bold uppercase">
                        {card.universe || 'COMIC'}
                      </span>
                    </div>

                    {/* Winning Team Floating Pill */}
                    <div className="absolute bottom-2.5 left-3">
                      <span className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-bold uppercase border backdrop-blur-md ${teamColor.badge}`}>
                        <span className={`w-2 h-2 rounded-full ${teamColor.dot}`} />
                        <span>{card.teamName}</span>
                      </span>
                    </div>
                  </div>

                  {/* Card Content & Name */}
                  <div className="p-4 space-y-3">
                    <div>
                      <h4 className="font-display font-black text-lg text-white uppercase tracking-wider truncate">
                        {card.name}
                      </h4>
                      {card.desc && (
                        <p className="text-[11px] font-mono text-slate-400 line-clamp-2 mt-0.5">
                          {card.desc}
                        </p>
                      )}
                    </div>

                    {/* Transaction Metrics Breakdown */}
                    <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-black/40 border border-white/5 text-center">
                      {/* Winning Bid */}
                      <div>
                        <span className="text-[9px] font-mono text-slate-500 uppercase block font-bold">BID PAID</span>
                        <span className="font-mono font-bold text-sm text-rose-400">
                          {card.winningBid} <span className="text-[10px]">pts</span>
                        </span>
                      </div>

                      {/* Card Value Points */}
                      <div>
                        <span className="text-[9px] font-mono text-slate-500 uppercase block font-bold">CARD PTS</span>
                        <span className="font-display font-black text-sm text-amber-400">
                          +{card.cardValue}
                        </span>
                      </div>

                      {/* Net Gain / ROI */}
                      <div>
                        <span className="text-[9px] font-mono text-slate-500 uppercase block font-bold">NET ROI</span>
                        <span className={`font-mono font-bold text-sm ${isProfitable ? 'text-emerald-400' : 'text-red-400'}`}>
                          {isProfitable ? '+' : ''}{card.netROI}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer Info */}
                <div className="px-4 py-2.5 border-t border-white/5 bg-slate-950/60 flex items-center justify-between text-[10px] font-mono text-slate-500">
                  <span>Card Value: +{card.cardValue}</span>
                  <span className={isProfitable ? 'text-emerald-400' : 'text-red-400'}>
                    {isProfitable ? '✓ PROFIT' : '⚠ OVERBID'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ========================================================= */
        /* TABLE / LEDGER VIEW                                       */
        /* ========================================================= */
        <div className="rounded-3xl border border-white/10 bg-slate-900/80 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-slate-950/80 text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4 w-12 text-center">#</th>
                  <th className="py-3 px-4">Character & Universe</th>
                  <th className="py-3 px-4">Tier</th>
                  <th className="py-3 px-4">Winning Team</th>
                  <th className="py-3 px-4 text-right">Card Points</th>
                  <th className="py-3 px-4 text-right">Winning Bid</th>
                  <th className="py-3 px-4 text-right">Net Return (ROI)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs font-mono">
                {filteredPurchases.map((card, i) => {
                  const teamColor = TEAM_COLOR_PALETTES[card.teamIndex % TEAM_COLOR_PALETTES.length];
                  const isProfitable = card.netROI >= 0;

                  return (
                    <tr key={card.uniqueKey} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4 text-center text-slate-500">
                        {String(i + 1).padStart(2, '0')}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          {card.image ? (
                            <img
                              src={card.image}
                              alt={card.name}
                              className="w-10 h-10 rounded-xl object-contain object-center bg-slate-950 border border-white/10 shrink-0"
                            />
                          ) : (
                            <span className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-lg border border-white/10 shrink-0">
                              {card.symbol || '⭐'}
                            </span>
                          )}
                          <div className="min-w-0">
                            <span className="font-display font-black text-sm text-white uppercase block truncate">
                              {card.name}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {card.universe || 'Comic'}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <TierBadge tier={card.tier} />
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${teamColor.badge}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${teamColor.dot}`} />
                          <span>{card.teamName}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="font-display font-black text-sm text-amber-400">
                          +{card.cardValue}
                        </span>
                        <span className="text-[9px] text-slate-500 block">pts</span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="font-mono font-bold text-sm text-rose-400">
                          {card.winningBid}
                        </span>
                        <span className="text-[9px] text-slate-500 block">bid pts</span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className={`font-mono font-bold text-sm ${isProfitable ? 'text-emerald-400' : 'text-red-400'}`}>
                          {isProfitable ? '+' : ''}{card.netROI}
                        </span>
                        <span className="text-[9px] text-slate-500 block">
                          {isProfitable ? 'profit' : 'loss'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
