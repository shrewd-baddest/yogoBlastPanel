import dotenv from "dotenv";
dotenv.config();
// import mysql from 'mysql2/promise';
import pg from "pg";
const { Pool } = pg;
// console.log("DB USER:", process.env.DB_USER);
// console.log("DB PASSWORD:", process.env.DB_PASSWORD);

const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

console.log("⏳ Attempting DB connection...");

db.connect()
  .then(() => {
    console.log("✅ Database connected successfully");
  })
  .catch((err) => {
    console.error("❌ DB connection error:", err);
  });

export default db;
