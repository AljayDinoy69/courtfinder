CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  role text NOT NULL DEFAULT 'player'
    CHECK (role IN ('admin', 'owner', 'player')),
  created_at timestamptz NOT NULL DEFAULT now()
);

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
  ON CONFLICT (id) DO UPDATE
  SET
    full_name = EXCLUDED.full_name,
    role = CASE
      WHEN public.profiles.role = 'admin' THEN public.profiles.role
      ELSE EXCLUDED.role
    END;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS court_finder_create_profile ON auth.users;

CREATE TRIGGER court_finder_create_profile
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_auth_user_profile();