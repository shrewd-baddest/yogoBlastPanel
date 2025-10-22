import pool from '../controllers/dbConnect.js';
import axios from 'axios';
import { sendMail } from '../middleware/message.js';



export const notifications = async (type, msg, userId, productId) => {
    const noticeSql = `INSERT INTO notifications (type, message) VALUES (?, ?)`;
    const noticeType = type;
    const noticeMessage = msg;
    await db.execute(noticeSql, [noticeType, noticeMessage]);
    const mailsql=`SELECT email FROM person WHERE ID = ?`;
    const [mailresult]=await db.execute(mailsql,[userId]);
    const userEmail=mailresult[0].email;
    sendMail(userEmail, noticeType, noticeMessage);
    
}
