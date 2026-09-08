import styles from "./ProgressBar.module.css";

interface ProgressBarProps {
  current: number;
  total: number;
  score: number;
  onQuit: () => void;
}

export function ProgressBar({ current, total, score, onQuit }: ProgressBarProps) {
  const percentage = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className={styles.container}>
      <div className={styles.info}>
        <span className={styles.progress}>
          {current + 1}/{total}
        </span>
        <span className={styles.score}>Pontos: {score}</span>
        <button className={styles.quit} onClick={onQuit}>
          ✕ Sair
        </button>
      </div>
      <div className={styles.track}>
        <div
          className={styles.fill}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
