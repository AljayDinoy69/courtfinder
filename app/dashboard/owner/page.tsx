
import Link from "next/link";
import { connection } from "next/server";
import DashboardWelcome from "@/app/components/dashboard/dashboard-welcome";
import DashboardMetric from "@/app/components/dashboard/dashboard-metric";
import BookingActivity, { type DashboardBooking } from "@/app/components/dashboard/booking-activity";
import { getDashboardUser } from "@/lib/auth/dashboard-user";

export default async function OwnerDashboard() {
  await connection();
  const { supabase, user, profile } = await getDashboardUser("owner");

  const { data: facilities } = await supabase
    .from("facilities")
    .select("id, name, status, city")
    .eq("owner_id", user.id);

  const facilityIds = (facilities || []).map((f) => f.id);

  const { data: courts } = facilityIds.length
    ? await supabase
        .from("courts")
        .select("id, name, status, facility_id")
        .in("facility_id", facilityIds)
    : { data: [] };

  const { data: bookings } = facilityIds.length
    ? await supabase
        .from("bookings")
        .select("id, status, start_at, total_price, court_id")
        .in("court_id", (courts || []).map((c) => c.id))
        .order("created_at", { ascending: false })
        .limit(6)
    : { data: [] };

  const bookingActivity: DashboardBooking[] = (bookings || []).map((booking) => {
    const court = (courts || []).find((item) => item.id === booking.court_id);

    return {
      id: booking.id,
      title: court?.name || "Court reservation",
      detail: booking.status === "confirmed" ? "Player reservation confirmed" : "Awaiting your review",
      startAt: booking.start_at,
      amount: Number(booking.total_price || 0),
      status: booking.status,
    };
  });

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b bg-white px-6 py-5 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
          <Link href="/" className="text-xl font-bold text-blue-700">
            CourtFinder <span className="text-sm font-normal text-slate-500">Owner</span>
          </Link>
          <div className="text-sm text-slate-500">
              Welcome, <strong className="text-slate-900">{profile.full_name || "Owner"}</strong>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-7 p-4 sm:p-6 lg:p-10">
        <DashboardWelcome
          eyebrow="Facility owner portal"
          title={`Good day, ${profile.full_name || "facility owner"}.`}
          description="Keep your courts active, respond to player requests, and make it easier for the community to find a place to play."
        >
          <Link
            href="/dashboard/owner/facilities/new"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#008840] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#006c34]"
          >
            Add facility <span aria-hidden="true">+</span>
          </Link>
        </DashboardWelcome>

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4 sm:gap-4">
          <DashboardMetric label="My facilities" value={facilities?.length ?? 0} icon="▦" detail="Locations in your portfolio" tone="blue" />
          <DashboardMetric label="Active courts" value={courts?.filter((court) => court.status === "active").length ?? 0} icon="⌖" detail="Available for player bookings" tone="green" />
          <DashboardMetric label="Pending requests" value={bookings?.filter((booking) => booking.status === "pending").length ?? 0} icon="◷" detail="Waiting for your response" tone="amber" />
          <DashboardMetric label="Confirmed" value={bookings?.filter((booking) => booking.status === "confirmed").length ?? 0} icon="✓" detail="Reservations on your courts" tone="ink" />
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <div id="my-facilities" className="scroll-mt-6 rounded-xl border border-zinc-200 bg-white p-5 shadow-[0_8px_24px_rgba(12,40,52,0.04)] sm:p-6 lg:col-span-2">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">My Facilities</h2>
                <p className="text-sm text-slate-500">Your registered sports facilities</p>
              </div>
              <Link href="/dashboard/owner/facilities" className="text-sm font-semibold text-blue-600">
                  View all →
              </Link>
            </div>

            <div className="space-y-3">
              {facilities?.map((facility) => (
                <div key={facility.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border p-4">
                  <div>
                    <h3 className="font-semibold">{facility.name}</h3>
                    <p className="text-sm text-slate-500">{facility.city || "Location not set"}</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold capitalize">
                    {facility.status}
                  </span>
                </div>
              ))}
              {!facilities?.length && (
                <div className="rounded-xl bg-slate-50 p-8 text-center">
                  <p className="font-semibold">No facilities yet</p>
                  <p className="mt-1 text-sm text-slate-500">Register your first sports facility.</p>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-[0_8px_24px_rgba(12,40,52,0.04)] sm:p-6">
            <h2 className="text-lg font-bold">Quick Actions</h2>
            <div className="mt-5 space-y-3">
              <Link href="/dashboard/owner/facilities/new" className="block rounded-xl border p-4 hover:bg-slate-50">
                <strong>+ Add Facility</strong>
                <p className="mt-1 text-xs text-slate-500">Register a new location</p>
              </Link>
              <Link href="/dashboard/owner/courts" className="block rounded-xl border p-4 hover:bg-slate-50">
                <strong>Manage Courts</strong>
                <p className="mt-1 text-xs text-slate-500">Update court information</p>
              </Link>
              <Link href="/dashboard/owner/bookings" className="block rounded-xl border p-4 hover:bg-slate-50">
                <strong>Manage Bookings</strong>
                <p className="mt-1 text-xs text-slate-500">Review customer reservations</p>
              </Link>
            </div>
          </div>
        </section>

        <div id="recent-bookings" className="scroll-mt-6">
          <BookingActivity bookings={bookingActivity} />
        </div>
      </div>
    </main>
  );
}
