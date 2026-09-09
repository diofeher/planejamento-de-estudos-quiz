import { useState, useEffect, useRef } from "react";
import type { QuizQuestion } from "../../../types/quiz";
import { playCorrect, playWrong, playSelect } from "../../../lib/sounds";
import styles from "./QuestionCard.module.css";

interface QuestionCardProps {
  question: QuizQuestion;
  isRevealed: boolean;
  onReveal: () => void;
  onRate: (knew: boolean) => void;
}

export function QuestionCard({
  question,
  isRevealed,
  onReveal,
  onRate,
}: QuestionCardProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const hasPlayedSound = useRef(false);

  // Reset selection when question changes
  useEffect(() => {
    setSelectedIndex(null);
    hasPlayedSound.current = false;
  }, [question.id]);

  const hasAnswer = question.correctIndex != null && question.correctIndex >= 0;

  const handleOptionClick = (index: number) => {
    if (isRevealed || !hasAnswer) return;
    setSelectedIndex(index);
    playSelect();
    onReveal();

    const correct = index === question.correctIndex;
    if (!hasPlayedSound.current) {
      hasPlayedSound.current = true;
      if (correct) {
        playCorrect();
      } else {
        playWrong();
      }
    }
  };

  const handleNext = () => {
    if (selectedIndex == null) return;
    onRate(selectedIndex === question.correctIndex);
  };

  // Fallback self-rate for questions without answer key
  const handleSelfRate = (knew: boolean) => {
    if (!hasPlayedSound.current) {
      hasPlayedSound.current = true;
      if (knew) playCorrect();
      else playWrong();
    }
    onRate(knew);
  };

  const getOptionClass = (index: number) => {
    if (!isRevealed || !hasAnswer) return styles.option;

    if (index === question.correctIndex) {
      return `${styles.option} ${styles.optionCorrect}`;
    }
    if (index === selectedIndex && index !== question.correctIndex) {
      return `${styles.option} ${styles.optionWrong}`;
    }
    return `${styles.option} ${styles.optionDimmed}`;
  };

  return (
    <div className={styles.card}>
      <p className={styles.topic}>{question.topic}</p>
      <h3 className={styles.prompt}>{question.question}</h3>

      {question.options.length > 0 && (
        <div className={styles.options}>
          {question.options.map((option, index) => (
            <button
              key={index}
              className={getOptionClass(index)}
              onClick={() => handleOptionClick(index)}
              disabled={isRevealed || !hasAnswer}
              type="button"
            >
              <span className={styles.optionLetter}>
                {String.fromCharCode(65 + index)}
              </span>
              <span className={styles.optionLabel}>{option}</span>
              {isRevealed && hasAnswer && index === question.correctIndex && (
                <span className={styles.optionIcon}>✅</span>
              )}
              {isRevealed &&
                hasAnswer &&
                index === selectedIndex &&
                index !== question.correctIndex && (
                  <span className={styles.optionIcon}>❌</span>
                )}
            </button>
          ))}
        </div>
      )}

      {hasAnswer ? (
        /* Multiple-choice mode: show Next button after answering */
        isRevealed && (
          <div className={styles.rateContainer}>
            <p className={styles.ratePrompt}>
              {selectedIndex === question.correctIndex
                ? "🎉 Correto!"
                : `❌ Errado! Resposta: ${String.fromCharCode(65 + question.correctIndex!)}`}
            </p>
            <button
              className={styles.nextButton}
              onClick={handleNext}
              type="button"
            >
              Próxima →
            </button>
          </div>
        )
      ) : (
        /* Flashcard self-rate mode for questions without answer key */
        <>
          {!isRevealed ? (
            <button
              className={styles.revealButton}
              onClick={() => {
                playSelect();
                onReveal();
              }}
              type="button"
            >
              👁 Revelar Resposta
            </button>
          ) : (
            <div className={styles.rateContainer}>
              <p className={styles.ratePrompt}>Você sabia a resposta?</p>
              <div className={styles.rateButtons}>
                <button
                  className={`${styles.rateButton} ${styles.rateNo}`}
                  onClick={() => handleSelfRate(false)}
                  type="button"
                >
                  ❌ Não sabia
                </button>
                <button
                  className={`${styles.rateButton} ${styles.rateYes}`}
                  onClick={() => handleSelfRate(true)}
                  type="button"
                >
                  ✅ Sabia
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
