export interface SessionStats {
  bestScore: number;
  gamesPlayed: number;
  currentStreak: number;
  bestStreak: number;
  totalKnew: number;
  totalDidntKnow: number;
}

export interface StatsState {
  schemaVersion: 1;
  totalGames: number;
  totalKnew: number;
  totalDidntKnow: number;
  chapters: Record<string, SessionStats>;
}

export const DEFAULT_SESSION_STATS: SessionStats = {
  bestScore: 0,
  gamesPlayed: 0,
  currentStreak: 0,
  bestStreak: 0,
  totalKnew: 0,
  totalDidntKnow: 0,
};

export const DEFAULT_STATS: StatsState = {
  schemaVersion: 1,
  totalGames: 0,
  totalKnew: 0,
  totalDidntKnow: 0,
  chapters: {},
};
