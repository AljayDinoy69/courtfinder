import Link from "next/link";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import BookingActions from "@/app/components/owner/booking-actions";

export default async function OwnerBookingsPage() {
  await connection();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: facilities } = await supabase.from("facilities").select("id, name").eq("owner_id", user.id);
  const facilityIds = (facilities || []).map((facility) => facility.id);
  const { data: courts } = facilityIds.length
    ? await supabase.from("courts").select("id, name, facility_id, sport").in("facility_id", facilityIds)
    : { data: [] };
  const courtIds = (courts || []).map((court) => court.id);
  const { data: bookings, error } = courtIds.length
    ? await supabase.from("bookings").select("id, user_id, court_id, status, start_at, end_at, total_price, notes, created_at").in("court_id", courtIds).order("created_at", { ascending: false })
    : { data: [], error: null };
  const playerIds = [...new Set((bookings || []).map((booking) => booking.user_id))];
  const { data: players } = playerIds.length
    ? await supabase.from("profiles").select("id, full_name").in("id", playerIds)
    : { data: [] };
  const courtById = new Map((courts || []).map((court) => [court.id, court]));
  const facilityById = new Map((facilities || []).map((facility) => [facility.id, facility]));
  const playerById = new Map((players || []).map((player) => [player.id, player.full_name]));

  return (
      <main className="min-h-screen bg-[#f5f7f6] px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <Link href="/dashboard/owner" className="text-sm font-semibold text-[#006cb7] hover:underline">← Overview</Link>
          <div className="mt-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#006cb7]">Reservations</p>
            <h1 className="mt-1 font-oswald text-3xl font-bold uppercase text-zinc-950 sm:text-4xl">Booking requests</h1>
            <p className="mt-2 text-sm text-zinc-600">Confirm or reject pending reservations for your courts.</p>
          </div>

          {error ? (
            <p role="alert" className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">Unable to load booking requests.</p>
          ) : bookings?.length ? (
            <div className="mt-6 space-y-3">
              {bookings.map((booking) => {
                const court = courtById.get(booking.court_id);
                const facility = court ? facilityById.get(court.facility_id) : null;
                return (
                  <article key={booking.id} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-5">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <h2 className="text-base font-bold text-zinc-950">{court?.name || "Court"}</h2>
                        <p className="mt-1 text-sm text-zinc-500">{facility?.name || "Facility"}{court?.sport ? ` · ${court.sport}` : ""}</p>
                        <p className="mt-2 text-sm text-zinc-600">Player: <span className="font-semibold text-zinc-900">{playerById.get(booking.user_id) || "Player"}</span></p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-zinc-950">₱{Number(booking.total_price || 0).toLocaleString("en-PH")}</p>
                        <span className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-semibold capitalize ${booking.status === "confirmed" ? "bg-emerald-50 text-emerald-700" : booking.status === "pending" ? "bg-amber-50 text-amber-700" : "bg-zinc-100 text-zinc-600"}`}>{booking.status}</span>
                      </div>
                    </div>
                    <div className="mt-4 grid gap-3 border-t border-zinc-100 pt-4 text-sm sm:grid-cols-2">
                      <p><span className="text-zinc-500">Start</span><br />{booking.start_at ? new Date(booking.start_at).toLocaleString("en-PH", { dateStyle: "medium", timeStyle: "short" }) : "Not set"}</p>
                      <p><span className="text-zinc-500">End</span><br />{booking.end_at ? new Date(booking.end_at).toLocaleString("en-PH", { dateStyle: "medium", timeStyle: "short" }) : "Not set"}</p>
                    </div>
                    {booking.notes && <p className="mt-3 rounded-lg bg-zinc-50 p-3 text-sm text-zinc-600">{booking.notes}</p>}
                    {booking.status === "pending" && <BookingActions bookingId={booking.id} />}
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="mt-6 rounded-xl border border-dashed border-zinc-300 bg-white p-10 text-center text-sm text-zinc-500">No booking requests for your facilities yet.</div>
          )}
        </div>
      </main>
  );
}