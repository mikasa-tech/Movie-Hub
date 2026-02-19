import express from "express";
import pg from "pg";
const { Pool } = pg;
import bcrypt from "bcryptjs";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});

// Initialize Database Table
const initDb = async () => {
    try {
        await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        userid VARCHAR(255) UNIQUE,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NOT NULL
      );
    `);
        await pool.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='userid') THEN
          ALTER TABLE users ADD COLUMN userid VARCHAR(255) UNIQUE;
        END IF;
      END $$;
    `);
        console.log("Database initialized");
    } catch (err) {
        console.error("Error initializing database:", err);
    }
};
initDb();

// Register Endpoint
app.post("/api/register", async (req, res) => {
    const { userid, username, email, password, phone } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            "INSERT INTO users (userid, username, email, password, phone) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [userid, username, email, hashedPassword, phone]
        );
        res.status(201).json({ message: "User registered successfully", user: result.rows[0] });
    } catch (err) {
        console.error("Registration Error Detail:", err);
        if (err.code === '23505') {
            return res.status(400).json({ error: "User ID or Email already exists." });
        }
        res.status(500).json({ error: "Registration failed. Please try again." });
    }
});

// Reset Password Endpoint
app.post("/api/reset-password", async (req, res) => {
    const { email, userid, newPassword } = req.body;
    try {
        const result = await pool.query("SELECT * FROM users WHERE email = $1 AND userid = $2", [email, userid]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "User not found with these details." });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await pool.query("UPDATE users SET password = $1 WHERE email = $2 AND userid = $3", [hashedPassword, email, userid]);

        res.json({ message: "Password reset successful" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error during password reset" });
    }
});

// Login Endpoint
app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (result.rows.length === 0) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            res.json({ message: "Login successful", user: { username: user.username, email: user.email } });
        } else {
            res.status(401).json({ error: "Invalid email or password" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

export default app;
