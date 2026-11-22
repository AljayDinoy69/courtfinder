DROP POLICY IF EXISTS users_select_own_profile ON public.profiles;
CREATE POLICY users_select_own_profile
ON public.profiles
FOR SELECT
TO authenticated
USING (id = (SELECT auth.uid()));

DROP POLICY IF EXISTS owners_select_own_facilities ON public.facilities;
CREATE POLICY owners_select_own_facilities
ON public.facilities
FOR SELECT
TO authenticated
USING (
  owner_id = (SELECT auth.uid())
  AND EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role = 'owner'
  )
);