import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Create connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  database: process.env.DB_NAME || 'super_iqra',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  waitForConnections: true,
  connectionLimit: 20,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// Test database connection
pool.getConnection()
  .then(connection => {
    console.log('✅ Connected to MySQL database');
    connection.release();
  })
  .catch(err => {
    console.error('❌ Database connection error:', err);
  });

// Helper function to execute queries
export const query = async (text, params) => {
  const start = Date.now();
  try {
    const [rows] = await pool.execute(text, params);
    const duration = Date.now() - start;
    console.log('📊 Query executed', { text: text.substring(0, 50), duration, rows: rows.length });
    return { rows, rowCount: rows.length };
  } catch (error) {
    console.error('❌ Query error:', error);
    throw error;
  }
};

// Helper function to get a connection from the pool
export const getConnection = async () => {
  return await pool.getConnection();
};

export default pool;
