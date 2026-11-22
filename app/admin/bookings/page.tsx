import Link from "next/link";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import BookingActivity, { type DashboardBooking } from "@/app/components/dashboard/booking-activity";

export default async function AdminBookingsPage() {
  await connection();
  const supabase = await createClient();
  const { data: rows, error } = await supabase
    .from("bookings")
    .select("id, status, start_at, total_price, profiles(full_name), courts(name)")
    .order("created_at", { ascending: false });

  const bookings: DashboardBooking[] = (rows || []).map((booking) => {
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

  return (
      <main className="min-h-screen bg-[#f5f7f6] px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <Link href="/admin" className="text-sm font-semibold text-[#006cb7] hover:underline">← Dashboard</Link>
          <div className="mt-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#006cb7]">Platform activity</p>
            <h1 className="mt-1 font-oswald text-3xl font-bold uppercase text-zinc-950 sm:text-4xl">Bookings</h1>
            <p className="mt-2 text-sm text-zinc-600">Monitor reservation status across CourtFinder.</p>
          </div>
          {error ? (
            <p role="alert" className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">Unable to load bookings.</p>
          ) : (
            <div className="mt-6"><BookingActivity bookings={bookings} /></div>
          )}
        </div>
      </main>
  );
}