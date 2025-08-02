-- Add email column to profiles table for phone-based login
ALTER TABLE public.profiles ADD COLUMN email TEXT;