import { useStatsContext } from "../../context/StatsContext";
import { useSpacedRepetitionContext } from "../../context/SpacedRepetitionContext";
import { ScreenBezel } from "../../components/layout/ScreenBezel";
import type { AppRoute } from "../../routes/useRoute";
import styles from "./DashboardPage.module.css";

interface DashboardPageProps {
  onNavigate: (route: AppRoute) => void;
}

export function DashboardPage({ onNavigate }: DashboardPageProps) {
  const { stats, resetStats } = useStatsContext();
  const sr = useSpacedRepetitionContext();

  const totalAnswered = stats.totalKnew + stats.totalDidntKnow;
  const accuracy =
    totalAnswered > 0
      ? Math.round((stats.totalKnew / totalAnswered) * 100)
      : 0;

  const bestOverallStreak = Math.max(
    ...Object.values(stats.chapters).map((c) => c.bestStreak),
    0
  );
  const currentOverallStreak = Math.max(
    ...Object.values(stats.chapters).map((c) => c.currentStreak),
    0
  );

  const hasData = stats.totalGames > 0;

  return (
    <ScreenBezel>
      <div className={styles.container}>
        <h2 className={styles.heading}>📊 Dashboard</h2>

        {/* SR Progress — always show */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Progresso da Revisão</h3>
          <div className={styles.srGrid}>
            <div className={`${styles.srCard} ${styles.srDue}`}>
              <span className={styles.srValue}>📬 {sr.stats.due}</span>
              <span className={styles.srLabel}>Pendentes</span>
            </div>
            <div className={styles.srCard}>
              <span className={styles.srValue}>📖 {sr.stats.learning}</span>
              <span className={styles.srLabel}>Aprendendo</span>
            </div>
            <div className={styles.srCard}>
              <span className={styles.srValue}>✅ {sr.stats.mastered}</span>
              <span className={styles.srLabel}>Dominados</span>
            </div>
            <div className={styles.srCard}>
              <span className={styles.srValue}>📚 {sr.stats.total}</span>
              <span className={styles.srLabel}>Total</span>
            </div>
          </div>
          {sr.stats.total > 0 && (
            <div className={styles.progressBarContainer}>
              <div className={styles.progressTrack}>
                {sr.stats.mastered > 0 && (
                  <div
                    className={styles.progressMastered}
                    style={{
                      width: `${(sr.stats.mastered / sr.stats.total) * 100}%`,
                    }}
                  />
                )}
                {sr.stats.learning > 0 && (
                  <div
                    className={styles.progressLearning}
                    style={{
                      width: `${(sr.stats.learning / sr.stats.total) * 100}%`,
                    }}
                  />
                )}
              </div>
              <div className={styles.progressLegend}>
                <span className={styles.legendMastered}>
                  ✅ {Math.round((sr.stats.mastered / sr.stats.total) * 100)}% dominado
                </span>
                <span className={styles.legendLearning}>
                  📖 {Math.round((sr.stats.learning / sr.stats.total) * 100)}% aprendendo
                </span>
              </div>
            </div>
          )}
        </div>

        {!hasData ? (
          <div className={styles.empty}>
            <span className={styles.emptyEmoji}>🎮</span>
            <p className={styles.emptyText}>
              Nenhuma sessão completada ainda!
            </p>
            <button
              className={styles.playButton}
              onClick={() => onNavigate("/quiz")}
            >
              Começar Revisão →
            </button>
          </div>
        ) : (
          <>
            {/* Session stats */}
            <div className={styles.overviewGrid}>
              <div className={styles.overviewCard}>
                <span className={styles.overviewValue}>{stats.totalGames}</span>
                <span className={styles.overviewLabel}>Sessões</span>
              </div>
              <div className={styles.overviewCard}>
                <span className={styles.overviewValue}>{accuracy}%</span>
                <span className={styles.overviewLabel}>Sabia</span>
              </div>
              <div className={`${styles.overviewCard} ${styles.streakCard}`}>
                <span className={styles.overviewValue}>
                  🔥 {currentOverallStreak}
                </span>
                <span className={styles.overviewLabel}>Sequência</span>
              </div>
              <div className={styles.overviewCard}>
                <span className={styles.overviewValue}>
                  ⭐ {bestOverallStreak}
                </span>
                <span className={styles.overviewLabel}>Recorde</span>
              </div>
            </div>

            {/* Knew / Didn't know bar */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Respostas</h3>
              <div className={styles.barContainer}>
                <div className={styles.barTrack}>
                  {stats.totalKnew > 0 && (
                    <div
                      className={styles.barCorrect}
                      style={{
                        width: `${(stats.totalKnew / totalAnswered) * 100}%`,
                      }}
                    />
                  )}
                  {stats.totalDidntKnow > 0 && (
                    <div
                      className={styles.barWrong}
                      style={{
                        width: `${(stats.totalDidntKnow / totalAnswered) * 100}%`,
                      }}
                    />
                  )}
                </div>
                <div className={styles.barLegend}>
                  <span className={styles.legendCorrect}>
                    ✅ {stats.totalKnew} sabia
                  </span>
                  <span className={styles.legendWrong}>
                    ❌ {stats.totalDidntKnow} não sabia
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className={styles.actions}>
              <button
                className={styles.playButton}
                onClick={() => onNavigate("/quiz")}
              >
                📅 Estudar
              </button>
              <button
                className={styles.resetButton}
                onClick={() => {
                  if (window.confirm("Tem certeza que deseja resetar todas as estatísticas e progresso de revisão?")) {
                    resetStats();
                    sr.resetCards();
                  }
                }}
              >
                🗑 Resetar Tudo
              </button>
            </div>
          </>
        )}
      </div>
    </ScreenBezel>
  );
}
