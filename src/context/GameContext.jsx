import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { INITIAL_CARDS } from '../data/cardsData';
import { soundEngine } from '../sound/soundEngine';

const GameContext = createContext();

const STORAGE_KEY = 'techbid_state_v5';
const SYNC_CHANNEL_NAME = 'techbid_live_sync';

const DEFAULT_TEAMS = [
  { id: 'team_1', name: 'Team 1', startingBudget: 5000, remainingBudget: 5000, cardsWon: 0, totalCardValue: 0, totalSpent: 0, wonCards: [] },
  { id: 'team_2', name: 'Team 2', startingBudget: 5000, remainingBudget: 5000, cardsWon: 0, totalCardValue: 0, totalSpent: 0, wonCards: [] },
  { id: 'team_3', name: 'Team 3', startingBudget: 5000, remainingBudget: 5000, cardsWon: 0, totalCardValue: 0, totalSpent: 0, wonCards: [] },
  { id: 'team_4', name: 'Team 4', startingBudget: 5000, remainingBudget: 5000, cardsWon: 0, totalCardValue: 0, totalSpent: 0, wonCards: [] },
  { id: 'team_5', name: 'Team 5', startingBudget: 5000, remainingBudget: 5000, cardsWon: 0, totalCardValue: 0, totalSpent: 0, wonCards: [] },
  { id: 'team_6', name: 'Team 6', startingBudget: 5000, remainingBudget: 5000, cardsWon: 0, totalCardValue: 0, totalSpent: 0, wonCards: [] },
];

