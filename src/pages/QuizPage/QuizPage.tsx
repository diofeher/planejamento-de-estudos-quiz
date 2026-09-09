import { useEffect, useRef, useCallback } from "react";
import { SUBJECTS } from "../../data/subjects";
import { useReview } from "../../hooks/useQuiz";
import { useStatsContext } from "../../context/StatsContext";
import { useSpacedRepetitionContext } from "../../context/SpacedRepetitionContext";
import { shuffle } from "../../lib/arrayUtils";
import { ScreenBezel } from "../../components/layout/ScreenBezel";
import { ReviewLanding } from "./components/ReviewLanding";
import { ProgressBar } from "./components/ProgressBar";
import { QuestionCard } from "./components/QuestionCard";
import { ReviewResults } from "./components/ReviewResults";
import styles from "./QuizPage.module.css";

const allQuestions = SUBJECTS.flatMap((s) =>
  s.chapters.flatMap((ch) => ch.questions),
);

/** Map subjectId → set of question ids */
const SUBJECT_QUESTION_IDS: Record<string, Set<string>> = {};
for (const s of SUBJECTS) {
  SUBJECT_QUESTION_IDS[s.id] = new Set(
    s.chapters.flatMap((ch) => ch.questions.map((q) => q.id)),
  );
}

export function QuizPage() {
  const review = useReview();
  const { recordResult } = useStatsContext();
  const sr = useSpacedRepetitionContext();
  const hasRecorded = useRef(false);

  // Record stats when session finishes
  useEffect(() => {
    if (review.status === "finished" && !hasRecorded.current) {
      hasRecorded.current = true;
      recordResult("__review__", review.score, review.total, 0);
    }
    if (review.status !== "finished") {
      hasRecorded.current = false;
    }
  }, [review.status, review.score, review.total, recordResult]);

  const handleStartReview = useCallback(
    (subjectId?: string) => {
      const dueCards = sr.getDueCards(subjectId);
      if (dueCards.length === 0) return;
      const dueQuestionIds = new Set(dueCards.map((c) => c.questionId));

      const pool = subjectId
        ? allQuestions.filter(
            (q) =>
              dueQuestionIds.has(q.id) &&
              SUBJECT_QUESTION_IDS[subjectId]?.has(q.id),
          )
        : allQuestions.filter((q) => dueQuestionIds.has(q.id));

      const shuffled = shuffle(pool);
      review.startReview(shuffled);
    },
    [sr, review],
  );

  const handleRate = useCallback(
    (knew: boolean) => {
      const q = review.currentQuestion;
      if (q) {
        // SM-2: knew = quality 4, didn't know = quality 1
        sr.recordReview(q.id, knew ? 4 : 1);
      }
      review.rate(knew);
    },
    [review, sr],
  );

  return (
    <ScreenBezel>
      {review.status === "idle" && (
        <ReviewLanding
          getStats={sr.getStats}
          onStart={handleStartReview}
        />
      )}

      {review.status === "in-progress" && review.currentQuestion && (
        <div className={styles.quizArea}>
          <ProgressBar
            current={review.currentIndex}
            total={review.totalQuestions}
            score={review.score}
            onQuit={review.stop}
          />
          <QuestionCard
            question={review.currentQuestion}
            isRevealed={review.isRevealed}
            onReveal={review.reveal}
            onRate={handleRate}
          />
        </div>
      )}

      {review.status === "finished" && (
        <ReviewResults
          score={review.score}
          total={review.total}
          srStats={sr.stats}
          onReviewAgain={() => handleStartReview()}
          onStop={review.stop}
        />
      )}
    </ScreenBezel>
  );
}
