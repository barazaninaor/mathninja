const { pool } = require("./db");

// 1. Add a new user to the database (Updated to match clean users schema)
async function spAddNewUser(full_name, email, hashed_password) {
  const sql = `INSERT INTO users (full_name, email, password) VALUES ($1, $2, $3) RETURNING id, full_name, email, join_date`;
  const result = await pool.query(sql, [full_name, email, hashed_password]);
  return result.rows[0];
}

// 2. Get user details by email (used for login)
async function spGetUserByEmail(email) {
  const sql = `SELECT * FROM users WHERE email = $1`;
  const result = await pool.query(sql, [email]);
  return result.rows[0] || null;
}

// 3. Update existing user profile
async function spUpdateUser(theid, full_name, password) {
  const sql = `
    UPDATE users 
    SET full_name = $1, 
        password = COALESCE($2, password) 
    WHERE id = $3 
    RETURNING id, full_name, email, join_date;
  `;
  const result = await pool.query(sql, [
    full_name || "",
    password || null,
    theid,
  ]);
  return result.rows[0];
}

// 4. Delete a user account by ID
async function spDeleteUser(theid) {
  const sql = `DELETE FROM users WHERE id = $1 RETURNING id`;
  const result = await pool.query(sql, [theid]);
  return result.rows[0];
}

// 5. Get player scores with formatting (Fixed table name to game_results)
async function spGetPlayerScores(userId, levelId, startDate, endDate) {
  const sql = `
    SELECT * FROM game_results 
    WHERE user_id = $1 
      AND ($2::int IS NULL OR level_id = $2)
      AND ($3::date IS NULL OR played_at >= $3)
      AND ($4::date IS NULL OR played_at <= $4)
    ORDER BY played_at DESC;
  `;
  const result = await pool.query(sql, [
    userId,
    levelId || null,
    startDate || null,
    endDate || null,
  ]);
  const results = result.rows || [];

  // Map raw database rows into formatted objects for the frontend
  return results.map((row) => {
    const correct = row.correct_answers;
    const duration = row.duration_seconds;

    // Convert total seconds into MM:SS format
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    const durationDisplay = `${minutes}:${seconds.toString().padStart(2, "0")}`;

    // Calculate final score based on correct answers and time penalties
    let finalScore = 100 - (30 - correct) * 3;
    if (duration > 300) {
      finalScore -= Math.floor((duration - 300) / 10);
    }

    return {
      DATE: new Date(row.played_at).toLocaleDateString("en-GB"), // Format: DD/MM/YYYY
      DURATION: durationDisplay, // Formatted time string
      SUCCESS_RATE: Math.round((correct / 30) * 100), // Success percentage
      SCORE: Math.max(10, finalScore), // Ensure score doesn't drop below minimum
    };
  });
}

// 6. Save a game result (Fixed table name to game_results)
async function spSaveGameResult(
  userId,
  correctAnswers,
  durationSeconds,
  levelId,
) {
  const sql = `
    INSERT INTO game_results (user_id, correct_answers, duration_seconds, level_id, played_at) 
    VALUES ($1, $2, $3, $4, NOW()) 
    RETURNING id;
  `;
  const result = await pool.query(sql, [
    userId,
    correctAnswers,
    durationSeconds,
    levelId,
  ]);
  return result.rows[0];
}

module.exports = {
  spAddNewUser,
  spUpdateUser,
  spGetUserByEmail,
  spDeleteUser,
  spGetPlayerScores,
  spSaveGameResult,
};
