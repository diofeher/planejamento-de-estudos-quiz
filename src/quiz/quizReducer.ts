import type { ReviewState, ReviewAction } from "../types/quiz";

export const initialReviewState: ReviewState = {
  status: "idle",
  questions: [],
  currentIndex: 0,
  isRevealed: false,
  score: 0,
  total: 0,
};

export function reviewReducer(state: ReviewState, action: ReviewAction): ReviewState {
  switch (action.type) {
    case "START":
      return {
        status: "in-progress",
        questions: action.questions,
        currentIndex: 0,
        isRevealed: false,
        score: 0,
        total: action.questions.length,
      };

    case "REVEAL":
      return { ...state, isRevealed: true };

    case "RATE": {
      const nextIndex = state.currentIndex + 1;
      if (nextIndex >= state.questions.length) {
        return {
          ...state,
          status: "finished",
          score: action.knew ? state.score + 1 : state.score,
        };
      }
      return {
        ...state,
        currentIndex: nextIndex,
        isRevealed: false,
        score: action.knew ? state.score + 1 : state.score,
      };
    }

    case "STOP":
      return initialReviewState;

    default:
      return state;
  }
}
