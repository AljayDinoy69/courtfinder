DROP POLICY IF EXISTS owners_select_own_facilities ON public.facilities;
CREATE POLICY owners_select_own_facilities
ON public.facilities
FOR SELECT
TO authenticated
USING (
  owner_id = (SELECT auth.uid())
  AND status IN ('draft', 'pending')
  AND EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role = 'owner'
  )
);

DROP POLICY IF EXISTS owners_update_own_facility_for_review ON public.facilities;
CREATE POLICY owners_update_own_facility_for_review
ON public.facilities
FOR UPDATE
TO authenticated
USING (
  owner_id = (SELECT auth.uid())
  AND EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role = 'owner'
  )
)
WITH CHECK (
  owner_id = (SELECT auth.uid())
  AND status IN ('draft', 'pending')
  AND is_verified = false
  AND (
    status = 'draft'
    OR EXISTS (
      SELECT 1
      FROM public.courts
      WHERE courts.facility_id = facilities.id
    )
  )
  AND EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role = 'owner'
  )
);

DROP POLICY IF EXISTS owners_select_courts_for_own_facilities ON public.courts;
CREATE POLICY owners_select_courts_for_own_facilities
ON public.courts
FOR SELECT
TO authenticated
USING (
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