-- Add role metadata to an existing Transformation Studio database.
-- Run this once in Supabase SQL Editor.

ALTER TABLE public.roles
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS permissions JSONB NOT NULL DEFAULT '{}'::JSONB,
  ADD COLUMN IF NOT EXISTS active BOOLEAN NOT NULL DEFAULT true;

-- Optional defaults for the built-in roles.
UPDATE public.roles
SET
  description = CASE LOWER(name)
    WHEN 'admin' THEN 'Full system access'
    WHEN 'analyst' THEN 'Can create and edit catalogues'
    WHEN 'viewer' THEN 'Read-only access'
    ELSE description
  END,
  permissions = CASE LOWER(name)
    WHEN 'admin' THEN '{"create": true, "edit": true, "delete": true, "admin": true, "export": true}'::JSONB
    WHEN 'analyst' THEN '{"create": true, "edit": true, "delete": false, "admin": false, "export": true}'::JSONB
    WHEN 'viewer' THEN '{"create": false, "edit": false, "delete": false, "admin": false, "export": true}'::JSONB
    ELSE permissions
  END
WHERE LOWER(name) IN ('admin', 'analyst', 'viewer');

-- Verify the resulting roles.
SELECT id, name, description, permissions, active
FROM public.roles
ORDER BY name;

-- Add the tables and JSON fields used by the pricing and planner screens.
ALTER TABLE public.catalogues
  ADD COLUMN IF NOT EXISTS tiers JSONB DEFAULT '[]'::JSONB,
  ADD COLUMN IF NOT EXISTS estimates JSONB DEFAULT '[]'::JSONB;

CREATE TABLE IF NOT EXISTS public.pricing_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  category TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.pricing_types
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS icon TEXT,
  ADD COLUMN IF NOT EXISTS category TEXT,
  ADD COLUMN IF NOT EXISTS active BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT now();

UPDATE public.pricing_types
SET category = COALESCE(category, 'Consulting')
WHERE category IS NULL;

ALTER TABLE public.pricing_types
  ALTER COLUMN category SET DEFAULT 'Consulting';

CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  start_date DATE,
  end_date DATE,
  status TEXT NOT NULL DEFAULT 'active',
  phases JSONB NOT NULL DEFAULT '[]'::JSONB,
  wbs JSONB NOT NULL DEFAULT '[]'::JSONB,
  team JSONB NOT NULL DEFAULT '[]'::JSONB,
  raci JSONB NOT NULL DEFAULT '[]'::JSONB,
  milestones JSONB NOT NULL DEFAULT '[]'::JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS start_date DATE,
  ADD COLUMN IF NOT EXISTS end_date DATE,
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS phases JSONB NOT NULL DEFAULT '[]'::JSONB,
  ADD COLUMN IF NOT EXISTS wbs JSONB NOT NULL DEFAULT '[]'::JSONB,
  ADD COLUMN IF NOT EXISTS team JSONB NOT NULL DEFAULT '[]'::JSONB,
  ADD COLUMN IF NOT EXISTS raci JSONB NOT NULL DEFAULT '[]'::JSONB,
  ADD COLUMN IF NOT EXISTS milestones JSONB NOT NULL DEFAULT '[]'::JSONB,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();

CREATE INDEX IF NOT EXISTS idx_pricing_types_category ON public.pricing_types(category);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
