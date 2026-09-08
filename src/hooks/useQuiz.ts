import { useReducer, useCallback, useMemo } from "react";
import type { QuizQuestion } from "../types/quiz";
import { reviewReducer, initialReviewState } from "../quiz/quizReducer";

const MAX_CARDS_PER_SESSION = 10;

export function useReview() {
  const [state, dispatch] = useReducer(reviewReducer, initialReviewState);

  const startReview = useCallback((questions: QuizQuestion[]) => {
    const capped = questions.slice(0, MAX_CARDS_PER_SESSION);
    dispatch({ type: "START", questions: capped });
  }, []);

  const reveal = useCallback(() => {
    dispatch({ type: "REVEAL" });
  }, []);

  const rate = useCallback((knew: boolean) => {
    dispatch({ type: "RATE", knew });
  }, []);

  const stop = useCallback(() => {
    dispatch({ type: "STOP" });
  }, []);

  const currentQuestion = useMemo(
    () =>
      state.status === "in-progress"
        ? state.questions[state.currentIndex]
        : null,
    [state.status, state.questions, state.currentIndex],
  );

  return {
    ...state,
    currentQuestion,
    totalQuestions: state.questions.length,
    startReview,
    reveal,
    rate,
    stop,
  };
}
