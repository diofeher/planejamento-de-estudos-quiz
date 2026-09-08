/** SM-2 spaced repetition algorithm */

export interface CardState {
  questionId: string;
  easeFactor: number;
  interval: number; // days
  repetitions: number;
  nextReview: string; // ISO date (YYYY-MM-DD)
  lastReview: string | null;
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function addDays(isoDate: string, days: number): string {
  const d = new Date(isoDate);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

/** Create a fresh card due immediately */
export function getNewCardState(questionId: string): CardState {
  return {
    questionId,
    easeFactor: 2.5,
    interval: 0,
    repetitions: 0,
    nextReview: todayISO(),
    lastReview: null,
  };
}

/**
 * SM-2 algorithm: calculate next review based on answer quality.
 * @param quality 0–5 scale (0-2 = fail, 3-5 = pass)
 */
export function calculateNextReview(
  card: CardState,
  quality: number,
): CardState {
  const q = Math.max(0, Math.min(5, Math.round(quality)));
  const today = todayISO();

  let { easeFactor, interval, repetitions } = card;

  // Adjust ease factor
  easeFactor = easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  if (easeFactor < 1.3) easeFactor = 1.3;

  if (q >= 3) {
    // Correct answer
    repetitions += 1;
    if (repetitions === 1) {
      interval = 1;
    } else if (repetitions === 2) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
  } else {
    // Incorrect — reset
    repetitions = 0;
    interval = 1;
  }

  return {
    questionId: card.questionId,
    easeFactor,
    interval,
    repetitions,
    nextReview: addDays(today, interval),
    lastReview: today,
  };
}

/** Check if a card is due for review (nextReview <= today) */
export function isDue(card: CardState): boolean {
  return card.nextReview <= todayISO();
}

/**
 * Auto-calculate quality from answer correctness and response time.
 * Wrong → 1, Correct+slow(>15s) → 3, Correct+medium(5-15s) → 4, Correct+fast(<5s) → 5
 */
export function qualityFromAnswer(correct: boolean, timeMs: number): number {
  if (!correct) return 1;
  if (timeMs > 15_000) return 3;
  if (timeMs > 5_000) return 4;
  return 5;
}
