import bcrypt from 'bcryptjs';
import { query } from './config/database.js';

async function createAdmin() {
  try {
    const username = 'superadmin';
    const password = 'admin123';
    const full_name = 'Super Administrator';
    const email = 'admin@skoolific.com';
    const role = 'super_admin';

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    // Check if user already exists
    const checkResult = await query(
      'SELECT * FROM super_admin_users WHERE username = $1',
      [username]
    );

    if (checkResult.rows.length > 0) {
      console.log('❌ Super admin user already exists!');
      console.log('Username:', username);
      process.exit(0);
    }

    // Create user
    const result = await query(
      `INSERT INTO super_admin_users 
       (username, password_hash, full_name, email, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, username, full_name, email, role, created_at`,
      [username, password_hash, full_name, email, role]
    );

    console.log('✅ Super admin user created successfully!');
    console.log('');
    console.log('Login Credentials:');
    console.log('  Username:', username);
    console.log('  Password:', password);
    console.log('');
    console.log('⚠️  IMPORTANT: Change this password after first login!');
    console.log('');
    console.log('User Details:');
    console.log(result.rows[0]);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
}

createAdmin();
