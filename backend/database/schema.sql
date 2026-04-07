-- Super Admin Dashboard Database Schema
-- Multi-Branch School Management System

-- Drop existing tables if they exist
DROP TABLE IF EXISTS sync_logs CASCADE;
DROP TABLE IF EXISTS cached_branch_data CASCADE;
DROP TABLE IF EXISTS branch_health_logs CASCADE;
DROP TABLE IF EXISTS super_admin_users CASCADE;
DROP TABLE IF EXISTS branches CASCADE;

-- Branches table
CREATE TABLE branches (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) UNIQUE NOT NULL,
  base_url VARCHAR(500) NOT NULL,
  api_key VARCHAR(500),
  status VARCHAR(50) DEFAULT 'active',
  last_health_check TIMESTAMP,
  health_status VARCHAR(50) DEFAULT 'unknown',
  response_time_ms INTEGER,
  total_students INTEGER DEFAULT 0,
  total_staff INTEGER DEFAULT 0,
  total_classes INTEGER DEFAULT 0,
  location VARCHAR(255),
  contact_email VARCHAR(255),
  contact_phone VARCHAR(50),
  principal_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Super admin users
CREATE TABLE super_admin_users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(500) NOT NULL,
  full_name VARCHAR(255),
  email VARCHAR(255),
  role VARCHAR(50) DEFAULT 'viewer',
  allowed_branches INTEGER[],
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Sync logs
CREATE TABLE sync_logs (
  id SERIAL PRIMARY KEY,
  branch_id INTEGER REFERENCES branches(id) ON DELETE CASCADE,
  data_type VARCHAR(100) NOT NULL,
  status VARCHAR(50) NOT NULL,
  records_synced INTEGER DEFAULT 0,
  error_message TEXT,
  duration_ms INTEGER,
  synced_at TIMESTAMP DEFAULT NOW()
);

-- Cached branch data
CREATE TABLE cached_branch_data (
  id SERIAL PRIMARY KEY,
  branch_id INTEGER REFERENCES branches(id) ON DELETE CASCADE,
  data_type VARCHAR(100) NOT NULL,
  data JSONB NOT NULL,
  cached_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP NOT NULL,
  UNIQUE(branch_id, data_type)
);

-- Branch health logs
CREATE TABLE branch_health_logs (
  id SERIAL PRIMARY KEY,
  branch_id INTEGER REFERENCES branches(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL,
  response_time_ms INTEGER,
  error_message TEXT,
  checked_at TIMESTAMP DEFAULT NOW()
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
INSERT INTO super_admin_users (username, password_hash, full_name, email, role)
VALUES (
  'superadmin',
  '$2a$10$rZ5YvqhQZ5YvqhQZ5YvqhOJ5YvqhQZ5YvqhQZ5YvqhQZ5YvqhQZ5Y',
  'Super Administrator',
  'admin@skoolific.com',
  'super_admin'
);

-- Sample branches (you can remove these after testing)
INSERT INTO branches (name, code, base_url, location, principal_name) VALUES
('Iqrab Branch 1', 'IQRAB1', 'https://iqrab1.skoolific.com', 'Location 1', 'Principal 1'),
('Iqrab Branch 2', 'IQRAB2', 'https://iqrab2.skoolific.com', 'Location 2', 'Principal 2'),
('Iqrab Branch 3', 'IQRAB3', 'https://iqrab3.skoolific.com', 'Location 3', 'Principal 3');

COMMENT ON TABLE branches IS 'Stores information about all school branches';
COMMENT ON TABLE super_admin_users IS 'Super admin users who can access the dashboard';
COMMENT ON TABLE sync_logs IS 'Logs of data synchronization from branches';
COMMENT ON TABLE cached_branch_data IS 'Cached data from branches for performance';
COMMENT ON TABLE branch_health_logs IS 'Health check logs for monitoring branch status';
