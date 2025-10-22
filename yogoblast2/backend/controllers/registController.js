import db from "../controllers/dbConnect.js";
import bcrypt from "bcrypt";
 

 const regist = async (req, res) => {
    
    
    // Destructure fields from request body
const { ID, fName, sName, pCode, email } = req.body;  
   if (!ID || !fName || !sName || !pCode || !email) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        const sql = `INSERT INTO person (ID,firstname,secondName,passcode,email)
                     VALUES (?, ?, ?, ?, ?);`;
        const hashedPassword = await bcrypt.hash(pCode, 10);
        const params = [ID, fName, sName, hashedPassword, email];
        await db.query(sql, params);
        
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({ message: "Internal server error" });
    }    
}

export default regist;