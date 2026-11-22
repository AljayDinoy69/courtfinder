import Link from "next/link";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import DashboardMetric from "@/app/components/dashboard/dashboard-metric";
import FacilityReviewSubmit from "@/app/components/owner/facility-review-submit";

export default async function OwnerFacilitiesPage() {
  await connection();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: facilities, error } = await supabase
    .from("facilities")
    .select("id, name, city, province, status, is_verified, created_at")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false });
  const facilityIds = (facilities || []).map((facility) => facility.id);
  const { data: courts } = facilityIds.length
    ? await supabase.from("courts").select("id, facility_id, status").in("facility_id", facilityIds)
    : { data: [] };

  return (
      <main className="min-h-screen bg-[#f5f7f6] px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <Link href="/dashboard/owner" className="text-sm font-semibold text-[#006cb7] hover:underline">← Overview</Link>
          <div className="mt-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#006cb7]">Your portfolio</p>
              <h1 className="mt-1 font-oswald text-3xl font-bold uppercase text-zinc-950 sm:text-4xl">My facilities</h1>
              <p className="mt-2 text-sm text-zinc-600">Track listing status and court availability.</p>
            </div>
            <Link href="/dashboard/owner/facilities/new" className="inline-flex min-h-11 items-center rounded-lg bg-[#008840] px-4 text-sm font-bold text-white hover:bg-[#006c34]">Add facility +</Link>
          </div>

          <section className="mt-6 grid gap-3 sm:grid-cols-3">
            <DashboardMetric label="Facilities" value={facilities?.length ?? 0} icon="▦" detail="Locations in your portfolio" tone="blue" />
            <DashboardMetric label="Courts" value={courts?.length ?? 0} icon="⌖" detail="Across your locations" tone="green" />
            <DashboardMetric label="Active courts" value={courts?.filter((court) => court.status === "active").length ?? 0} icon="✓" detail="Currently bookable" tone="amber" />
          </section>

          {error ? (
            <p role="alert" className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">Unable to load your facilities. Apply the owner facility and court select policies, and verify Row Level Security is configured.</p>
          ) : facilities?.length ? (
            <div className="mt-6 grid gap-3 lg:grid-cols-2">
              {facilities.map((facility) => {
                const facilityCourts = (courts || []).filter((court) => court.facility_id === facility.id);
                return (
                  <article key={facility.id} className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h2 className="break-words text-lg font-bold text-zinc-950">{facility.name}</h2>
                        <p className="mt-1 text-sm text-zinc-500">{[facility.city, facility.province].filter(Boolean).join(", ") || "Location not set"}</p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${facility.status === "published" && facility.is_verified ? "bg-emerald-50 text-emerald-700" : facility.status === "pending" ? "bg-blue-50 text-blue-700" : "bg-amber-50 text-amber-700"}`}>
                        {facility.status === "published" && facility.is_verified ? "Available to players" : facility.status === "pending" ? "Awaiting Admin review" : "Draft · not public"}
                      </span>
                    </div>
                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-100 pt-4">
                      <p className="text-sm text-zinc-600"><span className="font-semibold text-zinc-900">{facilityCourts.length}</span> courts · <span className="capitalize">{facility.status}</span></p>
                      <div className="flex flex-wrap gap-3">
                        <Link href={`/dashboard/owner/facilities/${facility.id}/courts/new`} className="text-sm font-semibold text-[#008840] hover:underline">Add court +</Link>
                        {facility.status === "published" && facility.is_verified && (
                          <Link href={`/facilities/${facility.id}`} className="text-sm font-semibold text-[#006cb7] hover:underline">View public listing ↗</Link>
                        )}
                      </div>
                    </div>
                    {facility.status === "draft" && (
                      <div className="mt-4 border-t border-zinc-100 pt-4">
                        <FacilityReviewSubmit facilityId={facility.id} />
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="mt-6 rounded-xl border border-dashed border-zinc-300 bg-white p-10 text-center">
              <h2 className="font-semibold text-zinc-900">No facilities yet</h2>
              <p className="mt-1 text-sm text-zinc-500">Add a facility to start listing your courts.</p>
              <Link href="/dashboard/owner/facilities/new" className="mt-4 inline-flex min-h-10 items-center rounded-lg bg-[#008840] px-4 text-sm font-bold text-white">Add facility</Link>
            </div>
          )}
        </div>
      </main>
  );
}