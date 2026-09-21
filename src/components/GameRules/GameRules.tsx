import "./GameRules.css";

export default function GameRules() {
  return (
    <div className="rules-container">
      <h3>GAME RULES & SCORING</h3>
      <p style={{ color: "#fff", marginBottom: 15, fontWeight: "bold" }}>
        To achieve a perfect 100 score:
      </p>
      <ul>
        <li>Answer 30 questions correctly.</li>
        <li>Finish in 5 minutes (300s) or less.</li>
      </ul>
      <span className="warning-text red-warn">⚠️ WRONG ANSWER: -3 POINTS</span>
      <span className="warning-text orange-warn">
        ⚠️ TIME OVER 5 MIN: -1 POINT PER 10 SECONDS
      </span>
    </div>
  );
}
