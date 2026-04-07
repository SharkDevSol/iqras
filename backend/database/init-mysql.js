import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initializeDatabase() {
  console.log('🔧 Initializing database...');
  
  // Connect to MySQL first to create our database
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD
  });

  try {
    // Check if database exists and create it
    const dbName = process.env.DB_NAME || 'super_iqra';
    console.log(`📦 Creating database: ${dbName}`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    console.log(`✅ Database ${dbName} ready`);

    // Use the database
    await connection.query(`USE \`${dbName}\``);

    // Read and execute schema
    const schemaPath = path.join(__dirname, 'schema-mysql.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Split by semicolon and execute each statement
    const statements = schema.split(';').filter(stmt => stmt.trim());
    
    console.log('📋 Creating tables...');
    for (const statement of statements) {
      if (statement.trim()) {
        await connection.query(statement);
      }
    }
    console.log('✅ Tables created successfully');

    await connection.end();

    console.log('');
    console.log('🎉 Database initialization complete!');
    console.log('');
    console.log('Default login credentials:');
    console.log('  Username: superadmin');
    console.log('  Password: admin123');
    console.log('');
    console.log('⚠️  IMPORTANT: Change these credentials after first login!');
    console.log('');

  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    await connection.end();
    throw error;
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  initializeDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export default initializeDatabase;
