import Link from "next/link";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import FacilityReviewActions from "@/app/components/admin/facility-review-actions";

export default async function AdminFacilitiesPage() {
  await connection();
  const supabase = await createClient();
  const { data: facilities, error } = await supabase
    .from("facilities")
    .select("id, name, city, province, status, is_verified, created_at")
    .order("created_at", { ascending: false });

  return (
      <main className="min-h-screen bg-[#f5f7f6] px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <Link href="/admin" className="text-sm font-semibold text-[#006cb7] hover:underline">← Dashboard</Link>
          <div className="mt-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#006cb7]">Platform review</p>
              <h1 className="mt-1 font-oswald text-3xl font-bold uppercase text-zinc-950 sm:text-4xl">Facilities</h1>
              <p className="mt-2 text-sm text-zinc-600">Review submissions and publish verified facilities.</p>
            </div>
            <span className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-zinc-600 shadow-sm">{facilities?.length ?? 0} total</span>
          </div>

          {error ? (
            <p role="alert" className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">Unable to load facilities.</p>
          ) : facilities?.length ? (
            <div className="mt-6 space-y-3">
              {facilities.map((facility) => (
                <article key={facility.id} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h2 className="break-words text-base font-bold text-zinc-950">{facility.name}</h2>
                      <p className="mt-1 text-sm text-zinc-500">{[facility.city, facility.province].filter(Boolean).join(", ") || "Location not set"}</p>
                      <p className="mt-2 text-xs text-zinc-500">Submitted {new Date(facility.created_at).toLocaleDateString("en-PH", { dateStyle: "medium" })}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold capitalize text-zinc-700">{facility.status}</span>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${facility.is_verified ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                        {facility.is_verified ? "Verified" : "Needs review"}
                      </span>
                    </div>
                  </div>
                  <FacilityReviewActions facilityId={facility.id} />
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-xl border border-dashed border-zinc-300 bg-white p-10 text-center text-sm text-zinc-500">No facility submissions yet.</div>
          )}
        </div>
      </main>
  );
}