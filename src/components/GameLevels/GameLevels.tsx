import "./GameLevels.css";

type LevelName = "Easy" | "Medium" | "Hard" | "Insane";

interface GameLevelsProps {
  currentLevelValue: number;
  onSelectLevel: (value: number, name: LevelName) => void;
}

export default function GameLevels({
  currentLevelValue,
  onSelectLevel,
}: GameLevelsProps) {
  return (
    <div className="difficulty-options">
      <button
        className={`diff-btn ${currentLevelValue === 10 ? "selected" : ""}`}
        onClick={() => onSelectLevel(10, "Easy")}
      >
        EASY (1-10)
      </button>
      <button
        className={`diff-btn ${currentLevelValue === 20 ? "selected" : ""}`}
        onClick={() => onSelectLevel(20, "Medium")}
      >
        MEDIUM (1-20)
      </button>
      <button
        className={`diff-btn ${currentLevelValue === 50 ? "selected" : ""}`}
        onClick={() => onSelectLevel(50, "Hard")}
      >
        HARD (1-50)
      </button>
      <button
        className={`diff-btn ${currentLevelValue === 100 ? "selected" : ""}`}
        onClick={() => onSelectLevel(100, "Insane")}
      >
        INSANE (1-100)
      </button>
    </div>
  );
}
