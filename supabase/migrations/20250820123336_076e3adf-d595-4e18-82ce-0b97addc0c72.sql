-- Fix search path security warnings for database functions

-- Update the handle_new_user function to set search_path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, user_type, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'user_type', 'worker'),
    NEW.email
  );
  RETURN NEW;
END;
$function$;

-- Update the get_worker_public_profile function to set search_path
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
SET search_path = 'public'
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