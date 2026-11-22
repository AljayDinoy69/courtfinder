
"use client";

import { useActionState, useRef, type FormEvent } from "react";
import {
  submitBooking,
  type BookingState,
} from "@/app/actions/bookings";

const initialState: BookingState = {
  success: false,
  message: "",
};

type Props = {
  courtId: string;
  pricePerHour: number;
};

export default function BookingForm({
  courtId,
  pricePerHour,
}: Props) {
  const [state, formAction, isPending] = useActionState(
    submitBooking,
    initialState
  );

  const localDateRef = useRef<HTMLInputElement>(null);
  const isoDateRef = useRef<HTMLInputElement>(null);
  const durationRef = useRef<HTMLSelectElement>(null);
  const [duration, setDuration] = useState(1);

  function prepareBooking(event: FormEvent<HTMLFormElement>) {
    const localDate = localDateRef.current?.value;

    if (!localDate || !isoDateRef.current) {
      event.preventDefault();
      return;
    }

    // Convert the browser's local time into UTC.
    const date = new Date(localDate);

    if (Number.isNaN(date.getTime())) {
      event.preventDefault();
      return;
    }

    isoDateRef.current.value = date.toISOString();
  }

  const selectedDuration = Number(durationRef.current?.value ?? 1);
  const estimatedPrice = pricePerHour * duration;

  return (
    <form
      action={formAction}
      onSubmit={prepareBooking}
      className="mt-5 space-y-4"
    >
      <input
        type="hidden"
        name="court_id"
        value={courtId}
      />

      <input
        type="hidden"
        name="start_at"
        ref={isoDateRef}
      />

      <div>
        <label
          htmlFor={`booking-date-${courtId}`}
          className="mb-2 block text-sm font-semibold text-gray-700"
        >
          Booking date and time
        </label>

        <input
          ref={localDateRef}
          id={`booking-date-${courtId}`}
          type="datetime-local"
          required
          className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#006cb7]"
        />
      </div>

      <div>
        <label
          htmlFor={`booking-duration-${courtId}`}
          className="mb-2 block text-sm font-semibold text-gray-700"
        >
          Duration
        </label>

        <select
          ref={durationRef}
          id={`booking-duration-${courtId}`}
          name="duration_hours"
          value={duration}
          onChange={(event) => setDuration(Number(event.target.value))}
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3"
        >
          {[1, 2, 3, 4, 5, 6, 7, 8].map((hours) => (
            <option key={hours} value={hours}>
              {hours} {hours === 1 ? "hour" : "hours"}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor={`booking-notes-${courtId}`}
          className="mb-2 block text-sm font-semibold text-gray-700"
        >
          Additional notes (optional)
        </label>

        <textarea
          id={`booking-notes-${courtId}`}
          name="notes"
          maxLength={500}
          rows={3}
          placeholder="Enter any special requests..."
          className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#006cb7]"
        />
      </div>

      <div className="rounded-xl bg-blue-50 p-4">
        <p className="text-sm text-gray-600">
          Price per hour: ₱
          {pricePerHour.toLocaleString("en-PH")}
        </p>

        <p className="mt-1 text-lg font-bold text-[#006cb7]">
          Estimated total: ₱
          {estimatedPrice.toLocaleString("en-PH")}
        </p>

        <p className="mt-1 text-xs text-gray-500">
          Final price is calculated and verified by the server.
        </p>
      </div>

      {state.message && (
        <div
          role="status"
          aria-live="polite"
          className={`rounded-xl p-3 text-sm ${
            state.success
              ? "bg-green-50 text-green-800"
              : "bg-red-50 text-red-800"
          }`}
        >
          {state.message}

          {state.bookingId && (
            <p className="mt-1 font-semibold">
              Booking reference: {state.bookingId}
            </p>
          )}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-xl bg-[#006cb7] px-6 py-3 font-bold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? "Submitting..." : "Request Booking"}
      </button>

      <p className="text-center text-xs text-gray-500">
        Your request will remain pending until the facility owner responds.
      </p>
    </form>
  );
}
function useState(arg0: number): [any, any] {
  throw new Error("Function not implemented.");
}

