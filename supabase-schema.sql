-- Create clients table (without foreign key to jobs initially)
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  current_job_id UUID, -- Will add foreign key constraint after jobs table is created
  number_of_jobs INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  job_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  location JSONB NOT NULL, -- [longitude, latitude] as JSON array
  review TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  description TEXT,
  scheduled_date TIMESTAMP WITH TIME ZONE,
  completed_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add foreign key constraint to clients.current_job_id after jobs table exists
-- Only add if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_current_job'
  ) THEN
    ALTER TABLE clients
      ADD CONSTRAINT fk_current_job
      FOREIGN KEY (current_job_id) REFERENCES jobs(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Create index on client_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_jobs_client_id ON jobs(client_id);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);

-- Create index on location for spatial queries (if using PostGIS)
-- CREATE INDEX IF NOT EXISTS idx_jobs_location ON jobs USING GIST(location);

-- Function to increment job count
CREATE OR REPLACE FUNCTION increment_job_count(client_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE clients
  SET number_of_jobs = number_of_jobs + 1,
      updated_at = NOW()
  WHERE id = client_id;
END;
$$ LANGUAGE plpgsql;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at on clients
CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON clients
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger to automatically update updated_at on jobs
CREATE TRIGGER update_jobs_updated_at
  BEFORE UPDATE ON jobs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS) - adjust policies as needed
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- Example RLS policies (adjust based on your authentication needs)
-- Allow all operations for now (you should restrict this in production)
CREATE POLICY "Allow all operations on clients" ON clients
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on jobs" ON jobs
  FOR ALL USING (true) WITH CHECK (true);

-- Create potential_clients table
CREATE TABLE IF NOT EXISTS potential_clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_potential_clients_email ON potential_clients(email);

-- Trigger to automatically update updated_at on potential_clients
CREATE TRIGGER update_potential_clients_updated_at
  BEFORE UPDATE ON potential_clients
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS) for potential_clients
ALTER TABLE potential_clients ENABLE ROW LEVEL SECURITY;

-- RLS policy for potential_clients
CREATE POLICY "Allow all operations on potential_clients" ON potential_clients
  FOR ALL USING (true) WITH CHECK (true);

-- Create job_applications table
CREATE TABLE IF NOT EXISTS job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  position TEXT, -- Made optional since form field was removed
  message TEXT,
  cv_file_name TEXT NOT NULL,
  cv_file_type TEXT NOT NULL,
  cv_file_url TEXT, -- URL to file in Supabase Storage (if using storage)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_job_applications_email ON job_applications(email);

-- Create index on position for filtering
CREATE INDEX IF NOT EXISTS idx_job_applications_position ON job_applications(position);

-- Trigger to automatically update updated_at on job_applications
CREATE TRIGGER update_job_applications_updated_at
  BEFORE UPDATE ON job_applications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS) for job_applications
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;

-- RLS policy for job_applications
CREATE POLICY "Allow all operations on job_applications" ON job_applications
  FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE potential_clients
  ADD COLUMN IF NOT EXISTS referred_by_referral_profile_id UUID,
  ADD COLUMN IF NOT EXISTS referral_discount_percent INTEGER;

CREATE TABLE IF NOT EXISTS referral_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  referral_code TEXT NOT NULL UNIQUE,
  referral_count INTEGER NOT NULL DEFAULT 0,
  reward_percent INTEGER NOT NULL DEFAULT 20,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS referral_conversions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referral_profile_id UUID NOT NULL REFERENCES referral_profiles(id) ON DELETE CASCADE,
  potential_client_id UUID NOT NULL REFERENCES potential_clients(id) ON DELETE CASCADE,
  referred_email TEXT NOT NULL,
  referrer_reward_percent INTEGER NOT NULL DEFAULT 20,
  referred_reward_percent INTEGER NOT NULL DEFAULT 20,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (referral_profile_id, referred_email)
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'fk_potential_clients_referral_profile'
  ) THEN
    ALTER TABLE potential_clients
      ADD CONSTRAINT fk_potential_clients_referral_profile
      FOREIGN KEY (referred_by_referral_profile_id)
      REFERENCES referral_profiles(id)
      ON DELETE SET NULL;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_referral_profiles_code ON referral_profiles(referral_code);
CREATE INDEX IF NOT EXISTS idx_referral_conversions_referral_profile_id ON referral_conversions(referral_profile_id);
CREATE INDEX IF NOT EXISTS idx_referral_conversions_referred_email ON referral_conversions(referred_email);

CREATE OR REPLACE FUNCTION increment_referral_count(referral_profile_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE referral_profiles
  SET referral_count = referral_count + 1,
      updated_at = NOW()
  WHERE id = referral_profile_id;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_referral_profiles_updated_at'
  ) THEN
    CREATE TRIGGER update_referral_profiles_updated_at
      BEFORE UPDATE ON referral_profiles
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

ALTER TABLE referral_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_conversions ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'referral_profiles'
      AND policyname = 'Allow all operations on referral_profiles'
  ) THEN
    CREATE POLICY "Allow all operations on referral_profiles" ON referral_profiles
      FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'referral_conversions'
      AND policyname = 'Allow all operations on referral_conversions'
  ) THEN
    CREATE POLICY "Allow all operations on referral_conversions" ON referral_conversions
      FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;
