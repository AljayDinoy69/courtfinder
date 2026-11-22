"use client";

import { useActionState } from "react";
import { submitFacilityForReview } from "@/app/actions/owner-listings";

const initialState = { success: false, message: "" };

export default function FacilityReviewSubmit({ facilityId }: { facilityId: string }) {
  const [state, formAction, isPending] = useActionState(submitFacilityForReview, initialState);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <form action={formAction}>
        <input type="hidden" name="facility_id" value={facilityId} />
        <button
          type="submit"
          disabled={isPending}
          className="min-h-10 rounded-lg border border-[#008840] px-3 text-xs font-bold text-[#007236] hover:bg-emerald-50 disabled:opacity-60"
        >
          {isPending ? "Submitting..." : "Submit for review"}
        </button>
      </form>
      {state.message && (
        <p role={state.success ? "status" : "alert"} className={`text-xs ${state.success ? "text-emerald-700" : "text-red-700"}`}>
          {state.message}
        </p>
      )}
    </div>
  );
}