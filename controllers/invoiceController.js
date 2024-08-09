const { v4: uuidv4 } = require("uuid");
const db = require("../utils/db"); 




exports.createinvoice = async (req, res) => {
  try {
    const {
      invoice_no,
      customer_id,
      product_id,
      ItemCode ,
      ItemDescription , 
     
      ItemUnit ,
      ItemTax ,
      IteamDiscount ,
      IteamPrice ,
      Iteamstock ,  

      paymentmethod,
      product_actual_total,
      product_discounted_total,
      cartCount,
      orderstatus,
    } = req.body;
    const productIdsArray = JSON.parse(product_id);
    const cartCountsArray = JSON.parse(cartCount);
    const  ItemCodeArray =JSON.parse(ItemCode)
    const  ItemDescriptionArray =JSON.parse(ItemDescription)
   
    ItemUnit ,
    ItemTax ,
    IteamDiscount ,
    IteamPrice ,
    Iteamstock ,  
    // Validate required fields
    if (
      !invoice_no ||
      !customer_id ||
      !product_id ||
      !product_actual_total ||
      !product_discounted_total ||
      !cartCount ||
      !orderstatus ||
      !paymentmethod
    ) {
      return res
        .status(400)
        .json({ error: "All required fields must be provided" });
    }
// Check if lengths of arrays match
if (productIdsArray.length !== cartCountsArray.length) {
    return res.status(400).json({ error: "Mismatch in product IDs and cart counts" });
  }
    // Insert a new invoice record
    const insertSql = `
      INSERT INTO Invoice (
        invoice_id,
        invoice_no,
        customer_id,
        product_id,
         ItemCode 
    ItemDescription , 
   
    ItemUnit ,
    ItemTax ,
    IteamDiscount ,
    IteamPrice ,
    Iteamstock ,   
        product_actual_total,
        product_discounted_total,
        cartCount,
        orderstatus,
        paymentmethod
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)
    `;
    for (let i = 0; i < productIdsArray.length; i++) {
    const insertValues = [
      uuidv4(), // Generate a new UUID for invoice_id
      invoice_no,
      customer_id,
      productIdsArray[i],
      product_actual_total,
      product_discounted_total,
      cartCountsArray[i],
      orderstatus,
      paymentmethod
    ];

    await new Promise((resolve, reject) => {
        db.query(insertSql, insertValues, (err, result) => {
          if (err) {
            console.error("Error:", err);
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
    }

    res.status(201).json({ message: "Invoice created successfully" });
  } catch (err) {
    console.error("Error:", err);
    res
      .status(500)
      .json({ error: "Failed to process invoice", details: err.message });
  }
};
