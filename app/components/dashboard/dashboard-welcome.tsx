import type { ReactNode } from "react";

type DashboardWelcomeProps = {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
};

export default function DashboardWelcome({
  eyebrow,
  title,
  description,
  children,
}: DashboardWelcomeProps) {
  return (
    <section className="dashboard-reveal relative isolate flex min-h-64 flex-col justify-between gap-8 overflow-hidden rounded-xl bg-[#082f36] p-6 text-white sm:flex-row sm:items-end sm:p-8 lg:min-h-72 lg:p-10">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-cover bg-[center_48%]"
        style={{ backgroundImage: "url('/images/courtfinder-hero.jpg')" }}
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#052f38]/95 via-[#075b70]/75 to-[#081f29]/45" />
      <div aria-hidden="true" className="dashboard-court-plane" />

      <div className="relative max-w-2xl">
        <p className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.24em] text-emerald-200 sm:text-xs">
          <span className="h-2 w-2 rounded-full bg-[#29c278] shadow-[0_0_14px_#29c278]" />
          {eyebrow}
        </p>
        <h1 className="max-w-2xl font-oswald text-3xl font-bold uppercase leading-tight sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-white/80 sm:text-base">
          {description}
        </p>
      </div>

      {children && <div className="relative shrink-0">{children}</div>}
      <span className="pointer-events-none absolute bottom-5 right-6 hidden font-oswald text-xs font-semibold uppercase tracking-[0.24em] text-white/50 lg:block">
        Discover. Compare. Play.
      </span>
    </section>
  );
}