-- Complete Demo Requests Table Setup for Supabase
-- Copy and paste this entire script into your Supabase SQL Editor

-- Create demo_requests table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.demo_requests (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  "User Name" text NOT NULL,
  email text NOT NULL,
  company text NOT NULL,
  phone text,
  call_volume text,
  interaction_volume text,
  message text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Add columns if they don't exist (safe to run multiple times)
DO $$ 
BEGIN
  -- Add call_volume column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'demo_requests' 
    AND column_name = 'call_volume'
  ) THEN
    ALTER TABLE public.demo_requests ADD COLUMN call_volume text;
  END IF;

  -- Add interaction_volume column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'demo_requests' 
    AND column_name = 'interaction_volume'
  ) THEN
    ALTER TABLE public.demo_requests ADD COLUMN interaction_volume text;
  END IF;

  -- Add message column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'demo_requests' 
    AND column_name = 'message'
  ) THEN
    ALTER TABLE public.demo_requests ADD COLUMN message text;
  END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_demo_requests_email ON public.demo_requests(email);
CREATE INDEX IF NOT EXISTS idx_demo_requests_company ON public.demo_requests(company);
CREATE INDEX IF NOT EXISTS idx_demo_requests_created_at ON public.demo_requests(created_at);
CREATE INDEX IF NOT EXISTS idx_demo_requests_call_volume ON public.demo_requests(call_volume);
CREATE INDEX IF NOT EXISTS idx_demo_requests_interaction_volume ON public.demo_requests(interaction_volume);

-- Enable Row Level Security
ALTER TABLE public.demo_requests ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public inserts on demo_requests" ON public.demo_requests;
DROP POLICY IF EXISTS "Allow admin access on demo_requests" ON public.demo_requests;

-- Create RLS policies for demo_requests
-- Policy for inserting new demo requests (anyone can submit)
CREATE POLICY "Allow public inserts on demo_requests" ON public.demo_requests
  FOR INSERT WITH CHECK (true);

-- Policy for admin access to demo_requests
CREATE POLICY "Allow admin access on demo_requests" ON public.demo_requests
  FOR ALL USING (
    current_setting('request.jwt.claims.role', true) = 'admin'
    OR current_setting('request.jwt.claims.sub', true)::uuid IN (
      SELECT id FROM auth.users WHERE email LIKE '%@sentratech.com'
    )
  );

-- Grant permissions
GRANT SELECT, INSERT ON public.demo_requests TO authenticated;
GRANT SELECT, INSERT ON public.demo_requests TO anon;

-- Add comments to columns for documentation
COMMENT ON TABLE public.demo_requests IS 'Demo request submissions from the website';
COMMENT ON COLUMN public.demo_requests."User Name" IS 'Full name of the person requesting demo';
COMMENT ON COLUMN public.demo_requests.email IS 'Work email address';
COMMENT ON COLUMN public.demo_requests.company IS 'Company name';
COMMENT ON COLUMN public.demo_requests.phone IS 'Phone number (optional)';
COMMENT ON COLUMN public.demo_requests.call_volume IS 'Monthly call volume (e.g., "50,000" or "<10k")';
COMMENT ON COLUMN public.demo_requests.interaction_volume IS 'Monthly interaction volume for Chat/SMS/Email/Social (e.g., "75,000" or "10k-50k")';
COMMENT ON COLUMN public.demo_requests.message IS 'Customer support challenges message (optional)';

-- Test the table structure
SELECT 'Demo requests table setup completed successfully!' as status;

-- Show final table structure for verification
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'demo_requests' 
  AND table_schema = 'public'
ORDER BY ordinal_position;