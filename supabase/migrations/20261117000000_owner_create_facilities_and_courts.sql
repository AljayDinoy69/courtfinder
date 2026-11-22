DROP POLICY IF EXISTS owners_insert_own_facilities ON public.facilities;
CREATE POLICY owners_insert_own_facilities
ON public.facilities
FOR INSERT
TO authenticated
WITH CHECK (
  owner_id = (SELECT auth.uid())
  AND EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role = 'owner'
  )
);

DROP POLICY IF EXISTS owners_insert_courts_for_own_facilities ON public.courts;
CREATE POLICY owners_insert_courts_for_own_facilities
ON public.courts
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.facilities
    WHERE facilities.id = facility_id
      AND facilities.owner_id = (SELECT auth.uid())
  )
  AND EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role = 'owner'
  )
);