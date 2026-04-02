import db from "../controllers/dbConnect.js";
import { sendMail, sendSMS } from "../middleware/message.js";

const callback = async (req, res) => {
  console.log("🔥 CALLBACK HIT");
  console.log("METHOD:", req.method);
  console.log("BODY:", JSON.stringify(req.body, null, 2));

  const client = await db.connect();

  try {
    await client.query("BEGIN");

 
    if (req.method === "POST") {
      const { Body } = req.body;

      // ❌ Invalid structure
      if (!Body || !Body.stkCallback) {
        await client.query("ROLLBACK");
        return res.status(400).json({
          status: "error",
          message: "Invalid callback data",
        });
      }

      const stk = Body.stkCallback;
      const CheckoutRequestID = stk.CheckoutRequestID;
      const ResultCode = stk.ResultCode;

      // ✅ Respond FAST (important for Safaricom)
      res.status(200).json({ success: true });

      // ❌ If payment failed
      if (ResultCode !== 0) {
        await client.query("ROLLBACK");
        console.log("❌ Payment failed");
        return;
      }

      // ✅ Safe metadata extraction
      const metaData = stk.CallbackMetadata?.Item || [];
      const getValue = (name) =>
        metaData.find((item) => item.Name === name)?.Value || null;

      const paymentDetails = {
        amount: getValue("Amount"),
        mpesaReceiptNumber: getValue("MpesaReceiptNumber"),
        transactionDate: getValue("TransactionDate"),
        phoneNumber: getValue("PhoneNumber"),
      };

      // ✅ Find matching request
      const results = await client.query(
        `SELECT user_id, amount, checkout_id FROM mpesa_request WHERE checkout_id = $1`,
        [CheckoutRequestID]
      );

      if (!results.rows.length) {
        await client.query("ROLLBACK");
        console.log("❌ No matching payment request");
        return;
      }

      const { user_id, checkout_id, amount } = results.rows[0];

      // ✅ Prevent duplicate orders
      const existingOrder = await client.query(
        `SELECT * FROM orders WHERE MID = $1`,
        [checkout_id]
      );

      if (existingOrder.rows.length) {
        await client.query("ROLLBACK");
        console.log("⚠️ Duplicate callback ignored");
        return;
      }

      // ✅ Update payment
      await client.query(
        `UPDATE mpesa_request SET status='paid' WHERE checkout_id=$1`,
        [checkout_id]
      );

      // ✅ Insert order
      await client.query(
        `INSERT INTO orders (user_id, total_price, MID) VALUES ($1, $2, $3)`,
        [user_id, amount, checkout_id]
      );

      await client.query("COMMIT");

      console.log("✅ Payment processed:", paymentDetails);

      // 📩 Send notifications (after commit)
      const adminMail = process.env.ADMIN_MAIL || "admin@example.com";

      await sendMail(
        adminMail,
        "Payment Successful",
        `Payment Details: ${JSON.stringify(paymentDetails)}`
      );

      await sendSMS(
        paymentDetails.phoneNumber,
        `Payment Successful: ${paymentDetails.mpesaReceiptNumber}`
      );

      return;
    }
 
    if (req.method === "GET") {
      const userId = req.user?.id;

      const results = await client.query(
        `SELECT * FROM mpesa_request 
         WHERE user_id = $1 AND status='paid' 
         ORDER BY created_at DESC LIMIT 1`,
        [userId]
      );

      if (!results.rows.length) {
        await client.query("ROLLBACK");
        return res.status(404).json({
          success: false,
          message: "No orders found",
        });
      }

      await client.query("COMMIT");

      return res.status(200).json({
        success: true,
        order: results.rows[0],
      });
    }

    // ❌ Fallback
    await client.query("ROLLBACK");
    return res.status(405).json({ message: "Method not allowed" });

  } catch (error) {
    console.error("❌ Error processing callback:", error);
    await client.query("ROLLBACK");
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  } finally {
    client.release();
  }
};

export default callback;