-- Fix security issue: Restrict profile visibility
-- Drop the overly permissive policy that allows viewing all profiles
DROP POLICY "Users can view all profiles" ON public.profiles;

-- Create a policy that only allows users to view their own profile
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Create a separate policy for employers to view worker profiles (for job applications)
-- This allows employers to see basic worker info when reviewing applications
CREATE POLICY "Employers can view worker profiles for applications" 
ON public.profiles 
FOR SELECT 
USING (
  user_type = 'worker' AND 
  EXISTS (
    SELECT 1 FROM job_applications ja 
    JOIN jobs j ON ja.job_id = j.id 
    WHERE ja.worker_id = profiles.user_id 
    AND j.employer_id = auth.uid()
  )
);