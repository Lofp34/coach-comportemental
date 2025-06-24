ALTER TABLE public.test_results ADD COLUMN profile_name TEXT;
UPDATE public.test_results SET profile_name = 'Mon Profil' WHERE profile_name IS NULL;
ALTER TABLE public.test_results ALTER COLUMN profile_name SET NOT NULL; 