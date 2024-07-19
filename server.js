// const express = require("express");
// const bodyParser = require("body-parser");
// const cors = require("cors");
// const crypto = require("crypto");
// const db = require("./db"); // Ensure this file exists and is correctly set up
// const bcrypt = require('bcrypt');

// const app = express();
// const port = 5000;

// // Use a 32-byte key for AES-256 encryption
// const secretKey = crypto.randomBytes(32); // Securely generate a 32-byte key
// const iv = crypto.randomBytes(16);

// const encrypt = (text) => {
//   const cipher = crypto.createCipheriv("aes-256-ctr", secretKey, iv);
//   const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
//   return {
//     iv: iv.toString("hex"),
//     content: encrypted.toString("hex"),
//   };
// };

// const decrypt = (hash) => {
//   try {
//     if (!hash || !hash.iv || !hash.content) {
//       throw new Error("Invalid hash format");
//     }
//     const iv = Buffer.from(hash.iv, "hex");
//     const decipher = crypto.createDecipheriv("aes-256-ctr", secretKey, iv);
//     const decrypted = Buffer.concat([
//       decipher.update(Buffer.from(hash.content, "hex")),
//       decipher.final(),
//     ]);
//     return decrypted.toString();
//   } catch (error) {
//     console.error("Decryption error:", error);
//     throw new Error("Decryption failed");
//   }
// };

// // CORS configuration
// const corsOptions = {
//   origin: "http://localhost:3000", // Allow only requests from this origin
//   methods: ["GET", "POST"], // Allow only GET and POST methods
//   allowedHeaders: ["Content-Type"], // Allow only Content-Type header
// };

// // Use CORS middleware with options
// app.use(cors(corsOptions));
// app.use(bodyParser.json());

// // Route for root URL
// app.get("/", (req, res) => {
//   res.send("Welcome to the API!");
// });

// // Route to add a new user
// app.post("/api/users/signup", (req, res) => {
//   const { name, email, password } = req.body;

//   // Validate input
//   if (!name || !email || !password) {
//     return res
//       .status(400)
//       .json({ error: "Name, email, and password are required" });
//   }

//   // Check password length
//   if (password.length < 8) {
//     return res
//       .status(400)
//       .json({ error: "Password must be at least 8 characters long" });
//   }
//   // Check if the email already exists
//   db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
//     if (err) {
//       console.error("Error checking existing email:", err);
//       return res.status(500).send("An error occurred while checking email.");
//     }

//     if (results.length > 0) {
//       return res.status(400).json({ error: "Email already in use" });
//     }

//     // Encrypt password
//     const encryptedPassword = encrypt(password);

//     // Insert user into database
//     db.query(
//       "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
//       [name, email, JSON.stringify(encryptedPassword)],
//       (err, results) => {
//         if (err) {
//           console.error("Error inserting user:", err);
//           return res
//             .status(500)
//             .send("An error occurred while adding the user.");
//         }

//         res.json({ id: results.insertId, name, email });
//       }
//     );
//   });
// });

// // Route to get all users
// // Route to get all users
// app.get("/api/users", (req, res) => {
//   db.query("SELECT name, email, password FROM users", (err, results) => {
//     if (err) {
//       console.error("Error fetching users:", err);
//       return res.status(500).send("An error occurred while fetching users.");
//     }
//     // Decrypt passwords before sending response
//     const users = results.map((user) => {
//       try {
//         return {
//           name: user.name,
//           email: user.email,
//           password: decrypt(JSON.parse(user.password)),
//         };
//       } catch (error) {
//         console.error(`Decryption error for user ${user.email}:`, error);
//         return {
//           name: user.name,
//           email: user.email,
//           password: "Error decrypting password",
//         };
//       }
//     });
//     res.json(users);
//   });
// });

// app.listen(port, () => {
//   console.log(`Server running on http://localhost:${port}`);
// });
// const express = require("express");
// const bodyParser = require("body-parser");
// const cors = require("cors");

