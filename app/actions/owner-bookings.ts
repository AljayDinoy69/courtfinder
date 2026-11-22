
"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type OwnerBookingState = {
  success: boolean;
  message: string;
};

export async function updateBookingStatus(
  _previousState: OwnerBookingState,
  formData: FormData
): Promise<OwnerBookingState> {
  const supabase = await createClient();

  // Verify the signed-in user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      message: "Please log in to manage bookings.",
    };
  }

  const bookingId = String(formData.get("booking_id") ?? "");
  const newStatus = String(formData.get("status") ?? "");

  if (!bookingId) {
    return { success: false, message: "Missing booking reference." };
  }

  if (!["confirmed", "rejected"].includes(newStatus)) {
    return { success: false, message: "Invalid booking action." };
  }

  // Verify owner role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "owner") {
    return {
      success: false,
      message: "Only facility owners can manage booking requests.",
    };
  }

  // Find facilities belonging to this owner
  const { data: facilities, error: facilityError } = await supabase
    .from("facilities")
    .select("id")
    .eq("owner_id", user.id);

  if (facilityError || !facilities?.length) {
    return {
      success: false,
      message: "No facilities were found for your account.",
    };
  }

  const facilityIds = facilities.map((facility) => facility.id);

  // Find courts belonging to those facilities
  const { data: courts, error: courtError } = await supabase
    .from("courts")
    .select("id")
    .in("facility_id", facilityIds);

  if (courtError || !courts?.length) {
    return {
      success: false,
      message: "No courts were found for your facilities.",
    };
  }

  const courtIds = courts.map((court) => court.id);

  // Update only a pending booking belonging to this owner
  const { data: updatedBooking, error: updateError } = await supabase
    .from("bookings")
    .update({ status: newStatus })
    .eq("id", bookingId)
    .eq("status", "pending")
    .in("court_id", courtIds)
    .select("id")
    .maybeSingle();

  if (updateError) {
    console.error("Owner booking update:", updateError);

    return {
      success: false,
      message: "Unable to update this booking. Please try again.",
    };
  }

  if (!updatedBooking) {
    return {
      success: false,
      message: "Booking not found, already processed, or not owned by you.",
    };
  }

  revalidatePath("/owner");
  revalidatePath("/dashboard/owner");
  revalidatePath("/dashboard/owner/bookings");

  return {
    success: true,
    message: `Booking successfully ${newStatus}.`,
  };
}
