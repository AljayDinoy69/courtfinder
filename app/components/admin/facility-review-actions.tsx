
"use client";

import { useActionState } from "react";
import {
  reviewFacility,
  type AdminActionState,
} from "@/app/actions/admin";

const initialState: AdminActionState = {
  success: false,
  message: "",
};

export default function FacilityReviewActions({
  facilityId,
}: {
  facilityId: string;
}) {
  const [state, formAction, isPending] = useActionState(
    reviewFacility,
    initialState
  );

  return (
    <div className="mt-4">
      <div className="flex flex-wrap gap-2">
        <form action={formAction}>
          <input
            type="hidden"
            name="facility_id"
            value={facilityId}
          />
          <input
            type="hidden"
            name="decision"
            value="approve"
          />

          <button
            type="submit"
            disabled={isPending}
            className="rounded-xl bg-[#008840] px-4 py-2.5 text-sm font-bold text-white hover:bg-green-700 disabled:opacity-50"
          >
            {isPending ? "Saving..." : "Approve & Publish"}
          </button>
        </form>

        <form action={formAction}>
          <input
            type="hidden"
            name="facility_id"
            value={facilityId}
          />
          <input
            type="hidden"
            name="decision"
            value="return"
          />

          <button
            type="submit"
            disabled={isPending}
            className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Return to Draft
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
