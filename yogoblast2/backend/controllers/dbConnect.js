import dotenv from 'dotenv';
dotenv.config();
// import mysql from 'mysql2/promise';
import pg from 'pg';
const { Pool } = pg;
console.log("DB USER:", process.env.DB_USER);
console.log("DB PASSWORD:", process.env.DB_PASSWORD);

// Create a pool instead of a single connection
const db = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

db.on('connect', () => {
  console.log('Connected to the database');
});

db.on('error', (err) => {
  console.error('Database error:', err);
});

export default db;
