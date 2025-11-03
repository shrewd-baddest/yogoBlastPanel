import twilio from 'twilio';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
dotenv.config();
const AccountSid=process.env.TWILIO_ACCOUNT_SID;
const authToken=process.env.TWILIO_TOKEN

const x=nodemailer.createTransport(
    {
        service:'gmail',
        auth:{
            user:process.env.MAIL_USER,
            password:process.env.MAIL_PASSWORD
        }
    }
)


export const sendMail=async(to,subject,text)=>{
    const mailOptions={
from:process.env.FROM_MAIL,
to,
subject,
text
    };
try {
await x.sendMail(mailOptions);
console.log('message sent successfully');
    
} catch (error) {
  console.error(error.message)  ;
}
}
const client=twilio(AccountSid,authToken);

export  const sendSMS=async(to,body)=>{
const message={
    body,
    from:process.env.TWILIO_PHONE_NUMBER,
    to
    
}
try{
    await client.messages.create(message);
    console.log('message sent successfully');
}
catch(error){
    console.error(message.error)
}
}