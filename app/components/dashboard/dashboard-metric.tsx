type DashboardMetricProps = {
  label: string;
  value: number;
  icon: string;
  detail: string;
  tone?: "blue" | "green" | "amber" | "ink";
};

const toneClasses = {
  blue: "border-[#c9e2f2] bg-white text-[#006cb7]",
  green: "border-[#ccebdc] bg-white text-[#008840]",
  amber: "border-[#f3dfb2] bg-white text-[#a66a00]",
  ink: "border-zinc-200 bg-white text-zinc-800",
};

export default function DashboardMetric({
  label,
  value,
  icon,
  detail,
  tone = "blue",
}: DashboardMetricProps) {
  return (
    <article className={`dashboard-metric rounded-xl border p-5 shadow-[0_8px_24px_rgba(12,40,52,0.04)] ${toneClasses[tone]}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">
            {label}
          </p>
          <p className="mt-3 text-3xl font-bold tabular-nums text-zinc-950">
            {value.toLocaleString()}
          </p>
        </div>
        <span aria-hidden="true" className="flex h-10 w-10 items-center justify-center rounded-lg bg-current/10 text-xl">
          {icon}
        </span>
      </div>
      <p className="mt-4 border-t border-zinc-100 pt-3 text-xs text-zinc-500">
        {detail}
      </p>
    </article>
  );
}