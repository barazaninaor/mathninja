import "./GameEndScreen.css";

interface FinalStats {
  correctAnswers: number;
  successRate: string;
  durationStr: string;
  finalScore: number;
}

interface GameEndScreenProps {
  finalStats: FinalStats;
  onViewStats: () => void;
  onRestart: () => void;
}

export default function GameEndScreen({
  finalStats,
  onViewStats,
  onRestart,
}: GameEndScreenProps) {
  return (
    <div id="end-screen" className="game-end-wrapper">
      <div className="game-end-card">
        <h2 className="game-end-title">GAME OVER</h2>

        <div className="game-stats-box">
          <p className="stat-row">
            CORRECT ANSWERS:{" "}
            <span className="stat-value">{finalStats.correctAnswers}/30</span>
          </p>
          <p className="stat-row">
            SUCCESS RATE:{" "}
            <span className="stat-value">{finalStats.successRate}%</span>
          </p>
          <p className="stat-row">
            DURATION:{" "}
            <span className="stat-value">{finalStats.durationStr}</span>
          </p>
        </div>

        <div className="score-display-box">
          <h3 className="score-display-title">
            SCORE: {finalStats.finalScore}
          </h3>
        </div>

        <div className="game-end-actions">
          <button
            className="action-btn view-scores-btn"
            data-label="VIEW SCORES TABLE"
            onClick={onViewStats}
          >
            VIEW SCORES TABLE
          </button>
        </div>
      </div>

      {/* משйתמש בדיוק באותה מחלקה של כפתור ה-I'M READY למטה */}
      <div className="ready-controls">
        <button
          className="action-btn ready-btn"
          data-label="RESTART"
          onClick={onRestart}
        >
          RESTART
        </button>
      </div>
    </div>
  );
}
