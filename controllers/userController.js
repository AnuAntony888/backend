const bcrypt = require('bcrypt');
const db = require("../utils/db");

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Name, email, and password are required" });
  }

  if (password.length < 8) {
    return res.status(400).json({ error: "Password must be at least 8 characters long" });
  }

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
    if (err) {
      console.error("Error checking existing email:", err);
      return res.status(500).json({ error: "An error occurred while checking email." });
    }

    if (results.length > 0) {
      return res.status(400).json({ error: "Email already in use" });
    }

    try {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      db.query(
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
        [name, email, hashedPassword],
        (err, results) => {
          if (err) {
            console.error("Error inserting user:", err);
            return res.status(500).send("An error occurred while adding the user.");
          }

          res.json({ id: results.insertId, name, email });
        }
      );
    } catch (error) {
      console.error("Error hashing password:", error);
      res.status(500).send("An error occurred while hashing the password.");
    }
  });
};

exports.getAllUsers = (req, res) => {
  db.query("SELECT name, email, password FROM users", (err, results) => {
    if (err) {
      console.error("Error fetching users:", err);
      return res.status(500).send("An error occurred while fetching users.");
    }

    const users = results.map((user) => {
      try {
        return {
          name: user.name,
          email: user.email,
          password: "Not retrievable", // Passwords should not be sent back in a real-world app
        };
      } catch (error) {
        console.error(`Decryption error for user ${user.email}:`, error);
        return {
          name: user.name,
          email: user.email,
          password: "Error decrypting password",
        };
      }
    });
    res.json(users);
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
    if (err) {
      console.error("Error fetching user:", err);
      return res.status(500).send("An error occurred while fetching user.");
    }

    if (results.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = results[0];
    try {
      const match = await bcrypt.compare(password, user.password);

      if (match) {
        res.json({ message: "Login successful" });
      } else {
        res.status(401).json({ error: "Invalid credentials" });
      }
    } catch (error) {
      console.error("Error comparing passwords:", error);
      res.status(500).send("An error occurred while comparing passwords.");
    }
  });
};
