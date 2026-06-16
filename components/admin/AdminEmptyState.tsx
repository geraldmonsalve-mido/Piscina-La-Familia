import Link from "next/link";

interface AdminEmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

export default function AdminEmptyState({
  title,
  description,
  actionLabel,
  actionHref,
}: AdminEmptyStateProps) {
  return (
    <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-gradient-to-br from-slate-50 to-cyan-50/50 p-10 text-center">
      <div className="mx-auto flex size-16 items-center justify-center rounded-3xl bg-cyan-100 text-3xl">
        🏊
      </div>
      <h3 className="mt-5 text-xl font-black text-slate-950">{title}</h3>
      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
        {description}
      </p>
      {actionLabel && actionHref && (
        <div className="mt-6">
          <Link
            href={actionHref}
            className="inline-flex rounded-2xl bg-cyan-300 px-5 py-3 text-sm font-black text-slate-950 hover:bg-cyan-200"
          >
            {actionLabel}
          </Link>
        </div>
      )}
    </div>
  );
}
