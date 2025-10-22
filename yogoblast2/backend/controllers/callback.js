import { sendMail, sendSMS } from "../middleware/message";

const callback = async (req, res) => {
  try {
    const { Body } = req.body;
    const metaData = Body.stkCallback.CallbackMetadata.Item;
    const amountItem = metaData.find(item => item.Name === 'Amount');
    const mpesaReceiptItem = metaData.find(item => item.Name === 'MpesaReceiptNumber');
    const transactionDateItem = metaData.find(item => item.Name === 'TransactionDate');
    const phoneNumberItem = metaData.find(item => item.Name === 'PhoneNumber');

    const paymentDetails = {
      amount: amountItem ? amountItem.Value : null,
      mpesaReceiptNumber: mpesaReceiptItem ? mpesaReceiptItem.Value : null,
      transactionDate: transactionDateItem ? transactionDateItem.Value : null,
    };
     if (Body.stkCallback.ResultCode === 0) {
       const recipient = process.env.ADMIN_MAIL || "admin@example.com";
      const phoneNumber = phoneNumberItem?.Value || "Unknown";

      await sendMail(recipient, "Payment Successful", `Payment Details: ${JSON.stringify(paymentDetails)}`);
      await sendSMS(phoneNumber, `Payment Successful: ${JSON.stringify(paymentDetails)}`);

      res.status(200).json({ success: true, data: paymentDetails });
    }else {
      res.status(400).json({ success: false, message: 'Payment failed' });
    }
  } catch (error) {
    console.error('Error processing callback:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
export { callback };