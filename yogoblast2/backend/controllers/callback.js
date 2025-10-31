
import db from '../controllers/dbConnect.js';
import { sendMail,sendSMS } from '../middleware/message.js';

const callback = async (req, res) => {
  try {
    // 🟢 Handle POST (Safaricom callback)
    if (req.method === 'POST') {
      const { Body } = req.body;

      if (!Body || !Body.stkCallback) {
        return res.status(400).json({ status: "error", message: "Invalid callback data" });
      }

      const CheckoutRequestID = Body.stkCallback.CheckoutRequestID;
      const ResultCode = Body.stkCallback.ResultCode;

      if (ResultCode === 0) {
        const metaData = Body.stkCallback.CallbackMetadata.Item;
        const getValue = (name) => metaData.find(item => item.Name === name)?.Value || null;

        const paymentDetails = {
          amount: getValue("Amount"),
          mpesaReceiptNumber: getValue("MpesaReceiptNumber"),
          transactionDate: getValue("TransactionDate"),
          phoneNumber: getValue("PhoneNumber"),
        };

        // Match payment record
        const [rows] = await db.execute(
          `SELECT user_id, amount, checkout_id FROM mpesa_request WHERE checkout_id = ?`,
          [CheckoutRequestID]
        );
        if (!rows.length) {
          return res.status(404).json({ status: "error", message: "No matching payment request found." });
        }

        const { user_id, checkout_id, amount } = rows[0];
          await db.execute(
          `UPDATE mpesa_request SET status='paid' WHERE checkout_id=?`,
          [checkout_id]
        );


        // Create order
        await db.execute(
          `INSERT INTO orders (user_id, total_price, MID) VALUES (?, ?, ?)`,
          [user_id, amount, checkout_id]
        );

        // Notify
        const adminMail = process.env.ADMIN_MAIL || "admin@example.com";
        await sendMail(adminMail, "Payment Successful", `Payment Details: ${JSON.stringify(paymentDetails)}`);
        await sendSMS(paymentDetails.phoneNumber, `Payment Successful: ${JSON.stringify(paymentDetails)}`);

        return res.status(200).json({ success: true, data: paymentDetails });
      }

      // Payment failed
      return res.status(400).json({ success: false, message: "Payment failed" });
    }

    // 🟢 Handle GET (frontend polling)
    if (req.method === 'GET') {
      const userId = req.user.id;


      const [rows] = await db.execute(
        `SELECT * FROM mpesa_request WHERE user_id = ? AND status='paid' ORDER BY created_at DESC LIMIT 1`,
        [userId]
      );

      if (!rows.length)
        return res.status(404).json({ success: false, message: "No orders found" });

      res.status(200).json({ success: true, order: rows[0] });
    }
  } catch (error) {
    console.error("Error processing callback:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export default callback;
