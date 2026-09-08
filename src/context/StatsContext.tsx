import { createContext, useContext, type ReactNode } from "react";
import { useStats } from "../hooks/useStats";

type StatsContextValue = ReturnType<typeof useStats>;

const StatsContext = createContext<StatsContextValue | null>(null);

export function StatsProvider({ children }: { children: ReactNode }) {
  const value = useStats();
  return (
    <StatsContext.Provider value={value}>{children}</StatsContext.Provider>
  );
}

export function useStatsContext(): StatsContextValue {
  const ctx = useContext(StatsContext);
  if (!ctx) throw new Error("useStatsContext must be used within StatsProvider");
  return ctx;
}