function shuffleDeck(cards) {
  const arr = [...cards];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function GameProvider({ children }) {
  // Load saved state or set defaults
  const [deck, setDeck] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('techbid_state_v3');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.deck && parsed.deck.length === INITIAL_CARDS.length) {
          const initialMap = new Map(INITIAL_CARDS.map(c => [c.id, c]));
          return parsed.deck.map(c => {
            const initial = initialMap.get(c.id);
            return {
              ...c,
              ...(initial || {})
            };
          });
        }
      }
    } catch (e) {
      console.error(e);
    }
    return shuffleDeck(INITIAL_CARDS);
  });

  const [currentIndex, setCurrentIndex] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('techbid_state_v3');
      if (saved) return JSON.parse(saved).currentIndex || 0;
    } catch (e) {}
    return 0;
  });

  const [isRevealed, setIsRevealed] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('techbid_state_v3');
      if (saved) return !!JSON.parse(saved).isRevealed;
    } catch (e) {}
    return false;
  });

  const [teams, setTeams] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('techbid_state_v3');
      if (saved && JSON.parse(saved).teams) {
        const parsed = JSON.parse(saved).teams;
        // Migrate any letter-based names (Team A -> Team 1, Team B -> Team 2, etc.) and upgrade 1000 budget to 5000
        return parsed.map((t, idx) => {
          let team = t;
          if (/^Team [A-Z]$/i.test(team.name)) {
            team = { ...team, name: `Team ${idx + 1}`, id: `team_${idx + 1}` };
          }
          if (team.startingBudget === 1000 || (!team.startingBudget && team.remainingBudget <= 1000 && team.cardsWon === 0)) {
            team = {
              ...team,
              startingBudget: 5000,
              remainingBudget: team.cardsWon === 0 ? 5000 : Math.max(0, 5000 - (team.totalSpent || 0))
            };
          }
          return team;
        });
      }
    } catch (e) {}
    return DEFAULT_TEAMS;
  });

  const [isSetupModalOpen, setIsSetupModalOpen] = useState(true);
  const [hasConfiguredTeams, setHasConfiguredTeams] = useState(false);

  const [startingBudget, setStartingBudget] = useState(5000);
  const [timerDuration, setTimerDuration] = useState(30);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [winnerOverlay, setWinnerOverlay] = useState(null); // { teamName, bidAmount, cardName, cardValue }
  const [isSoundMuted, setIsSoundMuted] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const broadcastChannelRef = useRef(null);

  // Setup BroadcastChannel for real-time dual screen synchronization
  useEffect(() => {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      broadcastChannelRef.current = new BroadcastChannel(SYNC_CHANNEL_NAME);
      broadcastChannelRef.current.onmessage = (event) => {
        const { type, data } = event.data || {};
        if (type === 'SYNC_ALL') {
          if (data.deck) setDeck(data.deck);
          if (typeof data.currentIndex === 'number') setCurrentIndex(data.currentIndex);
          if (typeof data.isRevealed === 'boolean') setIsRevealed(data.isRevealed);
          if (data.teams) setTeams(data.teams);
          if (typeof data.timeLeft === 'number') setTimeLeft(data.timeLeft);
          if (typeof data.isTimerRunning === 'boolean') setIsTimerRunning(data.isTimerRunning);
          if (data.winnerOverlay !== undefined) setWinnerOverlay(data.winnerOverlay);
        } else if (type === 'TRIGGER_SFX') {
          if (data.sfx === 'reveal') soundEngine.playCardFlip();
          if (data.sfx === 'win') soundEngine.playBidWin();
          if (data.sfx === 'timesUp') soundEngine.playTimesUp();
          if (data.sfx === 'champion') soundEngine.playChampionFanfare();
        }
      };
    }

    return () => {
      if (broadcastChannelRef.current) {
        broadcastChannelRef.current.close();
      }
    };
  }, []);

  // Broadcast helper
  const broadcast = useCallback((type, data) => {
    if (broadcastChannelRef.current) {
      try {
        broadcastChannelRef.current.postMessage({ type, data });
      } catch (err) {
        console.warn('Broadcast error:', err);
      }
    }
  }, []);

  // Persist state to localStorage on changes
  useEffect(() => {
    try {
      const stateToSave = {
        deck,
        currentIndex,
        isRevealed,
        teams,
        startingBudget
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
      console.error(e);
    }
  }, [deck, currentIndex, isRevealed, teams, startingBudget]);

  // Current Card helper
  const currentCard = deck[currentIndex] || deck[0];
  const nextCard = deck[currentIndex + 1] || null;

  // Preload next image for instant reveal
  useEffect(() => {
    if (nextCard && nextCard.image) {
      const img = new Image();
      img.src = nextCard.image;
    }
  }, [nextCard]);

  // Timer Tick Interval
  useEffect(() => {
    let interval = null;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            soundEngine.playTimesUp();
            broadcast('TRIGGER_SFX', { sfx: 'timesUp' });
            return 0;
          }
          if (prev <= 6) {
            soundEngine.playWarningBeep();
          } else {
            soundEngine.playTimerTick();
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft, broadcast]);

  // Card Controls
  const revealCard = useCallback(() => {
    setIsRevealed(true);
    soundEngine.playCardFlip();
    broadcast('TRIGGER_SFX', { sfx: 'reveal' });
    broadcast('SYNC_ALL', { isRevealed: true });
  }, [broadcast]);

  const hideCard = useCallback(() => {
    setIsRevealed(false);
    broadcast('SYNC_ALL', { isRevealed: false });
  }, [broadcast]);

  const nextCardHandler = useCallback(() => {
    if (currentIndex < deck.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      setIsRevealed(false);
      setTimeLeft(timerDuration);
      setIsTimerRunning(false);
      broadcast('SYNC_ALL', {
        currentIndex: newIndex,
        isRevealed: false,
        timeLeft: timerDuration,
        isTimerRunning: false
      });
    }
  }, [currentIndex, deck.length, timerDuration, broadcast]);

  const prevCardHandler = useCallback(() => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      setIsRevealed(false);
      setTimeLeft(timerDuration);
      setIsTimerRunning(false);
      broadcast('SYNC_ALL', {
        currentIndex: newIndex,
        isRevealed: false,
        timeLeft: timerDuration,
        isTimerRunning: false
      });
    }
  }, [currentIndex, timerDuration, broadcast]);

  const skipCard = useCallback(() => {
    nextCardHandler();
  }, [nextCardHandler]);

  // Timer Controls
  const startTimer = useCallback(() => {
    setIsTimerRunning(true);
    broadcast('SYNC_ALL', { isTimerRunning: true, timeLeft });
  }, [timeLeft, broadcast]);

  const pauseTimer = useCallback(() => {
    setIsTimerRunning(false);
    broadcast('SYNC_ALL', { isTimerRunning: false, timeLeft });
  }, [timeLeft, broadcast]);

  const resetTimer = useCallback(() => {
    setIsTimerRunning(false);
    setTimeLeft(timerDuration);
    broadcast('SYNC_ALL', { isTimerRunning: false, timeLeft: timerDuration });
  }, [timerDuration, broadcast]);

  // Bidding & Winner Confirmation Logic
  const confirmWinner = useCallback((winningTeamId, winningBidAmount) => {
    const bid = Number(winningBidAmount);
    if (!winningTeamId) {
      return { success: false, message: 'Please select a winning team.' };
    }
    if (isNaN(bid) || bid <= 0) {
      return { success: false, message: 'Please enter a valid bid amount greater than 0.' };
    }

    const team = teams.find(t => t.id === winningTeamId);
    if (!team) {
      return { success: false, message: 'Selected team not found.' };
    }

    if (bid > team.remainingBudget) {
      return {
        success: false,
        message: `❌ INSUFFICIENT BUDGET! ${team.name} only has ${team.remainingBudget} points remaining.`
      };
    }

    const card = currentCard;

    // Update Team Stats
    const updatedTeams = teams.map(t => {
      if (t.id === winningTeamId) {
        return {
          ...t,
          remainingBudget: t.remainingBudget - bid,
          totalSpent: t.totalSpent + bid,
          cardsWon: t.cardsWon + 1,
          totalCardValue: t.totalCardValue + card.value,
          wonCards: [...t.wonCards, { ...card, winningBid: bid, wonAt: new Date().toISOString() }]
        };
      }
      return t;
    });

    setTeams(updatedTeams);

    // Trigger Sound & Overlay
    soundEngine.playBidWin();
    broadcast('TRIGGER_SFX', { sfx: 'win' });

    const overlayData = {
      teamName: team.name,
      bidAmount: bid,
      cardName: card.name,
      cardValue: card.value,
      tier: card.tier
    };

    setWinnerOverlay(overlayData);
    broadcast('SYNC_ALL', { teams: updatedTeams, winnerOverlay: overlayData });

    // Auto-dismiss overlay after 4 seconds and advance card
    setTimeout(() => {
      setWinnerOverlay(null);
      broadcast('SYNC_ALL', { winnerOverlay: null });
      nextCardHandler();
    }, 4000);

    return { success: true };
  }, [teams, currentCard, nextCardHandler, broadcast]);

  // Reshuffle Deck
  const reshuffle = useCallback(() => {
    const newDeck = shuffleDeck(INITIAL_CARDS);
    setDeck(newDeck);
    setCurrentIndex(0);
    setIsRevealed(false);
    setTimeLeft(timerDuration);
    setIsTimerRunning(false);
    broadcast('SYNC_ALL', {
      deck: newDeck,
      currentIndex: 0,
      isRevealed: false,
      timeLeft: timerDuration,
      isTimerRunning: false
    });
  }, [timerDuration, broadcast]);

  // Reset Entire Game
  const resetEntireGame = useCallback(() => {
    const freshDeck = shuffleDeck(INITIAL_CARDS);
    const freshTeams = DEFAULT_TEAMS.map(t => ({
      ...t,
      startingBudget,
      remainingBudget: startingBudget,
      cardsWon: 0,
      totalCardValue: 0,
      totalSpent: 0,
      wonCards: []
    }));

    setDeck(freshDeck);
    setCurrentIndex(0);
    setIsRevealed(false);
    setTeams(freshTeams);
    setTimeLeft(timerDuration);
    setIsTimerRunning(false);
    setWinnerOverlay(null);
    localStorage.removeItem(STORAGE_KEY);

    broadcast('SYNC_ALL', {
      deck: freshDeck,
      currentIndex: 0,
      isRevealed: false,
      teams: freshTeams,
      timeLeft: timerDuration,
      isTimerRunning: false,
      winnerOverlay: null
    });
  }, [startingBudget, timerDuration, broadcast]);

  // Update Team Names
  const updateTeamName = useCallback((teamId, newName) => {
    setTeams(prev => {
      const updated = prev.map(t => t.id === teamId ? { ...t, name: newName } : t);
      broadcast('SYNC_ALL', { teams: updated });
      return updated;
    });
  }, [broadcast]);

  // Dynamically Add New Team
  const addTeam = useCallback((customName) => {
    setTeams(prev => {
      const nextNum = prev.length + 1;
      const teamName = customName?.trim() || `Team ${nextNum}`;
      const newTeam = {
        id: `team_${Date.now()}_${nextNum}`,
        name: teamName,
        startingBudget,
        remainingBudget: startingBudget,
        cardsWon: 0,
        totalCardValue: 0,
        totalSpent: 0,
        wonCards: []
      };
      const updated = [...prev, newTeam];
      broadcast('SYNC_ALL', { teams: updated });
      return updated;
    });
  }, [startingBudget, broadcast]);

  // Dynamically Remove Team
  const removeTeam = useCallback((teamId) => {
    setTeams(prev => {
      if (prev.length <= 2) return prev; // keep at least 2 teams
      const updated = prev.filter(t => t.id !== teamId);
      broadcast('SYNC_ALL', { teams: updated });
      return updated;
    });
  }, [broadcast]);

  // Bulk Initialize Teams Count (e.g. 2, 4, 6, 8, 10, 12 teams)
  const setupTeamsCount = useCallback((count) => {
    const num = Math.max(2, Math.min(24, parseInt(count, 10) || 4));
    const newTeams = Array.from({ length: num }, (_, i) => ({
      id: `team_${i + 1}`,
      name: `Team ${i + 1}`,
      startingBudget: 5000,
      remainingBudget: 5000,
      cardsWon: 0,
      totalCardValue: 0,
      totalSpent: 0,
      wonCards: []
    }));

    setTeams(newTeams);
    setHasConfiguredTeams(true);
    setIsSetupModalOpen(false);
    try {
      sessionStorage.setItem('techbid_session_teams_set', 'true');
    } catch (e) {}
    broadcast('SYNC_ALL', { teams: newTeams });
    return newTeams;
  }, [broadcast]);

  return (
    <GameContext.Provider
      value={{
        deck,
        currentIndex,
        currentCard,
        upcomingCard: nextCard,
        isRevealed,
        teams,
        startingBudget,
        timeLeft,
        timerDuration,
        isTimerRunning,
        winnerOverlay,
        isSoundMuted,
        gameStarted,
        setGameStarted,
        setIsSoundMuted,
        revealCard,
        hideCard,
        nextCard: nextCardHandler,
        prevCard: prevCardHandler,
        skipCard,
        startTimer,
        pauseTimer,
        resetTimer,
        confirmWinner,
        reshuffle,
        resetEntireGame,
        updateTeamName,
        addTeam,
        removeTeam,
        hasConfiguredTeams,
        setHasConfiguredTeams,
        setupTeamsCount,
        setTimerDuration,
        isSetupModalOpen,
        setIsSetupModalOpen
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export const useGame = () => useContext(GameContext);
