import { useState } from "react";
import { playSelect } from "../../../lib/sounds";
import { AVAILABLE_SUBJECTS } from "../../../hooks/useSpacedRepetition";
import styles from "./ReviewLanding.module.css";

interface SRStats {
  total: number;
  due: number;
  mastered: number;
  learning: number;
}

interface ReviewLandingProps {
  getStats: (subjectId?: string) => SRStats;
  onStart: (subjectId?: string) => void;
}

export function ReviewLanding({ getStats, onStart }: ReviewLandingProps) {
  const [selectedSubject, setSelectedSubject] = useState<string | undefined>(
    undefined,
  );

  const srStats = getStats(selectedSubject);

  const handleStart = () => {
    playSelect();
    onStart(selectedSubject);
  };

  const noDue = srStats.due === 0;

  return (
    <div className={styles.container}>
      <span className={styles.emoji}>📅</span>
      <h2 className={styles.heading}>Revisão Espaçada</h2>
      <p className={styles.subtitle}>
        Estude com repetição espaçada (SM-2) para memorizar a longo prazo
      </p>

      {/* Subject picker */}
      <div className={styles.subjectPicker}>
        <button
          className={`${styles.subjectTab} ${selectedSubject === undefined ? styles.subjectTabActive : ""}`}
          onClick={() => setSelectedSubject(undefined)}
          type="button"
        >
          📚 Todas
        </button>
        {AVAILABLE_SUBJECTS.map((s) => (
          <button
            key={s.id}
            className={`${styles.subjectTab} ${selectedSubject === s.id ? styles.subjectTabActive : ""}`}
            onClick={() => setSelectedSubject(s.id)}
            type="button"
          >
            {s.emoji} {s.title}
          </button>
        ))}
      </div>

      <div className={styles.statsGrid}>
        <div className={`${styles.stat} ${styles.dueStat}`}>
          <span className={styles.statValue}>📬 {srStats.due}</span>
          <span className={styles.statLabel}>Pendentes</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>📖 {srStats.learning}</span>
          <span className={styles.statLabel}>Aprendendo</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>✅ {srStats.mastered}</span>
          <span className={styles.statLabel}>Dominados</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>📚 {srStats.total}</span>
          <span className={styles.statLabel}>Total</span>
        </div>
      </div>

      {noDue ? (
        <div className={styles.allDone}>
          <span className={styles.allDoneEmoji}>🎉</span>
          <p className={styles.allDoneText}>
            Tudo revisado por hoje! Volte amanhã.
          </p>
        </div>
      ) : (
        <button className={styles.startButton} onClick={handleStart}>
          📅 Estudar ({Math.min(srStats.due, 10)} cartões)
        </button>
      )}
    </div>
  );
}
