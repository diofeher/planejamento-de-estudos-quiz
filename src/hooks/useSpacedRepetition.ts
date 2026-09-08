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

  const getDueCards = useCallback((): CardState[] => {
    // Cards that exist and are due
    const dueExisting = Object.values(cards).filter((c) => isDue(c));

    // Questions never reviewed are also "due" (new cards)
    const newCardIds = ALL_QUESTION_IDS.filter((id) => !cards[id]);
    const newCards = newCardIds.map(getNewCardState);

    return [...dueExisting, ...newCards];
  }, [cards]);

  const getCardState = useCallback(
    (questionId: string): CardState | undefined => cards[questionId],
    [cards],
  );

  const stats = useMemo(() => {
    const total = ALL_QUESTION_IDS.length;
    let mastered = 0;
    let learning = 0;
    let due = 0;

    for (const id of ALL_QUESTION_IDS) {
      const card = cards[id];
      if (!card) {
        // Never seen = due
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
  }, [cards]);

  const resetCards = useCallback(() => {
    persistCards({});
    setCards({});
  }, []);

  return { cards, recordReview, getDueCards, getCardState, stats, resetCards };
}
