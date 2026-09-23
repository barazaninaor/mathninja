import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Game.css";
import GameRules from "../../components/GameRules/GameRules";
import GameLevels from "../../components/GameLevels/GameLevels";
import GamePlay from "../../components/GamePlay/GamePlay";
import GameEndScreen from "../../components/GameEndScreen/GameEndScreen";
import AuthModal from "../../components/AuthModal/AuthModal";
import { saveScore } from "../../apiService";

interface Exercise {
  num1: number;
  num2: number;
}

type LevelName = "Easy" | "Medium" | "Hard" | "Insane";

const levelValues: Record<LevelName, number> = {
  Easy: 10,
  Medium: 20,
  Hard: 50,
  Insane: 100,
};

// Helper function to retrieve the saved level from localStorage or default to "Easy"
function getSavedLevel(): { name: LevelName; value: number } {
  const savedLevel = localStorage.getItem("selectedLevel") as LevelName | null;
  const name = savedLevel && savedLevel in levelValues ? savedLevel : "Easy";
  return { name, value: levelValues[name] };
}

export default function Game() {
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Check for authentication token on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setShowAuthModal(true);
    }
  }, []);

  const savedLevel = getSavedLevel();
  const [gameState, setGameState] = useState<"start" | "playing" | "end">(
    "start",
  );
  const [currentLevelValue, setCurrentLevelValue] = useState<number>(
    savedLevel.value,
  );
  const [currentLevelName, setCurrentLevelName] = useState<LevelName>(
    savedLevel.name,
  );

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [baseScore, setBaseScore] = useState(100);
  const [startTime, setStartTime] = useState(0);
  const [userGuess, setUserGuess] = useState("");
  const [lastFeedback, setLastFeedback] = useState("");
  const [finalStats, setFinalStats] = useState({
    correctAnswers: 0,
    successRate: "0.00",
    durationStr: "0:00",
    finalScore: 0,
  });

  // Handle difficulty level selection
  const selectLevel = (value: number, name: LevelName) => {
    setCurrentLevelValue(value);
    setCurrentLevelName(name);
    localStorage.setItem("selectedLevel", name);
  };

  // Initialize and start the game session
  const startGame = () => {
    const newExercises: Exercise[] = [];
    for (let i = 0; i < 30; i++) {
      newExercises.push({
        num1: Math.floor(Math.random() * currentLevelValue) + 1,
        num2: Math.floor(Math.random() * currentLevelValue) + 1,
      });
    }
    setExercises(newExercises);
    setCurrentIndex(0);
    setCorrectAnswers(0);
    setBaseScore(100);
    setUserGuess("");
    setLastFeedback("");
    setStartTime(Date.now());
    setGameState("playing");

    // Automatically scroll to the top of the page when starting the game (fixes mobile scroll view issue)
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Finish the game session and trigger end-game calculations
  const finishGame = (
    finalCorrect = correctAnswers,
    currentBaseScore = baseScore,
  ) => {
    const totalSeconds = Math.floor((Date.now() - startTime) / 1000);
    handleGameEnd(finalCorrect, totalSeconds, currentBaseScore);
  };

  // Validate user answer and progress through exercises
  const checkAnswer = () => {
    const answer = Number(userGuess);
    if (!Number.isInteger(answer) || !exercises[currentIndex]) return;

    const exercise = exercises[currentIndex];
    const correctAnswer = exercise.num1 * exercise.num2;
    const isCorrect = answer === correctAnswer;
    const nextCorrectAnswers = isCorrect ? correctAnswers + 1 : correctAnswers;
    const nextBaseScore = isCorrect ? baseScore : baseScore - 3;

    setCorrectAnswers(nextCorrectAnswers);
    setBaseScore(nextBaseScore);
    setLastFeedback(
      isCorrect
        ? "Correct!"
        : `Wrong! Answer: ${correctAnswer.toLocaleString("en-US")}`,
    );

    if (currentIndex === exercises.length - 1) {
      finishGame(nextCorrectAnswers, nextBaseScore);
      return;
    }

    setCurrentIndex((index) => index + 1);
    setUserGuess("");
  };

  // Handle game completion, calculate final stats, and persist score via API
  const handleGameEnd = async (
    finalCorrect: number,
    totalSeconds: number,
    currentBaseScore: number,
  ) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const durationStr = `${minutes}:${seconds.toString().padStart(2, "0")}`;

    const successRate = ((finalCorrect / 30) * 100).toFixed(2);
    const timePenalty = Math.max(0, (totalSeconds - 300) / 10);
    const finalScore = Math.round(Math.max(0, currentBaseScore - timePenalty));

    setFinalStats({
      correctAnswers: finalCorrect,
      successRate,
      durationStr,
      finalScore,
    });

    setGameState("end");

    // Send score to backend server using the API service after a short delay
    setTimeout(async () => {
      const levelMap: Record<LevelName, number> = {
        Easy: 1,
        Medium: 2,
        Hard: 3,
        Insane: 4,
      };
      const levelId = levelMap[currentLevelName] || 4;
      const token = localStorage.getItem("token");

      if (!token) {
        setShowAuthModal(true);
        return;
      }

      try {
        await saveScore(finalCorrect, totalSeconds, levelId);
        console.log("Score saved successfully!");
      } catch (error) {
        console.error("Error saving score:", error);
      }
    }, 100);
  };

  return (
    <>
      <div className="container game-main-container">
        {/* Start Screen */}
        {gameState === "start" && (
          <div id="start-screen">
            <GameRules />
            <p
              style={{
                marginBottom: 20,
                color: "#b3b3b3",
                textAlign: "center",
              }}
            >
              SELECT DIFFICULTY
            </p>
            <GameLevels
              currentLevelValue={currentLevelValue}
              onSelectLevel={selectLevel}
            />
            <div className="ready-controls">
              <button
                className="action-btn ready-btn"
                data-label="I'M READY!"
                onClick={startGame}
              >
                I'M READY!
              </button>
            </div>
          </div>
        )}

        {/* Active Gameplay Screen */}
        {gameState === "playing" && (
          <GamePlay
            exercises={exercises}
            currentIndex={currentIndex}
            userGuess={userGuess}
            setUserGuess={setUserGuess}
            lastFeedback={lastFeedback}
            checkAnswer={checkAnswer}
            finishGame={finishGame}
            onRestart={() => setGameState("start")}
            startTime={startTime}
          />
        )}

        {/* End Game Stats Screen */}
        {gameState === "end" && (
          <GameEndScreen
            finalStats={finalStats}
            onViewStats={() => navigate("/scores")}
            onRestart={() => setGameState("start")}
          />
        )}
      </div>

      {/* Authentication Modal popup */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => {
          setShowAuthModal(false);
          navigate("/");
        }}
      />
    </>
  );
}
