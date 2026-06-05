import mysql from "mysql2/promise";
import dotenv from "dotenv";

// Load database credentials from the .env file.
dotenv.config();

/*
  Create a MySQL connection pool.

  A pool is preferred over a single connection because it can reuse
  multiple database connections across incoming API requests.
*/
const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default db;