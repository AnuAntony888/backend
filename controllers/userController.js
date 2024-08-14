const bcrypt = require("bcrypt");
const db = require("../utils/db");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");

const JWT_SECRET =
  process.env.JWT_SECRET ||
  "e08e19dd47b1ccb6fc50f1edbe10d4a8f5ad19f71fced245553341f2dd432f7e";
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || "360d";

let tokenBlacklist = []; // In-memory blacklist, use a persistent store in production

// exports.signup = async (req, res) => {
//   const {
//     name,
//     email,
//     password,
//     employeeno,
//     employeecategory,
//     employeestatus,
//     visibility = 1
//   } = req.body;

//   if (!name || !email || !password) {
//     return res
//       .status(400)
//       .json({ error: "Name, email, and password are required" });
//   }

//   if (password.length < 8) {
//     return res
//       .status(400)
//       .json({ error: "Password must be at least 8 characters long" });
//   }

//   db.query(
//     "SELECT * FROM users WHERE email = ? ",
//     [email],
//     async (err, results) => {
//       if (err) {
//         console.error("Error checking existing email:", err);
//         return res
//           .status(500)
//           .json({ error: "An error occurred while checking email." });
//       }

//       if (results.length > 0) {
//         return res.status(400).json({ error: "Email already in use" });
//       }

//       try {
//         const saltRounds = 10;
//         const hashedPassword = await bcrypt.hash(password, saltRounds);
//         const user_id = uuidv4();
//         db.query(
//           "INSERT INTO users (user_id,name, email, password,employeeno,employeecategory,employeestatus) VALUES(?,?,?,?, ?, ?,?)",
//           [
//             user_id,
//             name,
//             email,
//             hashedPassword,
//             employeeno,
//             employeecategory,
//             employeestatus,
//           ],
//           (err, results) => {
//             if (err) {
//               console.error("Error inserting user:", err);
//               return res
//                 .status(500)
//                 .send("An error occurred while adding the user.");
//             }

//             res.json({
//               user_id: results.insertId,
//               name,
//               email,
//               employeeno,
//               employeecategory,
//               employeestatus,
//             });
//           }
//         );
//       } catch (error) {
//         console.error("Error hashing password:", error);
//         res.status(500).send("An error occurred while hashing the password.");
//       }
//     }
//   );
// };
exports.signup = async (req, res) => {
  const {
    name,
    email,
    password,
    employeeno,
    employeecategory,
    employeestatus,
    visibility = 1 // Default visibility to 1
  } = req.body;

  // Validate required fields
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ error: "Name, email, and password are required" });
  }

  if (password.length < 8) {
    return res
      .status(400)
      .json({ error: "Password must be at least 8 characters long" });
  }

  // Check if email already exists
  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) {
        console.error("Error checking existing email:", err);
        return res
          .status(500)
          .json({ error: "An error occurred while checking email." });
      }

      if (results.length > 0) {
        // Email exists, update the record
        const user = results[0];

        // If the visibility is different or other details are to be updated
        if (visibility !== user.visibility) {
          const updateSql = `
            UPDATE users
            SET
              name = ?,
              password = ?,
              employeeno = ?,
              employeecategory = ?,
              employeestatus = ?,
              visibility = ?
            WHERE email = ?
          `;
          const saltRounds = 10;
          const hashedPassword = await bcrypt.hash(password, saltRounds);

          db.query(
            updateSql,
            [
              name,
              hashedPassword,
              employeeno,
              employeecategory,
              employeestatus,
              visibility,
              email
            ],
            (err, results) => {
              if (err) {
                console.error("Error updating user:", err);
                return res
                  .status(500)
                  .json({ error: "An error occurred while updating the user." });
              }

              res.json({ message: "User details updated successfully" });
            }
          );
        } else {
          // No changes needed if visibility and other details are the same
          res.json({ message: "User already exists with the same details" });
        }
      } else {
        // Email does not exist, create a new user
        try {
          const saltRounds = 10;
          const hashedPassword = await bcrypt.hash(password, saltRounds);
          const user_id = uuidv4();

          db.query(
            "INSERT INTO users (user_id, name, email, password, employeeno, employeecategory, employeestatus, visibility) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [
              user_id,
              name,
              email,
              hashedPassword,
              employeeno,
              employeecategory,
              employeestatus,
              visibility
            ],
            (err, results) => {
              if (err) {
                console.error("Error inserting user:", err);
                return res
                  .status(500)
                  .send("An error occurred while adding the user.");
              }

              res.json({
                user_id,
                name,
                email,
                employeeno,
                employeecategory,
                employeestatus,
                visibility
              });
            }
          );
        } catch (error) {
          console.error("Error hashing password:", error);
          res.status(500).send("An error occurred while hashing the password.");
        }
      }
    }
  );
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

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, results) => {
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
          // Generate a JWT token
          const token = jwt.sign(
            { id: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRATION }
          );

          console.log("Generated token:", token); // Debugging log

          res.json({
            message: "Login successful",
            token: token,
            userId: user.user_id, // Added userId
            email: user.email, // Added email
            name: user.name, // Added name (ensure `name` exists in the database)
          });
        } else {
          res.status(401).json({ error: "Invalid credentials" });
        }
      } catch (error) {
        console.error("Error comparing passwords:", error);
        res.status(500).send("An error occurred while comparing passwords.");
      }
    }
  );
};

exports.logout = (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token) {
    tokenBlacklist.push(token);
    res.json({ message: "Logout successful" });
  } else {
    res.status(400).json({ error: "No token provided" });
  }
};

/***************************update query****************************************/
exports.updateUser = async (req, res) => {
  const {
    email,
    name,
    password,
    employeeno,
    employeecategory,
    employeestatus,

  } = req.body;

  // Validate required fields
  if (!email || !name || !password) {
    return res
      .status(400)
      .json({ error: "Email, name, and password are required" });
  }

  if (password.length < 8) {
    return res
      .status(400)
      .json({ error: "Password must be at least 8 characters long" });
  }

  try {
    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Update user details
    const updateSql = `
      UPDATE users
      SET
        name = ?,
        password = ?,
        employeeno = ?,
        employeecategory = ?,
        employeestatus = ?,
       visibility = 1
      WHERE email = ?
    `;

    db.query(
      updateSql,
      [
        name,
        hashedPassword,
        employeeno,
        employeecategory,
        employeestatus,
       
        email
      ],
      (err, result) => {
        if (err) {
          console.error("Error updating user:", err);
          return res
            .status(500)
            .json({ error: "An error occurred while updating the user." });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({ message: "User details updated successfully" });
      }
    );
  } catch (error) {
    console.error("Error hashing password:", error);
    res.status(500).json({ error: "An error occurred while hashing the password." });
  }
};
/***************************getuserbyid****************************************/
exports.getUserByEmail = (req, res) => {
  const { email } = req.body;

  // Validate email
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const query = `
    SELECT user_id, name, email, employeeno, employeecategory, employeestatus, visibility 
    FROM users 
    WHERE email = ? AND visibility = 1
  `;

  db.query(query, [email], (err, results) => {
    if (err) {
      console.error("Error fetching user details:", err);
      return res.status(500).json({ error: "An error occurred while fetching user details." });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "User not found or not visible" });
    }

    // Return user details
    res.status(200).json(results[0]);
  });
};

exports.isTokenBlacklisted = (token) => {
  return tokenBlacklist.includes(token);
};
