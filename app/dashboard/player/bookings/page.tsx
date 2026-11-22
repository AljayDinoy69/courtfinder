import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import BookingActivity, { type DashboardBooking } from "@/app/components/dashboard/booking-activity";

export default async function PlayerBookingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: rows, error } = await supabase
    .from("bookings")
    .select("id, status, start_at, total_price, courts(name)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const bookings: DashboardBooking[] = (rows || []).map((booking) => {
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
      <main className="min-h-screen bg-[#f5f7f6] px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <Link href="/dashboard/player" className="text-sm font-semibold text-[#006cb7] hover:underline">← Overview</Link>
          <div className="mt-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#006cb7]">Your activity</p>
            <h1 className="mt-1 font-oswald text-3xl font-bold uppercase text-zinc-950 sm:text-4xl">My bookings</h1>
            <p className="mt-2 text-sm text-zinc-600">Review the status and schedule of your court reservations.</p>
          </div>
          {error ? (
            <p role="alert" className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">Unable to load your bookings.</p>
          ) : (
            <div className="mt-6"><BookingActivity bookings={bookings} /></div>
          )}
          <Link href="/dashboard/player/facilities" className="mt-5 inline-flex min-h-11 items-center rounded-lg bg-[#006cb7] px-4 text-sm font-bold text-white hover:bg-[#005088]">Find another court ↗</Link>
        </div>
      </main>
  );
}