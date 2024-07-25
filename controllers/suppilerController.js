const { v4: uuidv4 } = require('uuid');
const db = require('../utils/db'); // Ensure you have a proper db connection setup



//creat supplier
exports.createSupplier = async (req, res) => {
    try {
      // Clean up field names by trimming whitespace
      const supplier = {
        user_id: uuidv4(), // Generate unique user_id using uuidv4
        SupplierDescription: req.body.SupplierDescription.trim(),
        SupplierAddress: req.body.SupplierAddress.trim(),
      };
  
      // Explicitly list column names with correct field names
      const sql = `
        INSERT INTO suppliers (user_id,SupplierDescription,SupplierAddress)
        VALUES (?, ?, ?)
      `;
  
      const values = [
        supplier.user_id,
        supplier.SupplierDescription,
        supplier.SupplierAddress,
      ];
  
      // Use a Promise to handle the query asynchronously
      await new Promise((resolve, reject) => {
        db.query(sql, values, (err, result) => {
          if (err) {
            console.error("Database Error:", err);
            console.error("SQL Query:", sql);
            console.error("Supplier Data:", supplier);
            return reject(err); // Reject the promise on error
          }
          resolve(result); // Resolve the promise on success
        });
      });
  
      res.status(201).json({ message: "Supplier added successfully" });
    } catch (err) {
      console.error("Error:", err);
      res.status(500).json({ error: "Failed to add supplier", details: err.message });
    }
  };

{/********************get supplier using userid**********************************/}
exports.getSupplierById = (req, res) => {
    // Log the request body to ensure it's being received
    console.log("Request Body:", req.body);
    
    // Extract the user_id from the JSON body
    const { user_id } = req.body;
    console.log("User ID received:", user_id);
    
    if (!user_id) {
      return res.status(400).json({ error: "User ID is required" });
    }
    
    const sql = "SELECT * FROM suppliers WHERE user_id = ?";
    db.query(sql, [user_id], (err, results) => {
      if (err) {
        console.error("Database Error:", err);
        return res.status(500).json({ error: "Failed to retrieve supplier" });
      }
      
      console.log("Query Results:", results);
      if (results.length === 0) {
        return res.status(404).json({ error: "Supplier not found" });
      }
      
      const supplier = results[0];
      res.status(200).json(supplier);
    });
  };

  {/***************update supplier using userid**********************************/}
  exports.updateSupplier = (req, res) => {
    // Log the request body to ensure it's being received
    console.log("Request Body:", req.body);
    
    // Extract the user_id, SupplierDescription, and SupplierAddress from the JSON body
    const { user_id, SupplierDescription, SupplierAddress } = req.body;
    console.log("User ID received:", user_id);
    console.log("Supplier Description received:", SupplierDescription);
    console.log("Supplier Address received:", SupplierAddress);
    
    if (!user_id || !SupplierDescription || !SupplierAddress) {
      return res.status(400).json({ error: "User ID, Supplier Description, and Supplier Address are required" });
    }
    
    const sql = `
      UPDATE suppliers 
      SET SupplierDescription = ?, SupplierAddress = ? 
      WHERE user_id = ?
    `;
    
    const values = [SupplierDescription.trim(), SupplierAddress.trim(), user_id];
    
    db.query(sql, values, (err, result) => {
      if (err) {
        console.error("Database Error:", err);
        return res.status(500).json({ error: "Failed to update supplier" });
      }
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Supplier not found" });
      }
      
      res.status(200).json({ message: "Supplier updated successfully" });
    });
  };
  
{/**********************delete supplier using userid*************************************88 */}
  exports.deleteSupplier = (req, res) => {
    // Log the request body to ensure it's being received
    console.log("Request Body:", req.body);
    
    // Extract the user_id from the JSON body
    const { user_id } = req.body;
    console.log("User ID received:", user_id);
    
    if (!user_id) {
      return res.status(400).json({ error: "User ID is required" });
    }
    
    const sql = "DELETE FROM suppliers WHERE user_id = ?";
    
    db.query(sql, [user_id], (err, result) => {
      if (err) {
        console.error("Database Error:", err);
        return res.status(500).json({ error: "Failed to delete supplier" });
      }
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Supplier not found" });
      }
      
      res.status(200).json({ message: "Supplier deleted successfully" });
    });
  };
  