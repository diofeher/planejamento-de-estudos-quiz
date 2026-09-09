import { useState, useCallback, useMemo } from "react";
import { getItem, setItem } from "../lib/storage";
import {
  type CardState,
  getNewCardState,
  calculateNextReview,
  isDue,
} from "../lib/spacedRepetition";
import { SUBJECTS } from "../data/subjects";

const SR_KEY = "spaced-repetition";

type CardMap = Record<string, CardState>;

function loadCards(): CardMap {
  return getItem<CardMap>(SR_KEY, {});
}

function persistCards(cards: CardMap): void {
  setItem(SR_KEY, cards);
}

/** All known question ids across all subjects/chapters */
const ALL_QUESTION_IDS = SUBJECTS.flatMap((s) =>
  s.chapters.flatMap((ch) => ch.questions.map((q) => q.id)),
);

/** Map of subjectId → question ids */
const SUBJECT_QUESTION_IDS: Record<string, string[]> = {};
for (const s of SUBJECTS) {
  SUBJECT_QUESTION_IDS[s.id] = s.chapters.flatMap((ch) =>
    ch.questions.map((q) => q.id),
  );
}

/** Available subjects for filtering */
export const AVAILABLE_SUBJECTS = SUBJECTS.map((s) => ({
  id: s.id,
  title: s.title,
  emoji: s.emoji,
}));

function getQuestionIds(subjectId?: string): string[] {
  if (!subjectId) return ALL_QUESTION_IDS;
  return SUBJECT_QUESTION_IDS[subjectId] ?? [];
}

export function useSpacedRepetition() {
  const [cards, setCards] = useState<CardMap>(loadCards);

  const recordReview = useCallback(
    (questionId: string, quality: number) => {
      setCards((prev) => {
        const existing = prev[questionId] ?? getNewCardState(questionId);
        const updated = calculateNextReview(existing, quality);
        const next = { ...prev, [questionId]: updated };
        persistCards(next);
        return next;
      });
    },
    [],
  );

  const getDueCards = useCallback(
    (subjectId?: string): CardState[] => {
      const ids = getQuestionIds(subjectId);
      const dueExisting = ids
        .map((id) => cards[id])
        .filter((c): c is CardState => c != null && isDue(c));
      const newCards = ids.filter((id) => !cards[id]).map(getNewCardState);
      return [...dueExisting, ...newCards];
    },
    [cards],
  );

  const getCardState = useCallback(
    (questionId: string): CardState | undefined => cards[questionId],
    [cards],
  );

  const getStats = useCallback(
    (subjectId?: string) => {
      const ids = getQuestionIds(subjectId);
      const total = ids.length;
      let mastered = 0;
      let learning = 0;
      let due = 0;

      for (const id of ids) {
        const card = cards[id];
        if (!card) {
          due += 1;
          continue;
        }
        if (card.interval > 21) {
          mastered += 1;
        } else {
          learning += 1;
        }
        if (isDue(card)) {
          due += 1;
        }
      }

      return { total, due, mastered, learning };
    },
    [cards],
  );

  // Global stats (for dashboard backward compat)
  const stats = useMemo(() => getStats(), [getStats]);

  const resetCards = useCallback(() => {
    persistCards({});
    setCards({});
  }, []);

  return {
    cards,
    recordReview,
    getDueCards,
    getCardState,
    stats,
    getStats,
    resetCards,
  };
}
