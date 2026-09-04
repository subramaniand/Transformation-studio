-- Transformation Studio - Supabase Initialization Script
-- Run this in your Supabase SQL Editor to set up the database schema

-- ════════════════════════════════════════════════════════════════
-- CREATE TABLES
-- ════════════════════════════════════════════════════════════════

-- Users table for authentication
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'viewer',
  "function" TEXT,
  active BOOLEAN DEFAULT true,
  created TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Roles table for RBAC
CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  permissions JSONB NOT NULL DEFAULT '{}'::JSONB,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Allow custom roles on databases created from an earlier schema version.
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE roles ADD COLUMN IF NOT EXISTS permissions JSONB NOT NULL DEFAULT '{}'::JSONB;
ALTER TABLE roles ADD COLUMN IF NOT EXISTS active BOOLEAN NOT NULL DEFAULT true;

-- Catalogues table for pricing catalogues
CREATE TABLE IF NOT EXISTS catalogues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  tier INTEGER DEFAULT 0 CHECK (tier >= 0 AND tier <= 4),
  description TEXT,
  params JSONB DEFAULT '{}'::JSONB,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Audit logs for tracking changes
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  user_email TEXT,
  action TEXT NOT NULL,
  detail TEXT,
  resource_type TEXT,
  resource_id TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Settings table for application configuration
CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ════════════════════════════════════════════════════════════════
-- CREATE INDEXES
-- ════════════════════════════════════════════════════════════════

CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(active);
CREATE INDEX IF NOT EXISTS idx_catalogues_type ON catalogues(type);
CREATE INDEX IF NOT EXISTS idx_catalogues_created_by ON catalogues(created_by);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_settings_key ON settings(key);

-- ════════════════════════════════════════════════════════════════
-- INSERT DEMO DATA
-- ════════════════════════════════════════════════════════════════

-- Insert demo users
INSERT INTO users (username, password, name, email, role, "function", active)
VALUES
  ('admin', 'admin123', 'Admin User', 'admin@company.com', 'admin', 'Operations', true),
  ('analyst', 'analyst123', 'Jane Analyst', 'jane@company.com', 'analyst', 'Finance', true),
  ('viewer', 'view123', 'Bob Viewer', 'bob@company.com', 'viewer', 'Technology/IT', true)
ON CONFLICT (username) DO NOTHING;

-- Insert roles
INSERT INTO roles (name, description)
VALUES
  ('admin', 'Full access to all features'),
  ('analyst', 'Can create and edit catalogues'),
  ('viewer', 'Read-only access')
ON CONFLICT (name) DO NOTHING;

-- Insert demo catalogues
INSERT INTO catalogues (name, type, tier, description, created_by)
SELECT
  'DC Exit Programme',
  'DC Exit',
  1,
  'Migration from on-premises data center',
  id FROM users WHERE username = 'admin' LIMIT 1
WHERE NOT EXISTS (SELECT 1 FROM catalogues WHERE name = 'DC Exit Programme');

INSERT INTO catalogues (name, type, tier, description, created_by)
SELECT
  'Enterprise App Migration',
  'App Development',
  2,
  'Large-scale application modernization',
  id FROM users WHERE username = 'admin' LIMIT 1
WHERE NOT EXISTS (SELECT 1 FROM catalogues WHERE name = 'Enterprise App Migration');

INSERT INTO catalogues (name, type, tier, description, created_by)
SELECT
  'AWS Landing Zone',
  'Landing Zone',
  1,
  'AWS multi-account setup',
  id FROM users WHERE username = 'analyst' LIMIT 1
WHERE NOT EXISTS (SELECT 1 FROM catalogues WHERE name = 'AWS Landing Zone');

-- ════════════════════════════════════════════════════════════════
-- ENABLE ROW LEVEL SECURITY (OPTIONAL FOR PRODUCTION)
-- ════════════════════════════════════════════════════════════════

-- Uncomment for production to enable RLS
/*
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE catalogues ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own data
CREATE POLICY "Users can view own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Allow anonymous read (for login screen)
CREATE POLICY "Allow public read for login"
  ON users FOR SELECT
  USING (true);

-- Allow users to read catalogues
CREATE POLICY "Users can view catalogues"
  ON catalogues FOR SELECT
  USING (true);

-- Allow admins to insert/update/delete catalogues
CREATE POLICY "Admins can manage catalogues"
  ON catalogues FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );
*/

-- ════════════════════════════════════════════════════════════════
-- VERIFICATION QUERIES
-- ════════════════════════════════════════════════════════════════

-- Check if tables are created
SELECT tablename FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- Check demo users
SELECT id, username, name, role FROM users;

-- Check demo catalogues
SELECT id, name, type, tier FROM catalogues;

-- ════════════════════════════════════════════════════════════════
-- NOTES
-- ════════════════════════════════════════════════════════════════
--
-- 1. Replace 'admin123' with a proper password in production
-- 2. Consider using Supabase Auth instead of storing passwords
-- 3. Enable RLS policies before going to production
-- 4. Set up automated backups in Supabase settings
-- 5. Review table access permissions regularly
--
-- ════════════════════════════════════════════════════════════════
