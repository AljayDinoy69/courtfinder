"use client";

import { useState } from "react";

export type DashboardBooking = {
  id: string;
  title: string;
  detail: string;
  startAt: string | null;
  amount: number;
  status: string;
};

type BookingActivityProps = {
  bookings: DashboardBooking[];
  currency?: string;
};

const filters = ["all", "pending", "confirmed"] as const;
type BookingFilter = (typeof filters)[number];

function formatBookingDate(value: string | null) {
  if (!value) return "Schedule not set";

  return new Date(value).toLocaleString("en-PH", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function BookingActivity({
  bookings,
  currency = "₱",
}: BookingActivityProps) {
  const [filter, setFilter] = useState<BookingFilter>("all");
  const visibleBookings = bookings.filter(
    (booking) => filter === "all" || booking.status === filter
  );
  const pendingCount = bookings.filter((booking) => booking.status === "pending").length;
  const confirmedCount = bookings.filter((booking) => booking.status === "confirmed").length;
  const total = Math.max(bookings.length, 1);

  return (
    <section className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-[0_8px_24px_rgba(12,40,52,0.04)]">
      <div className="flex flex-col gap-5 border-b border-zinc-100 p-5 sm:flex-row sm:items-end sm:justify-between sm:p-6">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#006cb7]">
            Court activity
          </p>
          <h2 className="mt-1 text-lg font-bold text-zinc-950">Recent bookings</h2>
          <p className="mt-1 text-sm text-zinc-500">
            {bookings.length} latest {bookings.length === 1 ? "reservation" : "reservations"}
          </p>
        </div>

        <div className="flex w-full rounded-lg bg-zinc-100 p-1 sm:w-auto" role="group" aria-label="Filter bookings by status">
          {filters.map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={filter === option}
              onClick={() => setFilter(option)}
              className={`min-h-10 flex-1 rounded-md px-3 text-xs font-semibold capitalize transition-colors sm:flex-none ${
                filter === option
                  ? "bg-white text-[#006cb7] shadow-sm"
                  : "text-zinc-500 hover:text-zinc-900"
              }`}
            >
              {option === "all" ? "All" : option}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-5 p-5 sm:grid-cols-[minmax(0,1fr)_180px] sm:p-6">
        <div className="space-y-2">
          {visibleBookings.map((booking) => (
            <article key={booking.id} className="flex min-w-0 flex-wrap items-center justify-between gap-3 rounded-lg border border-zinc-100 p-3 transition-colors hover:border-[#c9e2f2] hover:bg-[#f7fbfd] sm:p-4">
              <div className="min-w-0">
                <h3 className="truncate text-sm font-semibold text-zinc-900">{booking.title}</h3>
                <p className="mt-1 truncate text-xs text-zinc-500">{booking.detail}</p>
                <p className="mt-1 text-xs text-zinc-500">{formatBookingDate(booking.startAt)}</p>
              </div>
              <div className="ml-auto flex shrink-0 items-center gap-3">
                <span className="text-sm font-bold tabular-nums text-zinc-900">
                  {currency}{booking.amount.toLocaleString("en-PH")}
                </span>
                <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold capitalize ${
                  booking.status === "confirmed"
                    ? "bg-emerald-50 text-emerald-700"
                    : booking.status === "pending"
                      ? "bg-amber-50 text-amber-700"
                      : "bg-zinc-100 text-zinc-600"
                }`}>
                  {booking.status}
                </span>
              </div>
            </article>
          ))}
          {visibleBookings.length === 0 && (
            <div className="rounded-lg border border-dashed border-zinc-200 px-4 py-10 text-center">
              <p className="text-sm font-semibold text-zinc-700">No {filter === "all" ? "bookings" : filter + " bookings"} yet</p>
              <p className="mt-1 text-xs text-zinc-500">Try another status filter.</p>
            </div>
          )}
        </div>

        <aside className="rounded-lg bg-[#f5f8f6] p-4 sm:self-start">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-500">
            Recent status mix
          </p>
          <div className="mt-5 space-y-4">
            <div>
              <div className="mb-1.5 flex justify-between text-xs">
                <span className="font-medium text-zinc-600">Pending</span>
                <span className="font-bold text-zinc-900">{pendingCount}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white">
                <div className="h-full rounded-full bg-[#e8aa38] transition-[width] duration-500" style={{ width: `${(pendingCount / total) * 100}%` }} />
              </div>
            </div>
            <div>
              <div className="mb-1.5 flex justify-between text-xs">
                <span className="font-medium text-zinc-600">Confirmed</span>
                <span className="font-bold text-zinc-900">{confirmedCount}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white">
                <div className="h-full rounded-full bg-[#008840] transition-[width] duration-500" style={{ width: `${(confirmedCount / total) * 100}%` }} />
              </div>
            </div>
          </div>
          <p className="mt-4 text-[10px] leading-4 text-zinc-500">
            Based on the bookings shown here.
          </p>
        </aside>
      </div>
    </section>
  );
}