-- Add username column for username-based auth mapping
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS username TEXT;

-- Ensure case-insensitive uniqueness on username
CREATE UNIQUE INDEX IF NOT EXISTS profiles_username_unique_lower
ON public.profiles (lower(username));