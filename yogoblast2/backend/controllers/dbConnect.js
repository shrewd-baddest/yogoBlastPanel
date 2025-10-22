import dotenv from 'dotenv';
dotenv.config();
import mysql from 'mysql2/promise';
console.log("DB USER:", process.env.DB_USER);
console.log("DB PASSWORD:", process.env.DB_PASSWORD);

// Create a pool instead of a single connection
const db = mysql.createPool({
  host: process.env.DB_HOST , 
  user: process.env.DB_USER || 'root', 
  password: process.env.DB_PASSWORD ,
  database: process.env.DB_NAME,
 port: process.env.DB_PORT|| 3306, // Default MySQL port
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test the connection
db.getConnection()
  .then(conn => {
    console.log(" Database connected!");
    conn.release(); // release the connection back to the pool
  })
  .catch(err => {
    console.error("Connection failed:", err);
  });


export default db;
