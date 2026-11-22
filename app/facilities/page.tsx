
import { Suspense } from "react";
import Link from "next/link";
import FacilityResults, {
  DirectoryLoading,
  SPORTS,
  type FacilitySearchParams,
} from "@/app/components/facilities/facility-results";

export default function FacilitiesPage({
  searchParams,
}: {
  searchParams: FacilitySearchParams;
}) {
  return (
    <main className="min-h-screen bg-[#f5f5f5] px-4 py-12 md:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Page heading */}
        <div className="mb-10">
          <Link
            href="/"
            className="text-sm font-semibold text-[#006cb7]"
          >
            ← Back to home
          </Link>

          <p className="mt-8 text-sm font-bold uppercase tracking-[0.2em] text-[#008840]">
            Explore CourtFinder
          </p>

          <h1 className="mt-2 font-oswald text-5xl font-bold uppercase text-gray-900 md:text-6xl">
            FIND YOUR COURT.
            <br />
            PLAY YOUR GAME.
          </h1>

          <p className="mt-4 max-w-2xl text-gray-600">
            Discover sports facilities around you. Find the right
            court for your next game.
          </p>
        </div>

        {/* Search and filters */}
        <form
          action="/facilities"
          method="GET"
          className="mb-10 grid gap-4 rounded-2xl bg-white p-5 shadow-sm md:grid-cols-[1fr_1fr_auto]"
        >
          <div>
            <label
              htmlFor="location"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Location
            </label>

            <input
              id="location"
              name="location"
              type="text"
              placeholder="Search city, e.g. Cebu"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#006cb7] focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label
              htmlFor="sport"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Sport
            </label>

            <select
              id="sport"
              name="sport"
              defaultValue=""
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-[#006cb7] focus:ring-2 focus:ring-blue-100"
            >
              <option value="">All sports</option>
              {SPORTS.map((item) => (
                <option key={item} value={item}>
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full rounded-xl bg-[#006cb7] px-8 py-3 font-bold text-white transition hover:bg-blue-800"
            >
              Search Courts
            </button>
          </div>
        </form>

        {/* Facilities */}
        <section>
          <div className="mb-6">
            <h2 className="font-oswald text-3xl font-bold uppercase text-gray-900">
              Explore Facilities
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Find a place to play your favorite sport.
            </p>
          </div>

          <Suspense fallback={<DirectoryLoading />}>
            <FacilityResults searchParams={searchParams} />
          </Suspense>
        </section>

        {/* Owner CTA */}
        <section className="mt-20 rounded-3xl bg-gray-900 px-6 py-12 text-white md:px-12">
          <p className="text-sm font-bold uppercase tracking-widest text-green-400">
            Facility owners
          </p>

          <h2 className="mt-3 font-oswald text-4xl font-bold uppercase md:text-5xl">
            Bring your facility online.
          </h2>

          <p className="mt-4 max-w-xl text-gray-300">
            List your sports facility on CourtFinder and help players
            discover your courts.
          </p>

          <Link
            href="/owner"
            className="mt-7 inline-flex rounded-full bg-[#008840] px-7 py-3 font-bold text-white transition hover:bg-green-700"
          >
            List Your Facility
          </Link>
        </section>
      </div>
    </main>
  );
}
