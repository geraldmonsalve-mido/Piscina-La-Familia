interface AdminStatCardProps {
  label: string;
  value: string | number;
  hint?: string;
  tone?: "cyan" | "emerald" | "amber" | "rose" | "slate";
}

const toneMap = {
  cyan: "bg-cyan-50 text-cyan-700",
  emerald: "bg-emerald-50 text-emerald-700",
  amber: "bg-amber-50 text-amber-700",
  rose: "bg-rose-50 text-rose-700",
  slate: "bg-slate-100 text-slate-700",
};

export default function AdminStatCard({
  label,
  value,
  hint,
  tone = "cyan",
}: AdminStatCardProps) {
  return (
    <div className="rounded-[1.75rem] border border-slate-100 bg-white p-6 shadow-xl shadow-cyan-950/5">
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm font-black text-slate-500">{label}</p>
        <span className={`rounded-full px-3 py-1 text-xs font-black ${toneMap[tone]}`}>
          Live
        </span>
      </div>
      <p className="mt-5 text-4xl font-black tracking-tight text-slate-950">
        {value}
      </p>
      {hint && <p className="mt-2 text-sm leading-6 text-slate-500">{hint}</p>}
    </div>
  );
}
