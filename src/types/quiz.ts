export interface QuizQuestion {
  id: string;
  chapter: string;
  topic: string;
  question: string;
  options: string[];
  /** Index of correct option. -1 or undefined = no known answer (flashcard mode). */
  correctIndex?: number;
}

export interface Chapter {
  id: string;
  title: string;
  description: string;
  emoji: string;
  questions: QuizQuestion[];
}

export interface Subject {
  id: string;
  title: string;
  description: string;
  emoji: string;
  chapters: Chapter[];
}

export type ReviewStatus = "idle" | "in-progress" | "finished";

export interface ReviewState {
  status: ReviewStatus;
  questions: QuizQuestion[];
  currentIndex: number;
  isRevealed: boolean;
  score: number;
  total: number;
}

export type ReviewAction =
  | { type: "START"; questions: QuizQuestion[] }
  | { type: "REVEAL" }
  | { type: "RATE"; knew: boolean }
  | { type: "STOP" };
