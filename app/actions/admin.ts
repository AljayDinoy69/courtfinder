
"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type AdminActionState = {
  success: boolean;
  message: string;
};

export async function reviewFacility(
  _previousState: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      message: "Please log in.",
    };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return {
      success: false,
      message: "Administrator access required.",
    };
  }

  const facilityId = String(formData.get("facility_id") ?? "");
  const decision = String(formData.get("decision") ?? "");

  if (!facilityId || !["approve", "return"].includes(decision)) {
    return {
      success: false,
      message: "Invalid facility review request.",
    };
  }

  const changes =
    decision === "approve"
      ? { is_verified: true, status: "published" }
      : { is_verified: false, status: "draft" };

  const { data, error } = await supabase
    .from("facilities")
    .update(changes)
    .eq("id", facilityId)
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("Facility review error:", error);

    return {
      success: false,
      message: "Unable to update facility. Please try again.",
    };
  }

  if (!data) {
    return {
      success: false,
      message: "Facility not found or you are not authorized.",
    };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/facilities");
  revalidatePath("/facilities");

  return {
    success: true,
    message:
      decision === "approve"
        ? "Facility approved and published."
        : "Facility returned to draft.",
  };
}
