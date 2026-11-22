import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import FacilityCard from "@/app/components/facilities/facility-card";

export type FacilitySearchParams = Promise<{
  location?: string;
  sport?: string;
}>;

export const SPORTS = [
  "pickleball",
  "badminton",
  "basketball",
  "tennis",
  "volleyball",
];

export function DirectoryLoading() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((item) => (
        <div key={item} className="h-80 animate-pulse rounded-2xl bg-gray-200" />
      ))}
    </div>
  );
}

export default async function FacilityResults({
  searchParams,
  basePath = "/facilities",
}: {
  searchParams: FacilitySearchParams;
  basePath?: string;
}) {
  const { location = "", sport = "" } = await searchParams;
  const supabase = await createClient();
  const selectedSport = SPORTS.includes(sport.toLowerCase()) ? sport.toLowerCase() : "";

  let query = supabase
    .from("facilities")
    .select(`
      id,
      name,
      description,
      address,
      city,
      province,
      cover_image_url,
      courts!inner (
        id,
        name,
        sport,
        price_per_hour,
        status
      )
    `)
    .eq("status", "published")
    .eq("is_verified", true)
    .eq("courts.status", "active")
    .order("created_at", { ascending: false });

  if (location.trim()) query = query.ilike("city", `%${location.trim()}%`);
  if (selectedSport) query = query.eq("courts.sport", selectedSport);

  const { data: facilities, error } = await query;

  if (error) {
    console.error("Facility directory error:", error.message);
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <h2 className="font-bold text-red-800">Unable to load facilities</h2>
        <p className="mt-2 text-sm text-red-700">
          Please check your Supabase connection, table relationships, and Row Level Security policies.
        </p>
      </div>
    );
  }

  const results = facilities ?? [];

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {results.length} {results.length === 1 ? "facility" : "facilities"} found
        </p>
        <Link href={basePath} className="text-sm font-semibold text-[#006cb7] hover:underline">
          Clear filters
        </Link>
      </div>

      {results.length ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((facility) => <FacilityCard key={facility.id} facility={facility} />)}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
          <div className="mb-4 text-5xl">🏟️</div>
          <h2 className="text-2xl font-bold text-gray-900">No facilities found</h2>
          <p className="mx-auto mt-3 max-w-md text-gray-500">
            We couldn&apos;t find facilities matching your search. Try another city or sport, or check back as more facilities join CourtFinder.
          </p>
          <Link href={basePath} className="mt-6 inline-flex rounded-full bg-[#006cb7] px-6 py-3 font-semibold text-white hover:bg-blue-800">
            Explore all facilities
          </Link>
        </div>
      )}
    </>
  );
}