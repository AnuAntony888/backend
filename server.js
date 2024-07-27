require("dotenv").config(); // Add this at the top of your server file
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const supplierRoutes = require('./routes/supplierRoutes');
const itemRoutes=require('./routes/itemRoutes')
const corsOptions = require("./config/cors");
require("./config/createTables"); // Import and execute the table creation script
const app = express();
const port = 5000;

// Use CORS middleware with options
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Use routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/supplier", supplierRoutes); 
app.use("/api/item",itemRoutes); 
// Route for root URL
app.get("/", (req, res) => {
  res.send("Welcome to the API!");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
