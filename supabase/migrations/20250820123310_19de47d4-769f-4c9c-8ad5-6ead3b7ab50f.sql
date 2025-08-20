-- Create a security definer function that returns only safe worker profile data
-- This prevents employers from accessing sensitive information like email and phone

CREATE OR REPLACE FUNCTION public.get_worker_public_profile(worker_user_id uuid)
RETURNS TABLE (
  user_id uuid,
  full_name text,
  user_type text,
  location text,
  avatar_url text,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
)
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT 
    p.user_id,
    p.full_name,
    p.user_type,
    p.location,
    p.avatar_url,
    p.created_at,
    p.updated_at
  FROM public.profiles p
  WHERE p.user_id = worker_user_id 
  AND p.user_type = 'worker'
  AND EXISTS (
    SELECT 1
    FROM job_applications ja
    JOIN jobs j ON (ja.job_id = j.id)
    WHERE ja.worker_id = worker_user_id 
    AND j.employer_id = auth.uid()
  );
$$;

-- Remove the existing policy that exposes sensitive data
DROP POLICY IF EXISTS "Employers can view worker profiles for applications" ON public.profiles;

-- Create a more restrictive policy on the main profiles table
-- Users can only see their own full profile
CREATE POLICY "Users can only view their own full profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);