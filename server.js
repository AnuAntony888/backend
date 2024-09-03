require("dotenv").config(); // Add this at the top of your server file
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const supplierRoutes = require('./routes/supplierRoutes');
const itemRoutes = require('./routes/itemRoutes');
const customerRoutes = require('./routes/customerRoutes')
const invoiceRouters = require('./routes/invoiceRoutes');
const masterRoutes = require('./routes/masterRoutes');
const categoryRoutes=require('./routes/categoryRoutes')
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
app.use("/api/item", itemRoutes); 
app.use("/api/customer", customerRoutes); 
app.use("/api/invoice", invoiceRouters);
app.use("/api/master", masterRoutes);
app.use("/api/category", categoryRoutes);
// Route for root URL
app.get("/", (req, res) => {
  console.log(   process.env.DB_HOST,
    process.env.DB_PORT || 3306,
     process.env.DB_USER,
     process.env.DB_PASSWORD,
     process.env.DB_NAME,"details")
  res.send("Welcome to the API!");
});
app.get("/api/master", (req, res) => {
  res.json({ message: "Welcome to the API!" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});



