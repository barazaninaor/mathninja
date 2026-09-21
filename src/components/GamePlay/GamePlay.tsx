import { useEffect, useState } from "react";
import "./GamePlay.css";

interface Exercise {
  num1: number;
  num2: number;
}

interface GamePlayProps {
  exercises: Exercise[];
  currentIndex: number;
  userGuess: string;
  setUserGuess: (val: string | ((prev: string) => string)) => void;
  lastFeedback: string;
  checkAnswer: () => void;
  finishGame: () => void;
  onRestart: () => void;
  startTime: number;
}

export default function GamePlay({
  exercises,
  currentIndex,
  userGuess,
  setUserGuess,
  lastFeedback,
  checkAnswer,
  finishGame,
  onRestart,
  startTime,
}: GamePlayProps) {
  const [showTime, setShowTime] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    const updateElapsedTime = () => {
      setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
    };

    updateElapsedTime();
    const timerId = window.setInterval(updateElapsedTime, 1000);
    return () => window.clearInterval(timerId);
  }, [startTime]);
  const typeNum = (val: string | number) => {
    if (val === "del") {
      setUserGuess((prev) => prev.slice(0, -1));
    } else if (val === "clear") {
      setUserGuess("");
    } else {
      setUserGuess((prev) => (prev.length < 6 ? prev + val : prev));
    }
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        if (currentIndex === exercises.length - 1) {
          finishGame();
        } else {
          checkAnswer();
        }
      }
    };
    window.addEventListener("keypress", handleKeyPress);
    return () => window.removeEventListener("keypress", handleKeyPress);
  }, [currentIndex, exercises, finishGame, checkAnswer]);

  return (
    <div id="game-play-screen" style={{ width: "100%" }}>
      <div className="flashcard">
        <div className="question-header">
          <div id="questionCounterTop" className="top-question-num">
            QUESTION {currentIndex + 1}/30
          </div>
          <label className="time-toggle">
            <span className="time-toggle-label">
              <input
                type="checkbox"
                checked={showTime}
                onChange={(event) => setShowTime(event.target.checked)}
              />
              <span>Show timer</span>
            </span>
            <strong className={showTime ? "" : "time-hidden"}>
              {Math.floor(elapsedSeconds / 60)}:
              {String(elapsedSeconds % 60).padStart(2, "0")}
            </strong>
          </label>
        </div>

        <div className="game-screen-area" id="screenArea">
          <h2 id="exerciseDisplay">
            {exercises[currentIndex]?.num1} × {exercises[currentIndex]?.num2}
          </h2>
        </div>

        <input
          type="text"
          id="userGuess"
          inputMode="numeric"
          placeholder="?"
          autoComplete="off"
          value={
            userGuess === "" ? "" : Number(userGuess).toLocaleString("en-US")
          }
          onChange={(e) =>
            setUserGuess(e.target.value.replace(/,/g, "").replace(/\D/g, ""))
          }
        />

        <div id="numpad" className="numpad">
          <button className="num-btn" onClick={() => typeNum(1)}>
            1
          </button>
          <button className="num-btn" onClick={() => typeNum(2)}>
            2
          </button>
          <button className="num-btn" onClick={() => typeNum(3)}>
            3
          </button>
          <button className="num-btn" onClick={() => typeNum(4)}>
            4
          </button>
          <button className="num-btn" onClick={() => typeNum(5)}>
            5
          </button>
          <button className="num-btn" onClick={() => typeNum(6)}>
            6
          </button>
          <button className="num-btn" onClick={() => typeNum(7)}>
            7
          </button>
          <button className="num-btn" onClick={() => typeNum(8)}>
            8
          </button>
          <button className="num-btn" onClick={() => typeNum(9)}>
            9
          </button>
          <button className="num-btn" onClick={() => typeNum("clear")}>
            C
          </button>
          <button className="num-btn" onClick={() => typeNum(0)}>
            0
          </button>
          <button className="num-btn" onClick={() => typeNum("del")}>
            ⌫
          </button>
        </div>

        {currentIndex === exercises.length - 1 ? (
          <button
            className="action-btn finish-btn"
            id="finishBtn"
            onClick={() => finishGame()}
          >
            SHOW MY SCORE
          </button>
        ) : (
          <button
            className="action-btn next-btn"
            id="nextBtn"
            onClick={checkAnswer}
          >
            NEXT
          </button>
        )}
      </div>

      <div
        id="feedbackArea"
        className="feedback-msg"
        dangerouslySetInnerHTML={{ __html: lastFeedback }}
      />

      <div className="bottom-controls">
        <button className="secondary-btn" onClick={onRestart}>
          RESTART
        </button>
      </div>
    </div>
  );
}
