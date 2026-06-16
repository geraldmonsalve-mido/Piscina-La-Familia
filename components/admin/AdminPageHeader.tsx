import Link from "next/link";

interface AdminPageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  primaryAction?: {
    label: string;
    href: string;
  };
  secondaryAction?: {
    label: string;
    href: string;
  };
}

export default function AdminPageHeader({
  eyebrow = "Piscina La Familia",
  title,
  description,
  primaryAction,
  secondaryAction,
}: AdminPageHeaderProps) {
  return (
    <div className="mb-8 overflow-hidden rounded-[2rem] border border-white bg-white shadow-xl shadow-cyan-950/5">
      <div className="relative bg-slate-950 p-6 text-white sm:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(34,211,238,0.28),transparent_34%),radial-gradient(circle_at_85%_0%,rgba(45,212,191,0.22),transparent_30%)]" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-200">
              {eyebrow}
            </p>
            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              {title}
            </h1>
            {description && (
              <p className="mt-3 max-w-3xl text-sm leading-6 text-cyan-50/80 sm:text-base">
                {description}
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            {secondaryAction && (
              <Link
                href={secondaryAction.href}
                className="rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-black text-white transition hover:bg-white/15"
              >
                {secondaryAction.label}
              </Link>
            )}

            {primaryAction && (
              <Link
                href={primaryAction.href}
                className="rounded-2xl bg-cyan-300 px-5 py-3 text-sm font-black text-slate-950 shadow-lg shadow-cyan-950/20 transition hover:bg-cyan-200"
              >
                {primaryAction.label}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
