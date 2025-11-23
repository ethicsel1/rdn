import { createContext, useContext } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Zustand store for RDN state
const useRDNStore = create(
  persist(
    (set) => ({
      // User data
      user: null,
      setUser: (user) => set({ user }),
      logout: () => set({ user: null, mood: null, energy: null, time: null }),

      // Mood selection (24h persistence)
      mood: null,
      moodTimestamp: null,
      setMood: (mood) =>
        set({
          mood,
          moodTimestamp: Date.now(),
        }),

      // Energy and Time selections
      energy: null,
      time: null,
      setEnergy: (energy) => set({ energy }),
      setTime: (time) => set({ time }),

      // Goals
      globalGoals: [],
      weeklyGoal: null,
      setGlobalGoals: (goals) => set({ globalGoals: goals }),
      setWeeklyGoal: (goal) => set({ weeklyGoal: goal }),

      // Tool usage tracking
      toolUsage: {
        rinforzo: { count: 0, lastUsed: null },
        trasformatore: { count: 0, lastUsed: null },
        scudo: { count: 0, lastUsed: null },
        sos: { count: 0, lastUsed: null },
      },
      updateToolUsage: (tool) =>
        set((state) => ({
          toolUsage: {
            ...state.toolUsage,
            [tool]: {
              count: state.toolUsage[tool].count + 1,
              lastUsed: Date.now(),
            },
          },
        })),

      // Subscription level
      subscriptionLevel: 'L1', // L1 or L2
      subscriptionStatus: 'trial', // trial, active, expired
      setSubscription: (level, status) =>
        set({ subscriptionLevel: level, subscriptionStatus: status }),
    }),
    {
      name: 'rdn-storage',
      partialize: (state) => ({
        user: state.user,
        mood: state.mood,
        moodTimestamp: state.moodTimestamp,
        energy: state.energy,
        time: state.time,
        globalGoals: state.globalGoals,
        weeklyGoal: state.weeklyGoal,
        toolUsage: state.toolUsage,
        subscriptionLevel: state.subscriptionLevel,
        subscriptionStatus: state.subscriptionStatus,
      }),
    }
  )
);

// React Context for convenience
const RDNContext = createContext(null);

export const RDNProvider = ({ children }) => {
  const store = useRDNStore();

  // Check if mood is expired (24h)
  const isMoodExpired = () => {
    if (!store.moodTimestamp) return true;
    const hoursPassed = (Date.now() - store.moodTimestamp) / (1000 * 60 * 60);
    return hoursPassed >= 24;
  };

  return (
    <RDNContext.Provider value={{ ...store, isMoodExpired }}>
      {children}
    </RDNContext.Provider>
  );
};

// Custom hook to use RDN context
export const useRDN = () => {
  const context = useContext(RDNContext);
  if (!context) {
    throw new Error('useRDN must be used within RDNProvider');
  }
  return context;
};
