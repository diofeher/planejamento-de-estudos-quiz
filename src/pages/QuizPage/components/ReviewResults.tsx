import { useEffect } from "react";
import { playComplete } from "../../../lib/sounds";
import styles from "./ReviewResults.module.css";

interface SRStats {
  total: number;
  due: number;
  mastered: number;
  learning: number;
}

interface ReviewResultsProps {
  score: number;
  total: number;
  srStats: SRStats;
  onReviewAgain: () => void;
  onStop: () => void;
}

function getEmoji(percentage: number): string {
  if (percentage === 100) return "🏆";
  if (percentage >= 70) return "🎉";
  if (percentage >= 40) return "📚";
  return "💪";
}

function getMessage(percentage: number): string {
  if (percentage === 100) return "Perfeito!";
  if (percentage >= 70) return "Muito bem!";
  if (percentage >= 40) return "Continue estudando!";
  return "Não desista!";
}

export function ReviewResults({
  score,
  total,
  srStats,
  onReviewAgain,
  onStop,
}: ReviewResultsProps) {
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

  useEffect(() => {
    playComplete();
  }, []);

  return (
    <div className={styles.container}>
      <span className={styles.emoji}>{getEmoji(percentage)}</span>
      <h2 className={styles.message}>{getMessage(percentage)}</h2>

      <div className={styles.scoreCard}>
        <span className={styles.scoreValue}>
          ✅ {score} / ❌ {total - score}
        </span>
        <span className={styles.percentage}>{percentage}% sabia</span>
      </div>

      <div className={styles.srGrid}>
        <div className={styles.stat}>
          <span className={styles.statValue}>{srStats.due}</span>
          <span className={styles.statLabel}>Pendentes</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{srStats.learning}</span>
          <span className={styles.statLabel}>Aprendendo</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{srStats.mastered}</span>
          <span className={styles.statLabel}>Dominados</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{srStats.total}</span>
          <span className={styles.statLabel}>Total</span>
        </div>
      </div>

      <div className={styles.actions}>
        {srStats.due > 0 && (
          <button className={styles.primaryButton} onClick={onReviewAgain}>
            📅 Revisar Mais
          </button>
        )}
        <button className={styles.secondaryButton} onClick={onStop}>
          ← Voltar
        </button>
      </div>
    </div>
  );
}
