import dotenv from 'dotenv';
dotenv.config();
// import mysql from 'mysql2/promise';
import pg from 'pg';
const { Pool } = pg;
console.log("DB USER:", process.env.DB_USER);
console.log("DB PASSWORD:", process.env.DB_PASSWORD);

 

const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});



db.on('connect', () => {
  console.log('Connected to the database');
});

db.on('error', (err) => {
  console.error('Database error:', err);
});

export default db;


 

