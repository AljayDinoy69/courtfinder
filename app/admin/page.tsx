
import Link from "next/link";
import { connection } from "next/server";
import DashboardWelcome from "@/app/components/dashboard/dashboard-welcome";
import DashboardMetric from "@/app/components/dashboard/dashboard-metric";
import BookingActivity, { type DashboardBooking } from "@/app/components/dashboard/booking-activity";
import { getDashboardUser } from "@/lib/auth/dashboard-user";

export default async function AdminPage() {
  await connection();
  const { supabase, profile } = await getDashboardUser("admin");
  const adminName = profile.full_name || "Administrator";

  // Fetch dashboard data
  const [
    { count: totalUsers },
    { count: totalFacilities },
    { count: totalCourts },
    { count: totalBookings },
    { count: pendingFacilities },
    { count: pendingBookings },
    { data: recentBookings },
    { data: recentFacilities },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("facilities").select("*", { count: "exact", head: true }),
    supabase.from("courts").select("*", { count: "exact", head: true }),
    supabase.from("bookings").select("*", { count: "exact", head: true }),
    supabase
      .from("facilities")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending"),
    supabase
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending"),
    supabase
      .from("bookings")
      .select("id, status, start_at, total_price, profiles(full_name), courts(name)")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("facilities")
      .select("id, name, city, province, status, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const bookingActivity: DashboardBooking[] = (recentBookings || []).map((booking) => {
    const player = Array.isArray(booking.profiles) ? booking.profiles[0] : booking.profiles;
    const court = Array.isArray(booking.courts) ? booking.courts[0] : booking.courts;

    return {
      id: booking.id,
      title: court?.name || "Court reservation",
      detail: `Player: ${player?.full_name || "Unknown"}`,
      startAt: booking.start_at,
      amount: Number(booking.total_price || 0),
      status: booking.status,
    };
  });

  const formatDate = (date: string | null) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-PH", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
      <main className="min-h-screen bg-slate-50 text-slate-900">
        <section className="min-w-0">
          <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-white px-6 py-5 lg:px-10">
            <div>
              <h2 className="text-2xl font-bold">Admin Dashboard</h2>
              <p className="mt-1 text-sm text-slate-500">
                Manage and monitor your CourtFinder platform.
              </p>
            </div>

            <div className="text-right">
              <p className="text-sm font-semibold">{adminName}</p>
              <p className="text-xs text-slate-500">Platform Administrator</p>
            </div>
          </header>

          <div className="space-y-7 p-4 sm:p-6 lg:p-10">
            <DashboardWelcome
              eyebrow="CourtFinder control room"
              title={`Welcome back, ${adminName}.`}
              description="A live overview of players, facilities, courts, and reservations across the CourtFinder network."
            >
                  <Link href="/admin/facilities" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-bold text-[#006cb7] shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-50">
                Review facilities <span aria-hidden="true">↗</span>
              </Link>
            </DashboardWelcome>

            {/* Statistics */}
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4 sm:gap-4">
              <DashboardMetric label="Total users" value={totalUsers ?? 0} icon="♙" detail="Player and owner accounts" tone="blue" />
              <DashboardMetric label="Facilities" value={totalFacilities ?? 0} icon="▦" detail="Registered sports locations" tone="green" />
              <DashboardMetric label="Courts" value={totalCourts ?? 0} icon="⌖" detail="Listed across facilities" tone="amber" />
              <DashboardMetric label="Bookings" value={totalBookings ?? 0} icon="▤" detail="Reservations on the platform" tone="ink" />
            </div>

            {/* Pending tasks */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-amber-200 bg-[#fffaf0] p-5 sm:p-6">
                <p className="text-sm font-medium text-amber-800">Pending Facilities</p>
                <p className="mt-2 text-3xl font-bold text-amber-900">
                  {pendingFacilities ?? 0}
                </p>
                  <Link href="/admin/facilities" className="mt-4 inline-block text-sm font-semibold text-amber-900 underline">
                  Review facilities →
                </Link>
              </div>

              <div className="rounded-xl border border-[#c9e2f2] bg-[#f2f9fd] p-5 sm:p-6">
                <p className="text-sm font-medium text-blue-800">Pending Bookings</p>
                <p className="mt-2 text-3xl font-bold text-blue-900">
                  {pendingBookings ?? 0}
                </p>
                  <Link href="/admin/bookings" className="mt-4 inline-block text-sm font-semibold text-blue-900 underline">
                  View bookings →
                </Link>
              </div>
            </div>

            {/* Recent facilities */}
            <div id="recent-facilities" className="scroll-mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 p-6">
                <div>
                  <h3 className="font-bold">Recent Facilities</h3>
                  <p className="mt-1 text-sm text-slate-500">Recently registered facilities</p>
                </div>
                <Link href="/admin/facilities" className="text-sm font-semibold text-blue-600">
                  View all →
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                    <tr>
                      <th className="px-6 py-4">Facility</th>
                      <th className="px-6 py-4">Location</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Date Added</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {recentFacilities?.map((facility) => (
                      <tr key={facility.id}>
                        <td className="px-6 py-4 font-semibold">{facility.name}</td>
                        <td className="px-6 py-4 text-slate-500">
                          {[facility.city, facility.province].filter(Boolean).join(", ") || "—"}
                        </td>
                        <td className="px-6 py-4">
                          <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                            {facility.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-500">
                          {formatDate(facility.created_at)}
                        </td>
                      </tr>
                    ))}
                    {!recentFacilities?.length && (
                      <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-500">No facilities found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div id="recent-bookings" className="scroll-mt-6">
              <BookingActivity bookings={bookingActivity} />
            </div>

            <p className="text-center text-xs text-slate-400">
              CourtFinder Administration · {new Date().getFullYear()}
            </p>
          </div>
        </section>
      </main>
  );
}
