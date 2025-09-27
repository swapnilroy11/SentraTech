-- DEBUG QUERIES FOR SUPABASE SCHEMA CACHE ISSUE
-- Run these one by one to diagnose the problem

-- 1. Check if demo_requests table exists and its structure
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name = 'demo_requests';

-- 2. Check all columns in demo_requests table
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'demo_requests'
ORDER BY ordinal_position;

-- 3. Check if there are multiple demo_requests tables or schemas
SELECT table_schema, table_name, table_type
FROM information_schema.tables 
WHERE table_name = 'demo_requests';

-- 4. Force schema cache reload (try this multiple times)
NOTIFY pgrst, 'reload schema';

-- 5. Check RLS policies on demo_requests
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'demo_requests';

-- 6. Alternative: Try dropping and recreating the table (BACKUP DATA FIRST!)
-- DROP TABLE IF EXISTS public.demo_requests CASCADE;

-- 7. If cache still not refreshing, try this alternative approach:
-- Create table with different name and update frontend to use new table
-- CREATE TABLE public.demo_requests_v2 (... same structure ...);

-- 8. Check Supabase API directly to see what schema it sees
-- Go to: https://[your-project].supabase.co/rest/v1/?apikey=[your-anon-key]
-- This will show you what tables/columns PostgREST can see