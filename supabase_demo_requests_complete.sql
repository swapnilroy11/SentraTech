-- Complete Demo Requests Table Setup for Supabase
-- Copy this entire script and paste it into Supabase SQL Editor, then click RUN

-- Drop table if exists (optional - uncomment if you want to start fresh)
-- DROP TABLE IF EXISTS public.demo_requests CASCADE;

-- Create demo_requests table
CREATE TABLE public.demo_requests (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    "User Name" text NOT NULL,
    email text NOT NULL,
    company text NOT NULL,
    phone text,
    call_volume text,
    interaction_volume text,
    message text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT demo_requests_pkey PRIMARY KEY (id)
);

-- Create indexes for better performance
CREATE INDEX idx_demo_requests_id ON public.demo_requests USING btree (id);
CREATE INDEX idx_demo_requests_email ON public.demo_requests USING btree (email);
CREATE INDEX idx_demo_requests_company ON public.demo_requests USING btree (company);
CREATE INDEX idx_demo_requests_created_at ON public.demo_requests USING btree (created_at);

-- Enable Row Level Security
ALTER TABLE public.demo_requests ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable insert for demo requests" ON public.demo_requests;
DROP POLICY IF EXISTS "Enable read for demo requests" ON public.demo_requests;
DROP POLICY IF EXISTS "Allow public demo request inserts" ON public.demo_requests;

-- Create policy to allow anyone to insert demo requests
CREATE POLICY "Allow public demo request inserts" ON public.demo_requests
    FOR INSERT 
    WITH CHECK (true);

-- Create policy to allow admins to read demo requests
CREATE POLICY "Enable read for demo requests" ON public.demo_requests
    FOR SELECT 
    USING (
        current_setting('request.jwt.claims.role', true) = 'admin'
        OR 
        current_setting('request.jwt.claims.email', true) LIKE '%@sentratech.com'
    );

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

GRANT SELECT, INSERT ON TABLE public.demo_requests TO anon;
GRANT SELECT, INSERT ON TABLE public.demo_requests TO authenticated;
GRANT ALL ON TABLE public.demo_requests TO service_role;

-- Grant sequence permissions (for UUID generation)
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Add table and column comments for documentation
COMMENT ON TABLE public.demo_requests IS 'Demo request submissions from website contact forms';
COMMENT ON COLUMN public.demo_requests.id IS 'Unique identifier for each demo request';
COMMENT ON COLUMN public.demo_requests."User Name" IS 'Full name of person requesting demo';
COMMENT ON COLUMN public.demo_requests.email IS 'Work email address';
COMMENT ON COLUMN public.demo_requests.company IS 'Company or organization name';
COMMENT ON COLUMN public.demo_requests.phone IS 'Phone number (optional)';
COMMENT ON COLUMN public.demo_requests.call_volume IS 'Monthly call volume (e.g. 50000, <10k, 10k-50k)';
COMMENT ON COLUMN public.demo_requests.interaction_volume IS 'Monthly interaction volume for Chat/SMS/Email/Social';
COMMENT ON COLUMN public.demo_requests.message IS 'Custom message about support challenges (optional)';
COMMENT ON COLUMN public.demo_requests.created_at IS 'Timestamp when record was created';
COMMENT ON COLUMN public.demo_requests.updated_at IS 'Timestamp when record was last updated';

-- Insert a test record to verify everything works
INSERT INTO public.demo_requests ("User Name", email, company, phone, call_volume, interaction_volume, message) 
VALUES ('Test User', 'test@example.com', 'Test Company', '+1234567890', '25000', '40000', 'This is a test demo request');

-- Verify the table was created correctly
SELECT 'SUCCESS: Demo requests table created and configured!' as status;

-- Show the table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'demo_requests'
ORDER BY ordinal_position;

-- Show the test record
SELECT * FROM public.demo_requests WHERE email = 'test@example.com';