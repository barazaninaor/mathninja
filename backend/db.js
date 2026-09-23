const { Pool } = require("pg");
require("dotenv").config();

// Create a connection pool to PostgreSQL (Neon) using the connection string from .env
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for secure connections to Neon
  },
});

// Function to test the database connection
async function connectDB() {
  try {
    const client = await pool.connect();
    console.log("Connected to PostgreSQL (Neon) successfully!");
    client.release(); // Release the client back to the pool
    return pool;
  } catch (err) {
    console.error("Critical PostgreSQL Error:", err.message);
    throw err;
  }
}

module.exports = { connectDB, pool };
