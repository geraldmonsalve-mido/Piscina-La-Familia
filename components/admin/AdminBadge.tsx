interface AdminBadgeProps {
  children: React.ReactNode;
  tone?: "cyan" | "emerald" | "amber" | "rose" | "slate";
}

const toneMap = {
  cyan: "bg-cyan-100 text-cyan-800",
  emerald: "bg-emerald-100 text-emerald-800",
  amber: "bg-amber-100 text-amber-800",
  rose: "bg-rose-100 text-rose-800",
  slate: "bg-slate-100 text-slate-700",
};

export default function AdminBadge({ children, tone = "slate" }: AdminBadgeProps) {
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${toneMap[tone]}`}>
      {children}
    </span>
  );
}
