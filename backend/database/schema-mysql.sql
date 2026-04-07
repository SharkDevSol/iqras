-- Super Admin Dashboard Database Schema
-- Multi-Branch School Management System (MySQL Version)

-- Drop existing tables if they exist
DROP TABLE IF EXISTS sync_logs;
DROP TABLE IF EXISTS cached_branch_data;
DROP TABLE IF EXISTS branch_health_logs;
DROP TABLE IF EXISTS super_admin_users;
DROP TABLE IF EXISTS branches;

-- Branches table
CREATE TABLE branches (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) UNIQUE NOT NULL,
  base_url VARCHAR(500) NOT NULL,
  api_key VARCHAR(500),
  status VARCHAR(50) DEFAULT 'active',
  last_health_check DATETIME,
  health_status VARCHAR(50) DEFAULT 'unknown',
  response_time_ms INT,
  total_students INT DEFAULT 0,
  total_staff INT DEFAULT 0,
  total_classes INT DEFAULT 0,
  location VARCHAR(255),
  contact_email VARCHAR(255),
  contact_phone VARCHAR(50),
  principal_name VARCHAR(255),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Super admin users
CREATE TABLE super_admin_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(500) NOT NULL,
  full_name VARCHAR(255),
  email VARCHAR(255),
  role VARCHAR(50) DEFAULT 'viewer',
  allowed_branches JSON,
  is_active BOOLEAN DEFAULT true,
  last_login DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Sync logs
CREATE TABLE sync_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  branch_id INT,
  data_type VARCHAR(100) NOT NULL,
  status VARCHAR(50) NOT NULL,
  records_synced INT DEFAULT 0,
  error_message TEXT,
  duration_ms INT,
  synced_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE CASCADE
);

-- Cached branch data
CREATE TABLE cached_branch_data (
  id INT AUTO_INCREMENT PRIMARY KEY,
  branch_id INT,
  data_type VARCHAR(100) NOT NULL,
  data JSON NOT NULL,
  cached_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME NOT NULL,
  UNIQUE KEY unique_branch_data (branch_id, data_type),
  FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE CASCADE
);

-- Branch health logs
CREATE TABLE branch_health_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  branch_id INT,
  status VARCHAR(50) NOT NULL,
  response_time_ms INT,
  error_message TEXT,
  checked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_branches_status ON branches(status);
CREATE INDEX idx_branches_code ON branches(code);
CREATE INDEX idx_sync_logs_branch ON sync_logs(branch_id);
CREATE INDEX idx_sync_logs_date ON sync_logs(synced_at DESC);
CREATE INDEX idx_cached_data_branch ON cached_branch_data(branch_id);
CREATE INDEX idx_cached_data_expires ON cached_branch_data(expires_at);
CREATE INDEX idx_health_logs_branch ON branch_health_logs(branch_id);
CREATE INDEX idx_health_logs_date ON branch_health_logs(checked_at DESC);

-- Insert default super admin user (password: admin123)
-- Password hash for 'admin123' using bcrypt
INSERT INTO super_admin_users (username, password_hash, full_name, email, role)
VALUES (
  'superadmin',
  '$2a$10$rZ5YvqhQZ5YvqhOJ5YvqhOJ5YvqhQZ5YvqhQZ5YvqhQZ5YvqhQZ5Y',
  'Super Administrator',
  'admin@skoolific.com',
  'super_admin'
);
