
import Link from "next/link";
import { connection } from "next/server";
import DashboardWelcome from "@/app/components/dashboard/dashboard-welcome";
import DashboardMetric from "@/app/components/dashboard/dashboard-metric";
import BookingActivity, { type DashboardBooking } from "@/app/components/dashboard/booking-activity";
import { getDashboardUser } from "@/lib/auth/dashboard-user";

export default async function PlayerDashboard() {
  await connection();
  const { supabase, user, profile } = await getDashboardUser("player");

  const { data: bookings } = await supabase
    .from("bookings")
    .select("id, status, start_at, end_at, total_price, courts(name)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10);

  const { count: totalFacilities } = await supabase
    .from("facilities")
    .select("*", { count: "exact", head: true })
    .eq("status", "published")
    .eq("is_verified", true);

  const { count: totalBookings } = await supabase
    .from("bookings")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  const upcomingBookings = (bookings || []).filter(
    (booking) =>
      booking.start_at &&
      new Date(booking.start_at) > new Date() &&
      ["pending", "confirmed"].includes(booking.status)
  );

  const bookingActivity: DashboardBooking[] = (bookings || []).map((booking) => {
    const court = Array.isArray(booking.courts) ? booking.courts[0] : booking.courts;

    return {
      id: booking.id,
      title: court?.name || "Court reservation",
      detail: booking.status === "confirmed" ? "Your court is confirmed" : "Reservation request",
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
            CourtFinder
          </Link>
          <div className="text-sm text-slate-500">
              Welcome, <strong className="text-slate-900">{profile.full_name || "Player"}</strong>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-7 p-4 sm:p-6 lg:p-10">
        <DashboardWelcome
          eyebrow="Player dashboard"
          title={`Ready to play, ${profile.full_name || "Player"}?`}
          description="Your next match starts with the right court. Browse facilities and keep every reservation in view."
        >
          <Link
            href="/dashboard/player/facilities"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-bold text-[#006cb7] shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-50"
          >
            Find a court <span aria-hidden="true">↗</span>
          </Link>
        </DashboardWelcome>

        <section className="grid gap-3 sm:grid-cols-3 sm:gap-4">
          <DashboardMetric label="Total bookings" value={totalBookings ?? 0} icon="▤" detail="All reservations on your account" tone="blue" />
          <DashboardMetric label="Upcoming" value={upcomingBookings.length} icon="◷" detail="Pending or confirmed matches" tone="green" />
          <DashboardMetric label="Courts to explore" value={totalFacilities ?? 0} icon="⌖" detail="Facilities approved by Admin" tone="amber" />
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <div id="my-bookings" className="scroll-mt-6 lg:col-span-2">
            <BookingActivity bookings={bookingActivity} />
          </div>

          <div className="rounded-2xl border bg-white p-6">
            <h2 className="text-lg font-bold">Quick Actions</h2>
            <div className="mt-5 space-y-3">
              <Link href="/dashboard/player/facilities" className="block rounded-xl border p-4 hover:bg-slate-50">
                <strong>Find a Court</strong>
                <p className="mt-1 text-xs text-slate-500">Explore sports facilities</p>
              </Link>
              <Link href="/dashboard/player/bookings" className="block rounded-xl border p-4 hover:bg-slate-50">
                <strong>My Bookings</strong>
                <p className="mt-1 text-xs text-slate-500">View your reservations</p>
              </Link>
              <Link href="/profile" className="block rounded-xl border p-4 hover:bg-slate-50">
                <strong>My Profile</strong>
                <p className="mt-1 text-xs text-slate-500">Manage your account</p>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
