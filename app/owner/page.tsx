
import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import DashboardShell from "@/app/components/dashboard/dashboard-shell";
import BookingActions from "../components/owner/booking-actions";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-PH", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Manila",
  }).format(new Date(value));
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-gray-900">
        {value}
      </p>
    </div>
  );
}

export default function OwnerDashboard() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#f5f5f5]" />}>
      <OwnerDashboardContent />
    </Suspense>
  );
}

async function OwnerDashboardContent() {
  await connection();

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/owner");
  }

  // Verify owner account
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "owner") {
    redirect("/");
  }

  // Get owner's facilities
  const { data: facilities, error: facilityError } = await supabase
    .from("facilities")
    .select("id, name, city, province, status, is_verified")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false });

  if (facilityError) {
    console.error("Owner facilities:", facilityError.message);
  }

  const ownedFacilities = facilities ?? [];
  const facilityIds = ownedFacilities.map((facility) => facility.id);

  // Get courts belonging to owner's facilities
  const { data: courts, error: courtError } = facilityIds.length
    ? await supabase
        .from("courts")
        .select("id, name, sport, facility_id, status")
        .in("facility_id", facilityIds)
    : { data: [], error: null };

  if (courtError) {
    console.error("Owner courts:", courtError.message);
  }

  const ownedCourts = courts ?? [];
  const courtIds = ownedCourts.map((court) => court.id);

  // Get bookings for those courts
  const { data: bookings, error: bookingError } = courtIds.length
    ? await supabase
        .from("bookings")
        .select(`
          id,
          user_id,
          court_id,
          start_at,
          end_at,
          total_price,
          notes,
          status,
          created_at
        `)
        .in("court_id", courtIds)
        .order("created_at", { ascending: false })
    : { data: [], error: null };

  if (bookingError) {
    console.error("Owner bookings:", bookingError.message);
  }

  const bookingList = bookings ?? [];

  // Load names for players who have booked these facilities
  const playerIds = [
    ...new Set(bookingList.map((booking) => booking.user_id)),
  ];

  const { data: players } = playerIds.length
    ? await supabase
        .from("profiles")
        .select("id, full_name")
        .in("id", playerIds)
    : { data: [] };

  const playerNames = new Map(
    (players ?? []).map((player) => [player.id, player.full_name])
  );

  const courtMap = new Map(
    ownedCourts.map((court) => [court.id, court])
  );

  const facilityMap = new Map(
    ownedFacilities.map((facility) => [facility.id, facility])
  );

  const pendingBookings = bookingList.filter(
    (booking) => booking.status === "pending"
  );

  const confirmedBookings = bookingList.filter(
    (booking) => booking.status === "confirmed"
  );

  const activeCourts = ownedCourts.filter(
    (court) => court.status === "active"
  );

  return (
    <DashboardShell
      role="owner"
      fullName={profile.full_name || "Facility Owner"}
      email={user.email || ""}
    >
    <main className="min-h-screen bg-[#f5f5f5] px-4 py-10 md:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link
              href="/"
              className="text-sm font-semibold text-[#006cb7]"
            >
              ← CourtFinder
            </Link>

            <p className="mt-6 text-sm font-bold uppercase tracking-widest text-[#008840]">
              Facility management
            </p>

            <h1 className="mt-2 font-oswald text-4xl font-bold uppercase text-gray-900 md:text-5xl">
              Owner Dashboard
            </h1>

            <p className="mt-2 text-gray-500">
              Welcome, {profile.full_name || "Facility Owner"}.
              Manage your facilities and booking requests.
            </p>
          </div>

          <Link
            href="/dashboard/owner/facilities/new"
            className="rounded-full bg-[#008840] px-6 py-3 font-bold text-white hover:bg-green-700"
          >
            + Add Facility
          </Link>
        </div>

        {/* Statistics */}
        <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="My facilities" value={ownedFacilities.length} />
          <StatCard label="Active courts" value={activeCourts.length} />
          <StatCard label="Pending requests" value={pendingBookings.length} />
          <StatCard label="Confirmed bookings" value={confirmedBookings.length} />
        </section>

        {/* Facilities */}
        <section id="my-facilities" className="mt-12 scroll-mt-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-oswald text-3xl font-bold uppercase text-gray-900">
              My Facilities
            </h2>
          </div>

          {ownedFacilities.length ? (
            <div className="grid gap-4 md:grid-cols-2">
              {ownedFacilities.map((facility) => (
                <div
                  key={facility.id}
                  className="rounded-2xl bg-white p-5 shadow-sm"
                >
                  <h3 className="text-xl font-bold text-gray-900">
                    {facility.name}
                  </h3>

                  <p className="mt-2 text-sm text-gray-500">
                    {facility.city}, {facility.province}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                      {facility.status}
                    </span>

                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      facility.is_verified
                        ? "bg-green-50 text-green-700"
                        : "bg-yellow-50 text-yellow-700"
                    }`}>
                      {facility.is_verified ? "Verified" : "Awaiting verification"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
              <h3 className="text-xl font-bold">No facilities yet</h3>
              <p className="mt-2 text-sm text-gray-500">
                Add your first sports facility to start receiving booking requests.
              </p>
              <Link
                href="/dashboard/owner/facilities/new"
                className="mt-5 inline-block rounded-full bg-[#008840] px-6 py-3 font-bold text-white"
              >
                Add your first facility
              </Link>
            </div>
          )}
        </section>

        {/* Booking requests */}
        <section className="mt-12">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="font-oswald text-3xl font-bold uppercase text-gray-900">
                Booking Requests
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Review and respond to player requests.
              </p>
            </div>

            <span className="rounded-full bg-yellow-100 px-4 py-2 text-sm font-bold text-yellow-800">
              {pendingBookings.length} pending
            </span>
          </div>

          {pendingBookings.length ? (
            <div className="space-y-4">
              {pendingBookings.map((booking) => {
                const court = courtMap.get(booking.court_id);
                const facility = court
                  ? facilityMap.get(court.facility_id)
                  : null;

                return (
                  <article
                    key={booking.id}
                    className="rounded-2xl bg-white p-5 shadow-sm md:p-6"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <span className="rounded-full bg-yellow-50 px-3 py-1 text-xs font-bold text-yellow-800">
                          PENDING
                        </span>

                        <h3 className="mt-3 text-xl font-bold text-gray-900">
                          {court?.name ?? "Court"}
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          {facility?.name ?? "Facility"} · {court?.sport ?? ""}
                        </p>
                      </div>

                      <p className="text-xl font-bold text-[#006cb7]">
                        ₱{Number(booking.total_price).toLocaleString("en-PH")}
                      </p>
                    </div>

                    <div className="mt-5 grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-3">
                      <div>
                        <p className="text-gray-400">Player</p>
                        <p className="mt-1 font-semibold text-gray-800">
                          {playerNames.get(booking.user_id) || "Player"}
                        </p>
                      </div>

                      <div>
                        <p className="text-gray-400">Start</p>
                        <p className="mt-1 font-semibold text-gray-800">
                          {formatDate(booking.start_at)}
                        </p>
                      </div>

                      <div>
                        <p className="text-gray-400">End</p>
                        <p className="mt-1 font-semibold text-gray-800">
                          {formatDate(booking.end_at)}
                        </p>
                      </div>
                    </div>

                    {booking.notes && (
                      <div className="mt-4 rounded-xl bg-gray-50 p-3">
                        <p className="text-xs font-semibold text-gray-500">
                          PLAYER NOTES
                        </p>
                        <p className="mt-1 text-sm text-gray-700">
                          {booking.notes}
                        </p>
                      </div>
                    )}

                    <BookingActions bookingId={booking.id} />
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl bg-white px-6 py-12 text-center shadow-sm">
              <div className="text-4xl">📅</div>
              <h3 className="mt-3 text-xl font-bold text-gray-900">
                No pending booking requests
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                New player requests for your facilities will appear here.
              </p>
            </div>
          )}
        </section>

        {/* Recent bookings */}
        <section className="mt-12">
          <h2 className="mb-5 font-oswald text-3xl font-bold uppercase text-gray-900">
            Recent Bookings
          </h2>

          <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
            <table className="w-full min-w-[650px] text-left text-sm">
              <thead className="border-b bg-gray-50 text-gray-500">
                <tr>
                  <th className="p-4">Player</th>
                  <th className="p-4">Court</th>
                  <th className="p-4">Schedule</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>

              <tbody>
                {bookingList.slice(0, 10).map((booking) => (
                  <tr key={booking.id} className="border-b last:border-0">
                    <td className="p-4 font-semibold">
                      {playerNames.get(booking.user_id) || "Player"}
                    </td>
                    <td className="p-4">
                      {courtMap.get(booking.court_id)?.name || "Court"}
                    </td>
                    <td className="p-4">
                      {formatDate(booking.start_at)}
                    </td>
                    <td className="p-4">
                      ₱{Number(booking.total_price).toLocaleString("en-PH")}
                    </td>
                    <td className="p-4">
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold capitalize">
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}

                {bookingList.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500">
                      No bookings yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </main>
    </DashboardShell>
  );
}
