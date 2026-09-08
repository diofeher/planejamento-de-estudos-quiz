import { createContext, useContext, type ReactNode } from "react";
import { useSpacedRepetition } from "../hooks/useSpacedRepetition";

type SpacedRepetitionContextValue = ReturnType<typeof useSpacedRepetition>;

const SpacedRepetitionContext =
  createContext<SpacedRepetitionContextValue | null>(null);

export function SpacedRepetitionProvider({
  children,
}: {
  children: ReactNode;
}) {
  const value = useSpacedRepetition();
  return (
    <SpacedRepetitionContext.Provider value={value}>
      {children}
    </SpacedRepetitionContext.Provider>
  );
}

export function useSpacedRepetitionContext(): SpacedRepetitionContextValue {
  const ctx = useContext(SpacedRepetitionContext);
  if (!ctx)
    throw new Error(
      "useSpacedRepetitionContext must be used within SpacedRepetitionProvider",
    );
  return ctx;
}
