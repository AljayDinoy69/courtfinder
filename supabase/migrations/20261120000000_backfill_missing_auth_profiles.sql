CREATE OR REPLACE FUNCTION public.handle_new_auth_user_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  assigned_role text;
BEGIN
  assigned_role := CASE
    WHEN NEW.raw_user_meta_data ->> 'role' = 'owner' THEN 'owner'
    ELSE 'player'
  END;

  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(
      NULLIF(NEW.raw_user_meta_data ->> 'full_name', ''),
      split_part(COALESCE(NEW.email, ''), '@', 1)
    ),
    assigned_role
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS court_finder_create_profile ON auth.users;

CREATE TRIGGER court_finder_create_profile
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_auth_user_profile();

INSERT INTO public.profiles (id, full_name, role)
SELECT
  users.id,
  COALESCE(
    NULLIF(users.raw_user_meta_data ->> 'full_name', ''),
    split_part(COALESCE(users.email, ''), '@', 1)
  ),
  CASE
    WHEN users.raw_user_meta_data ->> 'role' = 'owner' THEN 'owner'
    ELSE 'player'
  END
FROM auth.users AS users
LEFT JOIN public.profiles AS profiles ON profiles.id = users.id
WHERE profiles.id IS NULL
ON CONFLICT (id) DO NOTHING;