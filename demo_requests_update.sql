-- Add Call Volume and Interaction Volume columns to demo_requests table
-- Run this SQL in your Supabase SQL Editor

-- Add the two new columns to the demo_requests table
ALTER TABLE public.demo_requests 
ADD COLUMN call_volume text,
ADD COLUMN interaction_volume text;

-- Add comments to describe the columns
COMMENT ON COLUMN public.demo_requests.call_volume IS 'Monthly call volume (e.g., "50,000" or "<10k")';
COMMENT ON COLUMN public.demo_requests.interaction_volume IS 'Monthly interaction volume for Chat/SMS/Email/Social (e.g., "75,000" or "10k-50k")';

-- Create indexes for better query performance on the new columns
CREATE INDEX idx_demo_requests_call_volume ON public.demo_requests(call_volume);
CREATE INDEX idx_demo_requests_interaction_volume ON public.demo_requests(interaction_volume);

-- Verify the table structure (optional - for verification)
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'demo_requests' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- Success message
SELECT 'Demo requests table updated successfully with call_volume and interaction_volume columns!' as status;