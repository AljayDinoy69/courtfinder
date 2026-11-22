
"use server";

import { createClient } from "@/lib/supabase/server";

export type BookingState = {
  success: boolean;
  message: string;
  bookingId?: string;
};

export async function submitBooking(
  _previousState: BookingState,
  formData: FormData
): Promise<BookingState> {
  const supabase = await createClient();

  // 1. Verify logged-in player
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      success: false,
      message: "Please log in before submitting a booking.",
    };
  }

  // 2. Read form values
  const courtId = String(formData.get("court_id") ?? "");
  const startValue = String(formData.get("start_at") ?? "");
  const duration = Number(formData.get("duration_hours"));
  const notes = String(formData.get("notes") ?? "").trim();

  if (!courtId || !startValue) {
    return {
      success: false,
      message: "Please select a court and booking time.",
    };
  }

  if (!Number.isInteger(duration) || duration < 1 || duration > 8) {
    return {
      success: false,
      message: "Booking duration must be between 1 and 8 hours.",
    };
  }

  if (notes.length > 500) {
    return {
      success: false,
      message: "Notes must not exceed 500 characters.",
    };
  }

  // 3. Validate booking time
  const startAt = new Date(startValue);

  if (
    Number.isNaN(startAt.getTime()) ||
    !startValue.endsWith("Z")
  ) {
    return {
      success: false,
      message: "Invalid booking date or time.",
    };
  }

  const endAt = new Date(
    startAt.getTime() + duration * 60 * 60 * 1000
  );

  if (startAt.getTime() <= Date.now()) {
    return {
      success: false,
      message: "Please choose a future booking time.",
    };
  }

  // 4. Fetch court and verify facility
  const { data: court, error: courtError } = await supabase
    .from("courts")
    .select(`
      id,
      price_per_hour,
      status,
      facilities!inner (
        id,
        status,
        is_verified
      )
    `)
    .eq("id", courtId)
    .eq("status", "active")
    .eq("facilities.status", "published")
    .eq("facilities.is_verified", true)
    .single();

  if (courtError || !court) {
    return {
      success: false,
      message: "This court is unavailable for booking.",
    };
  }

  // 5. Calculate price on the server
  const pricePerHour = Number(court.price_per_hour);

  if (!Number.isFinite(pricePerHour) || pricePerHour < 0) {
    return {
      success: false,
      message: "Unable to calculate the booking price.",
    };
  }

  const totalPrice = pricePerHour * duration;

  // 6. Create pending booking
  const { data: booking, error: bookingError } = await supabase
    .from("bookings")
    .insert({
      user_id: user.id,
      court_id: court.id,
      start_at: startAt.toISOString(),
      end_at: endAt.toISOString(),
      total_price: totalPrice,
      notes: notes || null,
      status: "pending",
    })
    .select("id")
    .single();

  if (bookingError) {
    if (
      bookingError.code === "23P01" ||
      bookingError.message.toLowerCase().includes("no_overlapping")
    ) {
      return {
        success: false,
        message: "This court already has a pending or confirmed booking during that time. Please choose another time.",
      };
    }

    console.error("Booking submission error:", bookingError);

    return {
      success: false,
      message: "Unable to submit your booking. Please try again.",
    };
  }

  return {
    success: true,
    message: "Your booking request has been submitted successfully!",
    bookingId: booking.id,
  };
}
