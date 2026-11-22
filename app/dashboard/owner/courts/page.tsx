import Link from "next/link";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";

export default async function OwnerCourtsPage() {
  await connection();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: facilities, error: facilityError } = await supabase
    .from("facilities")
    .select("id, name, city, status")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false });
  const facilityIds = (facilities || []).map((facility) => facility.id);
  const { data: courts, error: courtError } = facilityIds.length
    ? await supabase.from("courts").select("id, name, sport, price_per_hour, status, facility_id").in("facility_id", facilityIds)
    : { data: [], error: null };
  return (
    <main className="min-h-screen bg-[#f5f7f6] px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <Link href="/dashboard/owner" className="text-sm font-semibold text-[#006cb7] hover:underline">← Overview</Link>
        <div className="mt-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#006cb7]">Court inventory</p>
            <h1 className="mt-1 font-oswald text-3xl font-bold uppercase text-zinc-950 sm:text-4xl">Manage courts</h1>
            <p className="mt-2 text-sm text-zinc-600">Add courts to your facilities and review their hourly rates.</p>
          </div>
          <Link href="/dashboard/owner/facilities" className="inline-flex min-h-10 items-center rounded-lg border border-zinc-300 bg-white px-4 text-sm font-semibold text-zinc-700 hover:bg-zinc-50">View facilities</Link>
        </div>

        {facilityError || courtError ? (
          <p role="alert" className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">Unable to load your courts.</p>
        ) : facilities?.length ? (
          <div className="mt-6 space-y-4">
            {facilities.map((facility) => {
              const facilityCourts = (courts || []).filter((court) => court.facility_id === facility.id);
              return (
                <section key={facility.id} className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
                  <header className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 p-4 sm:p-5">
                    <div>
                      <h2 className="font-bold text-zinc-950">{facility.name}</h2>
                      <p className="mt-1 text-xs text-zinc-500">{facility.city || "Location not set"} · {facility.status}</p>
                    </div>
                    <Link href={`/dashboard/owner/facilities/${facility.id}/courts/new`} className="inline-flex min-h-10 items-center rounded-lg bg-[#008840] px-4 text-sm font-bold text-white hover:bg-[#006c34]">Add court +</Link>
                  </header>
                  {facilityCourts.length ? (
                    <div className="divide-y divide-zinc-100">
                      {facilityCourts.map((court) => (
                        <article key={court.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-5">
                          <div>
                            <h3 className="text-sm font-semibold text-zinc-900">{court.name}</h3>
                            <p className="mt-1 text-xs capitalize text-zinc-500">{court.sport}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-bold text-zinc-900">₱{Number(court.price_per_hour || 0).toLocaleString("en-PH")} / hr</span>
                            <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold capitalize ${court.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-zinc-100 text-zinc-600"}`}>{court.status}</span>
                          </div>
                        </article>
                      ))}
                    </div>
                  ) : (
                    <p className="px-5 py-6 text-sm text-zinc-500">No courts added to this facility yet.</p>
                  )}
                </section>
              );
            })}
          </div>
        ) : (
          <div className="mt-6 rounded-xl border border-dashed border-zinc-300 bg-white p-10 text-center">
            <h2 className="font-semibold text-zinc-900">Add a facility first</h2>
            <p className="mt-1 text-sm text-zinc-500">Courts belong to a facility, so create the location before adding courts.</p>
            <Link href="/dashboard/owner/facilities/new" className="mt-4 inline-flex min-h-10 items-center rounded-lg bg-[#008840] px-4 text-sm font-bold text-white">Add facility</Link>
          </div>
        )}
      </div>
    </main>
  );
}