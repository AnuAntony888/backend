// const bcrypt = require("bcrypt");
const bcrypt = require('bcryptjs');

const db = require("../utils/db");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");

const JWT_SECRET =
  process.env.JWT_SECRET ||
  "e08e19dd47b1ccb6fc50f1edbe10d4a8f5ad19f71fced245553341f2dd432f7e";
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || "360d";

let tokenBlacklist = []; // In-memory blacklist, use a persistent store in production




exports.signup = async (req, res) => {
  const {
    name,
    email,
    password,
    employeeno,
    employeecategory,
    employeestatus,
    master_id,
    visibility = 1, // Default visibility to 1
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
        // Email exists, check if the details are the same
        const user = results[0];

        if (
          name === user.name &&
          employeeno === user.employeeno &&
          employeecategory === user.employeecategory &&
          employeestatus === user.employeestatus &&
          master_id === user.master_id &&
          visibility === user.visibility
        ) {
          // All details are the same, return an error
          return res.status(400).json({
            error: "User already exists with the same details.",
          });
        } else {
          // Details are different, update the record
          const updateSql = `
            UPDATE users
            SET
              name = ?,
              password = ?,
              employeeno = ?,
              employeecategory = ?,
              employeestatus = ?,
              master_id = ?,
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
              master_id,
              visibility,
              email,
            ],
            (err, results) => {
              if (err) {
                console.error("Error updating user:", err);
                return res.status(500).json({
                  error: "An error occurred while updating the user.",
                });
              }

              res.json({ message: "User details updated successfully" });
            }
          );
        }
      } else {
        // Email does not exist, create a new user
        try {
          const saltRounds = 10;
          const hashedPassword = await bcrypt.hash(password, saltRounds);
          const user_id = uuidv4();

          db.query(
            "INSERT INTO users (user_id, name, email, password, employeeno, employeecategory, employeestatus, master_id, visibility) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
              user_id,
              name,
              email,
              hashedPassword,
              employeeno,
              employeecategory,
              employeestatus,
              master_id,
              visibility,
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
                master_id,
                visibility,
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
{
  /********************************Login*********************************************/
}
exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  db.query(
    "SELECT * FROM users WHERE email = ? AND visibility = 1",
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

          // Get entity name from mastertable

          const sql = "SELECT * FROM masterTabele WHERE master_id = ?";
    
  db.query(sql, [user.master_id], (err, results) => {
    if (err) {
      console.error("Database Error:", err);
      return res.status(500).json({ error: "Failed to retrieve entityName details" });
    }
    console.log("Query Results:", results);
    if (results.length === 0) {
      return res.status(404).json({ error: "master not found" });
    }
    const entityName = results[0];
     
              res.json({
                message: "Login successful",
                token: token,
                userId: user.user_id,
                email: user.email,
                name: user.name,
                employeestatus: user.employeestatus,
                master: entityName,
              });
            }
          );
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
/***************************logout****************************************/
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
  const { email, name, employeeno, employeecategory } = req.body;

  // Validate required fields
  if (!email || !name) {
    return res.status(400).json({ error: "Email & name are required" });
  }

  try {
    // Update user details
    const updateSql = `
      UPDATE users
      SET
        name = ?,

        employeeno = ?,
        employeecategory = ?,
       
       visibility = 1
      WHERE email = ?
    `;

    db.query(
      updateSql,
      [name, employeeno, employeecategory, email],
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
    res
      .status(500)
      .json({ error: "An error occurred while hashing the password." });
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
    FROM users WHERE email = ? AND visibility = 1
  `;
  db.query(query, [email], (err, results) => {
    if (err) {
      console.error("Error fetching user details:", err);
      return res
        .status(500)
        .json({ error: "An error occurred while fetching user details." });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "User not found or not visible" });
    }
    // Return user details
    res.status(200).json(results[0]);
  });
};

/*******************************userDelete******************************************** */

exports.deleteuser = (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "email is required" });
  }

  const sql = "UPDATE users SET visibility = 0 WHERE email = ?";
  db.query(sql, [email], (err, result) => {
    if (err) {
      console.error("Database Error:", err);
      return res
        .status(500)
        .json({ error: "Failed to update supplier visibility" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Supplier not found" });
    }

    res.status(200).json({ message: "Supplier delete successfully" });
  });
};

/**********************token************************************** */
exports.isTokenBlacklisted = (token) => {
  return tokenBlacklist.includes(token);
};
/***************************get all employee details****************************************/

exports.getAllVisibleEmployees = (req, res) => {
  const query = `
    SELECT employeeno, name, email ,employeecategory
    FROM users
    WHERE visibility = 1 AND employeestatus = 'employee'
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching employee details:", err);
      return res
        .status(500)
        .json({ error: "An error occurred while fetching employee details." });
    }
    if (results.length === 0) {
      return res
        .status(404)
        .json({ error: "No visible employees found with status 'employee'" });
    }
    // Return employee details
    res.status(200).json(results);
  });
};

//employee number
exports.generateemployeeNumber = async (req, res) => {
  try {
    const { date } = req.query; // Expecting date in 'YYYY-MM-DD' format from the client

    const today = date ? new Date(date) : new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const datePart = `${year}${month}${day}`;

    // Query to find the last invoice number for the given date
    const lastemployeeSql = `SELECT employeeno FROM users WHERE employeeno LIKE ? ORDER BY employeeno DESC LIMIT 1`;
    const lastemployeeeNumber = await new Promise((resolve, reject) => {
      db.query(lastemployeeSql, [`EMP-${datePart}%`], (err, result) => {
        if (err) {
          console.error("Error fetching last employee number:", err);
          reject(err);
        } else {
          resolve(result.length > 0 ? result[0].employeeno : null);
        }
      });
    });

    let sequentialPart = 1;

    if (lastemployeeeNumber) {
      // Extract the sequential part from the last invoice number
      const lastSequentialPart = parseInt(
        lastemployeeeNumber.split("-")[2],
        10
      );
      sequentialPart = lastSequentialPart + 1;
    }

    const sequentialPartStr = String(sequentialPart).padStart(4, "0");
    const newEmployeeNumber = `EMP-${datePart}-${sequentialPartStr}`;

    // Send the generated invoice number as a response
    res.status(200).json({ EmployeeNumber: newEmployeeNumber });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate invoice number" });
  }
};
