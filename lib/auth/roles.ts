export const dashboardPathByRole = {
  admin: "/admin",
  owner: "/dashboard/owner",
  player: "/dashboard/player",
} as const;

export type AppRole = keyof typeof dashboardPathByRole;

export const publicSignupRoles = ["player", "owner"] as const satisfies readonly AppRole[];

export type PublicSignupRole = (typeof publicSignupRoles)[number];

export function getDashboardPath(role: unknown): string | null {
  if (
    typeof role !== "string" ||
    !Object.prototype.hasOwnProperty.call(dashboardPathByRole, role)
  ) {
    return null;
  }

  return dashboardPathByRole[role as AppRole];
}