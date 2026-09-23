const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const MyRepository = require("./myRepository");
const authenticateToken = require("./authMiddleware");
const { connectDB } = require("./db");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware setup
app.use(cors()); // Enable CORS for frontend communication
app.use(express.json()); // Parse incoming JSON requests

// SIGNUP ROUTE: Register a new user and return a JWT token
app.post("/signUp", async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await MyRepository.spAddNewUser(fullName, email, hashedPassword);

    const newUser = await MyRepository.spGetUserByEmail(email);
    const token = jwt.sign(
      { id: newUser.id, email: email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: { fullName, email },
    });
  } catch (error) {
    console.error("Signup error details:", error);
    // Handle duplicate email error in PostgreSQL (Unique violation code: 23505)
    if (error.code === "23505") {
      return res.status(400).json({ message: "Email already exists" });
    }
    res.status(500).json({ message: "Error registering user" });
  }
});

// SIGNIN ROUTE: Authenticate user credentials and return a JWT token
app.post("/signIn", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await MyRepository.spGetUserByEmail(email);
    const dbPassword = user ? user.password : null;

    if (!user || !dbPassword || !(await bcrypt.compare(password, dbPassword))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    res.json({
      token,
      user: {
        fullName: user.full_name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({ message: "Error signing in" });
  }
});

// UPDATE PROFILE ROUTE (Protected)
app.put("/updateProfile", authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { fullName, password } = req.body;
  try {
    const user = await MyRepository.spGetUserByEmail(req.user.email);
    let passwordToSave = user.password;

    if (password && password.trim() !== "") {
      passwordToSave = await bcrypt.hash(password, 10);
    }

    await MyRepository.spUpdateUser(userId, fullName, passwordToSave);
    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Failed to update profile" });
  }
});

// DELETE ACCOUNT ROUTE (Protected)
app.delete("/deleteAccount", authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { password } = req.body;
  try {
    const user = await MyRepository.spGetUserByEmail(req.user.email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Incorrect password." });
    }
    await MyRepository.spDeleteUser(userId);
    res.json({ message: "Account deleted successfully" });
  } catch (err) {
    console.error("Deletion error:", err);
    res.status(500).json({ message: "Server Error during deletion" });
  }
});

// GET SCORES ROUTE (Protected)
app.get("/api/scores", authenticateToken, async (req, res) => {
  try {
    const scores = await MyRepository.spGetPlayerScores(
      req.user.id,
      req.query.levelId,
      req.query.startDate,
      req.query.endDate,
    );
    res.json(scores);
  } catch (err) {
    console.error("Error fetching scores:", err);
    res.status(500).json({ message: "Error fetching scores" });
  }
});

// SAVE SCORE ROUTE (Protected)
app.post("/api/saveScore", authenticateToken, async (req, res) => {
  try {
    const { correctAnswers, durationSeconds, levelId } = req.body;
    await MyRepository.spSaveGameResult(
      req.user.id,
      correctAnswers,
      durationSeconds,
      levelId,
    );
    res.status(201).json({ message: "Score saved successfully!" });
  } catch (err) {
    console.error("Error saving score:", err);
    res.status(500).json({ message: "Error saving score" });
  }
});

// Connect to database and start the server only upon success
connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to database. Server not started.");
  });
