import type { AppRoute } from "../../routes/useRoute";
import { useSpacedRepetitionContext } from "../../context/SpacedRepetitionContext";
import { ScreenBezel } from "../../components/layout/ScreenBezel";
import styles from "./HomePage.module.css";

interface HomePageProps {
  onNavigate: (route: AppRoute) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const sr = useSpacedRepetitionContext();

  return (
    <ScreenBezel>
      <div className={styles.container}>
        <span className={styles.emoji}>📚</span>
        <h2 className={styles.heading}>Planejamento de Estudos</h2>
        <p className={styles.subtitle}>
          Revisão espaçada para memorizar a longo prazo
        </p>

        <div className={styles.grid}>
          <button
            className={styles.card}
            onClick={() => onNavigate("/quiz")}
          >
            <span className={styles.cardEmoji}>📅</span>
            <span className={styles.cardTitle}>Estudar</span>
            <span className={styles.cardDesc}>
              Revise cartões pendentes usando repetição espaçada (SM-2)
            </span>
            <div className={styles.cardStats}>
              <span>📬 {sr.stats.due} pendentes</span>
              <span>📖 {sr.stats.learning} aprendendo</span>
              <span>✅ {sr.stats.mastered} dominados</span>
            </div>
          </button>
        </div>

        <button
          className={styles.dashboardLink}
          onClick={() => onNavigate("/dashboard")}
        >
          📊 Ver Dashboard
        </button>
      </div>
    </ScreenBezel>
  );
}
