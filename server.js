require('dotenv').config(); // Add this at the top of your server file
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
