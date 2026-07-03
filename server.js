// server.js
// Main backend server: handles registration and login requests,
// talks to MySQL, and serves the frontend HTML/CSS/JS files.

const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const path = require("path");

const app = express();
const PORT = 3000;

// ---- Middleware ----
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public"))); // serves register.html, login.html, style.css

// ---- Database connection ----
// Update user/password to match your local MySQL setup
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "your_mysql_password", // <-- change this
  database: "student_portal",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err.message);
    return;
  }
  console.log("Connected to MySQL database.");
});

// ---- Route: Register ----
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    // Check if email already exists
    db.query("SELECT id FROM users WHERE email = ?", [email], async (err, results) => {
      if (err) return res.status(500).json({ message: "Server error." });

      if (results.length > 0) {
        return res.status(409).json({ message: "Email already registered." });
      }

      // Hash the password before storing (never store plain text passwords)
      const hashedPassword = await bcrypt.hash(password, 10);

      db.query(
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
        [name, email, hashedPassword],
        (err) => {
          if (err) return res.status(500).json({ message: "Registration failed." });
          res.status(201).json({ message: "Registration successful. Please log in." });
        }
      );
    });
  } catch (err) {
    res.status(500).json({ message: "Unexpected server error." });
  }
});

// ---- Route: Login ----
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
    if (err) return res.status(500).json({ message: "Server error." });

    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const user = results[0];
    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    res.status(200).json({ message: `Welcome back, ${user.name}!` });
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
