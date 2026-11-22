"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  createCourt,
  createFacility,
  type OwnerListingActionState,
} from "@/app/actions/owner-listings";

const initialState: OwnerListingActionState = {
  success: false,
  message: "",
};

const fieldClass = "mt-2 min-h-11 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm outline-none transition focus:border-[#006cb7] focus:ring-2 focus:ring-[#006cb7]/15";
const labelClass = "block text-sm font-semibold text-zinc-800";

export function FacilityCreationForm() {
  const [state, formAction, isPending] = useActionState(createFacility, initialState);

  if (state.success && state.facilityId) {
    return (
      <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
        <p className="font-semibold text-emerald-800">{state.message}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href={`/dashboard/owner/facilities/${state.facilityId}/courts/new`} className="inline-flex min-h-10 items-center rounded-lg bg-[#008840] px-4 text-sm font-bold text-white hover:bg-[#006c34]">Add a court</Link>
          <Link href="/dashboard/owner/facilities" className="inline-flex min-h-10 items-center rounded-lg border border-emerald-300 px-4 text-sm font-semibold text-emerald-800 hover:bg-white">View facilities</Link>
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className={`${labelClass} sm:col-span-2`}>
          Facility name <span className="text-red-600">*</span>
          <input name="name" maxLength={120} required className={fieldClass} placeholder="e.g. Riverside Sports Center" />
        </label>
        <label className={`${labelClass} sm:col-span-2`}>
          Street address <span className="text-red-600">*</span>
          <input name="address" required className={fieldClass} placeholder="Building, street, barangay" />
        </label>
        <label className={labelClass}>
          City <span className="text-red-600">*</span>
          <input name="city" required className={fieldClass} placeholder="City or municipality" />
        </label>
        <label className={labelClass}>
          Province <span className="text-red-600">*</span>
          <input name="province" required className={fieldClass} placeholder="Province" />
        </label>
        <label className={`${labelClass} sm:col-span-2`}>
          Description
          <textarea name="description" maxLength={3000} rows={4} className={`${fieldClass} py-3`} placeholder="Tell players about your facility, amenities, and access." />
        </label>
      </div>

      <div className="border-t border-zinc-100 pt-5">
        <h2 className="text-sm font-bold text-zinc-900">Contact and listing details</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className={labelClass}>
            Contact number
            <input name="contact_number" type="tel" autoComplete="tel" className={fieldClass} placeholder="Phone number" />
          </label>
          <label className={labelClass}>
            Contact email
            <input name="email" type="email" autoComplete="email" className={fieldClass} placeholder="facility@example.com" />
          </label>
          <label className={labelClass}>
            Website URL
            <input name="website_url" type="url" className={fieldClass} placeholder="https://example.com" />
          </label>
          <label className={labelClass}>
            Cover image URL
            <input name="cover_image_url" type="url" className={fieldClass} placeholder="https://example.com/photo.jpg" />
          </label>
        </div>
      </div>

      {state.message && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{state.message}</p>}

      <div className="flex flex-wrap items-center gap-3 border-t border-zinc-100 pt-5">
        <button type="submit" disabled={isPending} className="min-h-11 rounded-lg bg-[#008840] px-5 text-sm font-bold text-white transition hover:bg-[#006c34] disabled:opacity-60">
          {isPending ? "Saving facility..." : "Save facility draft"}
        </button>
        <p className="text-xs text-zinc-500">New facilities remain unpublished until Admin review.</p>
      </div>
    </form>
  );
}

export function CourtCreationForm({ facilityId }: { facilityId: string }) {
  const [state, formAction, isPending] = useActionState(createCourt, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="facility_id" value={facilityId} />
      <div className="grid gap-4 sm:grid-cols-2">
        <label className={`${labelClass} sm:col-span-2`}>
          Court name <span className="text-red-600">*</span>
          <input name="name" maxLength={120} required className={fieldClass} placeholder="e.g. Indoor Court 1" />
        </label>
        <label className={labelClass}>
          Sport <span className="text-red-600">*</span>
          <select name="sport" required defaultValue="" className={fieldClass}>
            <option value="" disabled>Select sport</option>
            <option value="pickleball">Pickleball</option>
            <option value="badminton">Badminton</option>
            <option value="basketball">Basketball</option>
            <option value="tennis">Tennis</option>
            <option value="volleyball">Volleyball</option>
            <option value="other">Other</option>
          </select>
        </label>
        <label className={labelClass}>
          Price per hour (₱) <span className="text-red-600">*</span>
          <input name="price_per_hour" type="number" min="0" step="0.01" required className={fieldClass} placeholder="500" />
        </label>
        <label className={`${labelClass} sm:col-span-2`}>
          Description
          <textarea name="description" maxLength={1000} rows={4} className={`${fieldClass} py-3`} placeholder="Optional court details or equipment included." />
        </label>
      </div>

      {state.message && (
        <p role={state.success ? "status" : "alert"} className={`rounded-lg p-3 text-sm ${state.success ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-700"}`}>
          {state.message}
          {state.success && <Link href="/dashboard/owner/courts" className="ml-2 font-semibold underline">Manage courts</Link>}
        </p>
      )}

      <button type="submit" disabled={isPending} className="min-h-11 rounded-lg bg-[#008840] px-5 text-sm font-bold text-white transition hover:bg-[#006c34] disabled:opacity-60">
        {isPending ? "Adding court..." : "Add court"}
      </button>
    </form>
  );
}