// const db = require("./db"); // Ensure this file exists and is correctly set up
// const bcrypt = require('bcrypt');
// const app = express();
// const port = 5000;

// // CORS configuration
// const corsOptions = {
//   origin: "http://localhost:3000", // Allow only requests from this origin
//   methods: ["GET", "POST"], // Allow only GET and POST methods
//   allowedHeaders: ["Content-Type"], // Allow only Content-Type header
// };

// // Use CORS middleware with options
// app.use(cors(corsOptions));
// app.use(bodyParser.json());

// // Route for root URL
// app.get("/", (req, res) => {
//   res.send("Welcome to the API!");
// });

// // Route to add a new user
// app.post("/api/users/signup", async (req, res) => {
//   const { name, email, password } = req.body;

//   // Validate input
//   if (!name || !email || !password) {
//     return res
//       .status(400)
//       .json({ error: "Name, email, and password are required" });
//   }

//   // Check password length
//   if (password.length < 8) {
//     return res
//       .status(400)
//       .json({ error: "Password must be at least 8 characters long" });
//   }

//   // Check if the email already exists
//    // Check if the email already exists
//    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
//     if (err) {
//       console.error("Error checking existing email:", err);
//       return res.status(500).json({ error: "An error occurred while checking email." });
//     }

//     if (results.length > 0) {
//       return res.status(400).json({ error: "Email already in use" });
//     }

//     // Hash the password
//     try {
//       const saltRounds = 10;
//       const hashedPassword = await bcrypt.hash(password, saltRounds);

//       // Insert user into database
//       db.query(
//         "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
//         [name, email, hashedPassword],
//         (err, results) => {
//           if (err) {
//             console.error("Error inserting user:", err);
//             return res
//               .status(500)
//               .send("An error occurred while adding the user.");
//           }

//           res.json({ id: results.insertId, name, email });
//         }
//       );
//     } catch (error) {
//       console.error("Error hashing password:", error);
//       res.status(500).send("An error occurred while hashing the password.");
//     }
//   });
// });

// // Route to get all users

// app.get("/api/users", (req, res) => {
//   db.query("SELECT name, email, password FROM users", (err, results) => {
//     if (err) {
//       console.error("Error fetching users:", err);
//       return res.status(500).send("An error occurred while fetching users.");
//     }
//     // Decrypt passwords before sending response
//     const users = results.map((user) => {
//       try {
//         return {
//           name: user.name,
//           email: user.email,
//           password: decrypt(JSON.parse(user.password)),
//         };
//       } catch (error) {
//         console.error(`Decryption error for user ${user.email}:`, error);
//         return {
//           name: user.name,
//           email: user.email,
//           password: "Error decrypting password",
//         };
//       }
//     });
//     res.json(users);
//   });
// });
// app.post("/api/users/login", (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res.status(400).json({ error: "Email and password are required" });
//   }

//   db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
//     if (err) {
//       console.error("Error fetching user:", err);
//       return res.status(500).send("An error occurred while fetching user.");
//     }

//     if (results.length === 0) {
//       return res.status(401).json({ error: "Invalid credentials" });
//     }

//     const user = results[0];
//     try {
//       const match = await bcrypt.compare(password, user.password);

//       if (match) {
//         res.json({ message: "Login successful" });
//       } else {
//         res.status(401).json({ error: "Invalid credentials" });
//       }
//     } catch (error) {
//       console.error("Error comparing passwords:", error);
//       res.status(500).send("An error occurred while comparing passwords.");
//     }
//   });
// });

// app.listen(port, () => {
//   console.log(`Server running on http://localhost:${port}`);
// });
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const corsOptions = require("./config/cors");

const app = express();
const port = 5000;

// Use CORS middleware with options
app.use(cors(corsOptions));
app.use(bodyParser.json());

// Use routes
app.use("/api/users", userRoutes);

// Route for root URL
app.get("/", (req, res) => {
  res.send("Welcome to the API!");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
