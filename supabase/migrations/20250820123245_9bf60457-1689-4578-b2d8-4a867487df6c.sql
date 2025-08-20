-- Create a public view of worker profiles that excludes sensitive information
-- This view will be used by employers to see only job-relevant worker information

CREATE VIEW public.worker_public_profiles AS
SELECT 
  user_id,
  full_name,
  user_type,
  location,
  avatar_url,
  created_at,
  updated_at
FROM public.profiles
WHERE user_type = 'worker';

-- Enable RLS on the view
ALTER TABLE public.worker_public_profiles ENABLE ROW LEVEL SECURITY;

-- Create policy for employers to view public worker profiles for their job applications
CREATE POLICY "Employers can view public worker profiles for applications" 
ON public.worker_public_profiles 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1
    FROM job_applications ja
    JOIN jobs j ON (ja.job_id = j.id)
    WHERE ja.worker_id = worker_public_profiles.user_id 
    AND j.employer_id = auth.uid()
  )
);

-- Remove the existing policy that exposes sensitive data
DROP POLICY "Employers can view worker profiles for applications" ON public.profiles;

-- Create a more restrictive policy on the main profiles table
-- Employers can only see their own profile, workers can see their own profile
CREATE POLICY "Users can only view their own full profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);