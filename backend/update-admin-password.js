import bcrypt from 'bcryptjs';
import { query } from './config/database.js';

async function updateAdminPassword() {
  try {
    const username = 'superadmin';
    const password = 'admin123';

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    // Update password
    const result = await query(
      'UPDATE super_admin_users SET password_hash = $1 WHERE username = $2 RETURNING username',
      [password_hash, username]
    );

    if (result.rows.length > 0) {
      console.log('✅ Password updated successfully!');
      console.log('Username:', username);
      console.log('Password:', password);
    } else {
      console.log('❌ User not found!');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating password:', error);
    process.exit(1);
  }
}

updateAdminPassword();
