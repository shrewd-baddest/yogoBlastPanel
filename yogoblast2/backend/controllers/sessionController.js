import { sendMail } from '../middleware/message.js';
import { notifications } from '../middleware/notify.js';
import db from './dbConnect.js';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();
const account = async (req, res) => {
  try {
    const userId = req.user.id;
    const [rows] = await db.execute(`SELECT * FROM person WHERE ID = ?`, [userId]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(rows[0]); // Return the user object
  } catch (error) {
    console.error("Error fetching account info:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const cart = async (req, res) => {
  try {
    const userId = req.user.id;
     // If no data is sent, return total quantity in cart (GET-like behavior)
    if (!req.body || Object.keys(req.body).length === 0) {
      const [rows] = await db.execute(
        `SELECT SUM(quantity) AS total_quantity FROM shoping_cart WHERE user_id = ?`,
        [userId]
      );
      res.status(200).json(rows[0]);
    } else {
      // Otherwise, assume it's a POST to insert item to cart
      const { Quantity, productId } = req.body;

      if (!Quantity || !productId) {
        return res.status(400).json({ message: "Missing Quantity or Product ID" });
      }

      const sql = `INSERT INTO shoping_cart (product_id, user_id, quantity) VALUES (?, ?, ?)`;
      const [result] = await db.execute(sql, [productId, userId, Quantity]);
      res.status(201).json({status:'success',message: "Item added to cart successfully" });
    }
  } catch (error) {
    console.error("Error handling cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const cartDisplay = async (req, res) => {
  try {
    const userId = req.user.id;
    const sql = `
      SELECT 
        products.products_id,
        products.image_url,
        products.weight_ml,
        products.price,
        shoping_cart.quantity
      FROM shoping_cart
      INNER JOIN products ON shoping_cart.product_id = products.products_id
      WHERE shoping_cart.user_id = ?
    `;
    const [rows] = await db.execute(sql, [userId]);
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching cart items:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const update = async (req, res) => {
  try {
    const userId = req.user.id;
    const { deleteQuantity, deleteId } = req.body;

    if (!deleteId) {
      return res.status(400).json({ message: "Missing product ID to update" });
    }

    if (deleteQuantity > 1) {
      const sql = `UPDATE shoping_cart SET quantity = ? WHERE product_id = ? AND user_id = ?`;
      await db.execute(sql, [deleteQuantity, deleteId, userId]);
    } else {
      const sql = `DELETE FROM shoping_cart WHERE product_id = ? AND user_id = ? LIMIT 1`;
      await db.execute(sql, [deleteId, userId]);
    }

    res.status(200).json({status: "success", message: "cart updated successfully" });
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

const orders=async(req,res)=>{
  const user=req.user.id;
const {product_id,quantity,price}=req.body;
 try{
const sql=`SELECT * FROM ORDERS WHERE user_id = ? ORDER BY order_date DESC LIMIT 1`;
   const [result]=await db.execute(sql,[user]);

   if (result.length > 0 && result[0].statuz == 0) {

    const sql2=`INSERT INTO ORDER_ITEMS(order_id, product_id,price, quantity) VALUES (?, ?, ?, ?)`;
        await db.execute(sql2,[result[0].id,product_id,quantity,price]);
              res.status(201).json({status: "success", message: "Order items added successfully"});

              const noticeSql = `INSERT INTO notifications (type, message) VALUES (?, ?)`;
              const noticeType = 'order';
              const noticeMessage = `New item has been ordered for #${product_id}.`;
              await db.execute(noticeSql, [noticeType, noticeMessage]);

   }
   
}
catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }

}

const payment = async (req, res) => {
  const userId = req.user.id;
  const { phoneNumber, price, productId } = req.body;
  // let userId, productId;
  const consumerKey = process.env.CONSUMER_KEY;
  const consumerSecret = process.env.CONSUMER_SECRET;
  const shortcode = process.env.SHORTCODE || 174379;
  const passkey = process.env.PASSKEY;
   try {
 

    

    const credentials = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

    // 1️ Get Access Token
    const tokenRes = await axios.get(
      'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
      { headers: { Authorization: `Basic ${credentials}` } }
    );
    console.log("Token Response:", tokenRes.data);
    const accessToken = tokenRes.data.access_token;

    // 2️ Build Password
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');

    // 3️ STK Push
    const stkRes = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      {
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: price,
        PartyA: phoneNumber,
        PartyB: shortcode,
        PhoneNumber: phoneNumber,
        CallBackURL: "https://yogoblastpanel-3.onrender.com/pages/callback",
        AccountReference: "YogurtBlast",
        TransactionDesc: "Product purchase",
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const checkoutId = stkRes.data.CheckoutRequestID;

    // 4️ Insert into DB
    const insertSql = `
      INSERT INTO mpesa_request (checkout_id, user_id, amount, created_at, productId)
      VALUES (?, ?, ?, NOW(), ?)
    `;
    await db.execute(insertSql, [checkoutId, userId, price, productId]);

    // 5️ Respond & Notify
    res.status(200).json({ status: 'success', message: 'STK Push sent', checkoutId });
    notifications('payment', `Payment initiated for product #${productId}`, userId, productId);

  } catch (error) {
    console.error("Payment error:", error.response?.data || error.message);
    res.status(500).json({
      status: 'error',
      message: error.response?.data?.errorMessage || 'Payment initiation failed',
    });

    notifications('payment', `Payment initiation failed for product #${productId}`, userId, productId);
  }
};


export default { account, cart, cartDisplay, update ,orders,payment};