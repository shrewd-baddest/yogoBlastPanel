import pool from '../controllers/dbConnect.js';
import axios from 'axios';
import { sendMail } from '../middleware/message.js';



export const notifications = async (type, msg, userId, productId) => {
    const noticeSql = `INSERT INTO notifications (type, message) VALUES ($1, $2)`;
    const noticeType = type;
    const noticeMessage = msg;
    await db.execute(noticeSql, [noticeType, noticeMessage]);
    const mailsql=`SELECT email FROM person WHERE ID = $1`;
    const mailresult=await db.execute(mailsql,[userId]);
    const userEmail=mailresult.rows[0].email;
    sendMail(userEmail, noticeType, noticeMessage);
    
}
