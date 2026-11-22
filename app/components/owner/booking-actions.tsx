
"use client";

import { useActionState } from "react";
import {
  updateBookingStatus,
  type OwnerBookingState,
} from "@/app/actions/owner-bookings";

const initialState: OwnerBookingState = {
  success: false,
  message: "",
};

export default function BookingActions({
  bookingId,
}: {
  bookingId: string;
}) {
  const [state, formAction, isPending] = useActionState(
    updateBookingStatus,
    initialState
  );

  return (
    <div className="mt-5">
      <div className="flex flex-wrap gap-3">
        <form action={formAction}>
          <input type="hidden" name="booking_id" value={bookingId} />
          <input type="hidden" name="status" value="confirmed" />

          <button
            type="submit"
            disabled={isPending}
            className="rounded-xl bg-[#008840] px-5 py-2.5 text-sm font-bold text-white hover:bg-green-700 disabled:opacity-50"
          >
            {isPending ? "Processing..." : "Confirm"}
          </button>
        </form>

        <form action={formAction}>
          <input type="hidden" name="booking_id" value={bookingId} />
          <input type="hidden" name="status" value="rejected" />

          <button
            type="submit"
            disabled={isPending}
            className="rounded-xl border border-red-200 px-5 py-2.5 text-sm font-bold text-red-700 hover:bg-red-50 disabled:opacity-50"
          >
            Reject
          </button>
        </form>
      </div>

      {state.message && (
        <p
          role="status"
          className={`mt-3 text-sm ${
            state.success ? "text-green-700" : "text-red-700"
          }`}
        >
          {state.message}
        </p>
      )}
    </div>
  );
}
