# Supabase Schema Cache Issue - IMMEDIATE FIX NEEDED

## Issue Identified
The Demo Request form is failing because:

1. **Schema Cache Not Updated**: Supabase schema cache shows `Could not find the 'user_name' column` and `Could not find the 'interaction_volume' column`
2. **Missing Anonymous Policy**: Current RLS policies only allow `authenticated` users, but the frontend uses `anon` role

## IMMEDIATE FIXES REQUIRED

### 1. Add Anonymous User Policy
Run this SQL in your Supabase SQL Editor:

```sql
-- Add policy for anonymous users (CRITICAL - this is what frontend uses)
CREATE POLICY "Allow anonymous demo request inserts" ON public.demo_requests
  FOR INSERT
  TO anon
  WITH CHECK (true);
```

### 2. Force Schema Cache Refresh
**Option A: Wait** (5-10 minutes for automatic refresh)

**Option B: Force refresh** by running:
```sql
-- Force refresh the schema cache
NOTIFY pgrst, 'reload schema';
```

**Option C: Restart PostgREST** (if you have access to Supabase dashboard settings)

### 3. Verify Table Exists
Run this to confirm table structure:
```sql
-- Check if table exists with correct structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'demo_requests'
ORDER BY ordinal_position;
```

**Expected Output:**
```
column_name       | data_type                 | is_nullable
------------------+-------------------------+-------------
id               | bigint                   | NO
user_name        | text                     | NO
email            | text                     | NO  
company          | text                     | NO
phone            | text                     | YES
call_volume      | text                     | YES
interaction_volume| text                    | YES
message          | text                     | YES
created_at       | timestamp with time zone | NO
updated_at       | timestamp with time zone | NO
```

### 4. Test After Fix
Once you've added the anonymous policy and the schema cache refreshes, the Demo Request form should work immediately.

## Root Cause Summary
- ✅ Frontend code is correct
- ✅ Schema structure is correct  
- ❌ Missing `anon` user permissions
- ❌ Schema cache outdated

The most likely issue is missing anonymous user permissions since your RLS policies only allow authenticated users, but the frontend form submits as anonymous.