import { Suspense } from "react";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import FacilityResults, {
  DirectoryLoading,
  SPORTS,
  type FacilitySearchParams,
} from "@/app/components/facilities/facility-results";
import { createClient } from "@/lib/supabase/server";

export default async function PlayerFacilitiesPage({
  searchParams,
}: {
  searchParams: FacilitySearchParams;
}) {
  return (
    <Suspense fallback={<PlayerFacilitiesLoading />}>
      <PlayerFacilitiesContent searchParams={searchParams} />
    </Suspense>
  );
}

async function PlayerFacilitiesContent({
  searchParams,
}: {
  searchParams: FacilitySearchParams;
}) {
  await connection();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const params = await searchParams;

  return (
    <main className="min-h-screen bg-[#f5f7f6] px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#006cb7]">Find your next match</p>
        <h1 className="mt-1 font-oswald text-3xl font-bold uppercase text-zinc-950 sm:text-4xl">Explore courts</h1>
        <p className="mt-2 text-sm text-zinc-600">Search verified facilities and available courts.</p>

        <form
          action="/dashboard/player/facilities"
          method="GET"
          className="mt-6 grid gap-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_1fr_auto]"
        >
          <label className="text-sm font-semibold text-zinc-700">
            Location
            <input
              name="location"
              type="search"
              defaultValue={params.location || ""}
              placeholder="City or province"
              className="mt-2 min-h-11 w-full rounded-lg border border-zinc-300 px-3 font-normal outline-none focus:border-[#006cb7] focus:ring-2 focus:ring-[#006cb7]/15"
            />
          </label>
          <label className="text-sm font-semibold text-zinc-700">
            Sport
            <select
              name="sport"
              defaultValue={params.sport || ""}
              className="mt-2 min-h-11 w-full rounded-lg border border-zinc-300 bg-white px-3 font-normal outline-none focus:border-[#006cb7] focus:ring-2 focus:ring-[#006cb7]/15"
            >
              <option value="">All sports</option>
              {SPORTS.map((sport) => (
                <option key={sport} value={sport}>{sport[0].toUpperCase() + sport.slice(1)}</option>
              ))}
            </select>
          </label>
          <div className="flex items-end">
            <button type="submit" className="min-h-11 w-full rounded-lg bg-[#006cb7] px-5 text-sm font-bold text-white hover:bg-[#005088] md:w-auto">
              Search courts
            </button>
          </div>
        </form>

        <section className="mt-7">
          <Suspense fallback={<DirectoryLoading />}>
            <FacilityResults
              searchParams={searchParams}
              basePath="/dashboard/player/facilities"
            />
          </Suspense>
        </section>
      </div>
    </main>
  );
}

function PlayerFacilitiesLoading() {
  return (
    <main className="min-h-screen bg-[#f5f7f6] px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#006cb7]">Find your next match</p>
        <h1 className="mt-1 font-oswald text-3xl font-bold uppercase text-zinc-950 sm:text-4xl">Explore courts</h1>
        <p className="mt-2 text-sm text-zinc-600">Search verified facilities and available courts.</p>
        <div className="mt-6 grid gap-3 rounded-xl border border-zinc-200 bg-white p-4 md:grid-cols-[1fr_1fr_auto]">
          <div className="h-16 animate-pulse rounded-lg bg-zinc-100" />
          <div className="h-16 animate-pulse rounded-lg bg-zinc-100" />
          <div className="h-11 animate-pulse rounded-lg bg-[#dbeaf2]" />
        </div>
        <section className="mt-7">
          <DirectoryLoading />
        </section>
      </div>
    </main>
  );
}