-- Update existing user emails from kaaryasetu.local to ruralink.local domain
UPDATE auth.users 
SET email = REPLACE(email, '@kaaryasetu.local', '@ruralink.local')
WHERE email LIKE '%@kaaryasetu.local';

-- Update corresponding profile emails to match
UPDATE profiles 
SET email = REPLACE(email, '@kaaryasetu.local', '@ruralink.local')
WHERE email LIKE '%@kaaryasetu.local';