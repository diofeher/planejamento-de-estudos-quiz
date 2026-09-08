import { useState, useCallback } from "react";
import type { StatsState, SessionStats } from "../types/stats";
import { DEFAULT_STATS, DEFAULT_SESSION_STATS } from "../types/stats";
import { getItem, setItem } from "../lib/storage";

const STATS_KEY = "stats";

function loadStats(): StatsState {
  return getItem<StatsState>(STATS_KEY, DEFAULT_STATS);
}

function persistStats(stats: StatsState): void {
  setItem(STATS_KEY, stats);
}

export function useStats() {
  const [stats, setStats] = useState<StatsState>(loadStats);

  const recordResult = useCallback(
    (sessionId: string, knew: number, total: number, _skipped: number) => {
      setStats((prev) => {
        const session: SessionStats =
          prev.chapters[sessionId] ?? { ...DEFAULT_SESSION_STATS };
        const percentage = total > 0 ? (knew / total) * 100 : 0;
        const passed = percentage >= 70;

        const didntKnow = total - knew;
        const newStreak = passed ? session.currentStreak + 1 : 0;
        const newBestStreak = Math.max(session.bestStreak, newStreak);
        const newBestScore = Math.max(session.bestScore, knew);

        const updated: StatsState = {
          ...prev,
          totalGames: prev.totalGames + 1,
          totalKnew: prev.totalKnew + knew,
          totalDidntKnow: prev.totalDidntKnow + didntKnow,
          chapters: {
            ...prev.chapters,
            [sessionId]: {
              bestScore: newBestScore,
              gamesPlayed: session.gamesPlayed + 1,
              currentStreak: newStreak,
              bestStreak: newBestStreak,
              totalKnew: session.totalKnew + knew,
              totalDidntKnow: session.totalDidntKnow + didntKnow,
            },
          },
        };

        persistStats(updated);
        return updated;
      });
    },
    [],
  );

  const resetStats = useCallback(() => {
    persistStats(DEFAULT_STATS);
    setStats({ ...DEFAULT_STATS });
  }, []);

  return { stats, recordResult, resetStats };
}
