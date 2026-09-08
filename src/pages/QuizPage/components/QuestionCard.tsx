import { useEffect, useRef } from "react";
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
  const hasPlayedSound = useRef(false);

  useEffect(() => {
    hasPlayedSound.current = false;
  }, [question.id]);

  const handleRate = (knew: boolean) => {
    if (!hasPlayedSound.current) {
      hasPlayedSound.current = true;
      if (knew) {
        playCorrect();
      } else {
        playWrong();
      }
    }
    onRate(knew);
  };

  return (
    <div className={styles.card}>
      <p className={styles.topic}>{question.topic}</p>
      <h3 className={styles.prompt}>{question.question}</h3>

      {question.options.length > 0 && (
        <div className={styles.options}>
          {question.options.map((option, index) => (
            <div key={index} className={styles.option}>
              <span className={styles.optionLetter}>
                {String.fromCharCode(65 + index)}
              </span>
              <span className={styles.optionLabel}>{option}</span>
            </div>
          ))}
        </div>
      )}

      {!isRevealed ? (
        <button
          className={styles.revealButton}
          onClick={() => {
            playSelect();
            onReveal();
          }}
        >
          👁 Revelar Resposta
        </button>
      ) : (
        <div className={styles.rateContainer}>
          <p className={styles.ratePrompt}>Você sabia a resposta?</p>
          <div className={styles.rateButtons}>
            <button
              className={`${styles.rateButton} ${styles.rateNo}`}
              onClick={() => handleRate(false)}
            >
              ❌ Não sabia
            </button>
            <button
              className={`${styles.rateButton} ${styles.rateYes}`}
              onClick={() => handleRate(true)}
            >
              ✅ Sabia
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
