"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type OwnerListingActionState = {
  success: boolean;
  message: string;
  facilityId?: string;
};

function saveErrorMessage(code: string | undefined, entity: "facility" | "court") {
  if (code === "42501") {
    return `Supabase blocked this ${entity} save. Apply the owner ${entity} policies from the latest migration and verify Row Level Security is configured.`;
  }
  if (code === "23502" || code === "PGRST204") {
    return `The ${entity} table has a required field or column that this form does not provide. Compare the database schema with the submitted ${entity} fields.`;
  }
  if (code === "23514" || code === "22P02") {
    return `The ${entity} values do not match a database constraint. Check allowed statuses, sport values, and numeric fields.`;
  }
  return `Unable to save the ${entity}. Check the Supabase table schema and Row Level Security policies, then try again.`;
}

async function getOwnerClient() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Please sign in as a facility owner." } as const;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "owner") {
    return { error: "Only facility owners can manage facilities and courts." } as const;
  }

  return { supabase, user } as const;
}

export async function createFacility(
  _previousState: OwnerListingActionState,
  formData: FormData
): Promise<OwnerListingActionState> {
  const name = String(formData.get("name") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const province = String(formData.get("province") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const contactNumber = String(formData.get("contact_number") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const websiteUrl = String(formData.get("website_url") ?? "").trim();
  const coverImageUrl = String(formData.get("cover_image_url") ?? "").trim();

  if (!name || !address || !city || !province) {
    return {
      success: false,
      message: "Facility name, address, city, and province are required.",
    };
  }

  if (name.length > 120 || description.length > 3000) {
    return { success: false, message: "Facility name or description is too long." };
  }

  for (const [label, value] of [
    ["Website URL", websiteUrl],
    ["Cover image URL", coverImageUrl],
  ] as const) {
    if (!value) continue;
    try {
      const url = new URL(value);
      if (url.protocol !== "https:" && url.protocol !== "http:") throw new Error();
    } catch {
      return { success: false, message: `${label} must be a valid http or https URL.` };
    }
  }

  const owner = await getOwnerClient();
  if ("error" in owner) return { success: false, message: owner.error || "Owner access is required." };

  const { data: facility, error } = await owner.supabase
    .from("facilities")
    .insert({
      owner_id: owner.user.id,
      name,
      description: description || null,
      address,
      city,
      province,
      contact_number: contactNumber || null,
      email: email || null,
      website_url: websiteUrl || null,
      cover_image_url: coverImageUrl || null,
      status: "draft",
      is_verified: false,
    })
    .select("id")
    .single();

  if (error || !facility) {
    console.error("Create facility error:", error);
    return {
      success: false,
      message: saveErrorMessage(error?.code, "facility"),
    };
  }

  revalidatePath("/dashboard/owner");
  revalidatePath("/dashboard/owner/facilities");
  revalidatePath("/admin");
  revalidatePath("/admin/facilities");

  return {
    success: true,
    facilityId: facility.id,
    message: "Facility saved as a draft. Add courts, then submit it for review.",
  };
}

export async function createCourt(
  _previousState: OwnerListingActionState,
  formData: FormData
): Promise<OwnerListingActionState> {
  const facilityId = String(formData.get("facility_id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const sport = String(formData.get("sport") ?? "").trim().toLowerCase();
  const description = String(formData.get("description") ?? "").trim();
  const pricePerHour = Number(formData.get("price_per_hour"));

  if (!facilityId || !name || !sport || !Number.isFinite(pricePerHour) || pricePerHour < 0) {
    return { success: false, message: "Facility, court name, sport, and a valid hourly price are required." };
  }

  if (name.length > 120 || description.length > 1000) {
    return { success: false, message: "Court name or description is too long." };
  }

  const owner = await getOwnerClient();
  if ("error" in owner) return { success: false, message: owner.error || "Owner access is required." };

  const { data: facility, error: facilityError } = await owner.supabase
    .from("facilities")
    .select("id")
    .eq("id", facilityId)
    .eq("owner_id", owner.user.id)
    .maybeSingle();

  if (facilityError || !facility) {
    return { success: false, message: "The selected facility was not found in your account." };
  }

  const { error } = await owner.supabase.from("courts").insert({
    facility_id: facility.id,
    name,
    sport,
    description: description || null,
    price_per_hour: pricePerHour,
    status: "active",
  });

  if (error) {
    console.error("Create court error:", error);
    return {
      success: false,
      message: saveErrorMessage(error.code, "court"),
    };
  }

  revalidatePath("/dashboard/owner");
  revalidatePath("/dashboard/owner/facilities");
  revalidatePath("/dashboard/owner/bookings");
  revalidatePath(`/dashboard/owner/facilities/${facility.id}/courts`);

  return { success: true, facilityId: facility.id, message: "Court added successfully." };
}

export async function submitFacilityForReview(
  _previousState: OwnerListingActionState,
  formData: FormData
): Promise<OwnerListingActionState> {
  const facilityId = String(formData.get("facility_id") ?? "").trim();
  if (!facilityId) return { success: false, message: "Missing facility." };

  const owner = await getOwnerClient();
  if ("error" in owner) return { success: false, message: owner.error || "Owner access is required." };

  const { data: facility } = await owner.supabase
    .from("facilities")
    .select("id, status")
    .eq("id", facilityId)
    .eq("owner_id", owner.user.id)
    .maybeSingle();

  if (!facility) return { success: false, message: "Facility not found in your account." };
  if (facility.status === "published") {
    return { success: false, message: "This facility is already published." };
  }

  const { count, error: courtError } = await owner.supabase
    .from("courts")
    .select("id", { count: "exact", head: true })
    .eq("facility_id", facility.id);

  if (courtError || !count) {
    return { success: false, message: "Add at least one court before submitting this facility for review." };
  }

  const { data, error } = await owner.supabase
    .from("facilities")
    .update({ status: "pending", is_verified: false })
    .eq("id", facility.id)
    .eq("owner_id", owner.user.id)
    .select("id")
    .maybeSingle();

  if (error || !data) {
    console.error("Submit facility for review error:", error);
    return { success: false, message: "Unable to submit the facility for review." };
  }

  revalidatePath("/dashboard/owner");
  revalidatePath("/dashboard/owner/facilities");
  revalidatePath("/admin");
  revalidatePath("/admin/facilities");

  return { success: true, facilityId: facility.id, message: "Facility submitted for Admin review." };
}