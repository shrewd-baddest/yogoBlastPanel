import dotenv from 'dotenv';
dotenv.config();
import db from "../controllers/dbConnect.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
  
 const login = async (req,res) => {
  const { Emaili,Code } = req.body;

  try {
    // Check if user exists
    const results= await db.query('SELECT * FROM person WHERE email = $1', [Emaili]);
    if (results.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

     
 const user = results.rows[0];
//  console.log(user);
     // Compare password
    const isMatch = await bcrypt.compare(Code, user.passcode);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, { expiresIn: '1h' });

    res.json({ token,status:"success" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}

export default login;