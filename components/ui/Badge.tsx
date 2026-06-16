import type { ReservationStatus, QuoteStatus } from "@/lib/types";

type Variant =
  | "default"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral";

const variants: Record<Variant, string> = {
  default: "bg-pool-100 text-pool-700",
  success: "bg-emerald-100 text-emerald-700",
  warning: "bg-sol-100 text-sol-700",
  danger: "bg-red-100 text-red-700",
  info: "bg-agua-100 text-agua-700",
  neutral: "bg-slate-100 text-slate-600",
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
}

export default function Badge({
  children,
  variant = "default",
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

const reservationStatusMap: Record<
  ReservationStatus,
  { label: string; variant: Variant }
> = {
  pending: { label: "Pendiente", variant: "warning" },
  confirmed: { label: "Confirmada", variant: "success" },
  cancelled: { label: "Cancelada", variant: "danger" },
  completed: { label: "Completada", variant: "neutral" },
  no_show: { label: "No se presentó", variant: "neutral" },
};

const quoteStatusMap: Record<QuoteStatus, { label: string; variant: Variant }> =
  {
    pending: { label: "Pendiente", variant: "warning" },
    reviewing: { label: "En revisión", variant: "info" },
    quoted: { label: "Cotizada", variant: "default" },
    accepted: { label: "Aceptada", variant: "success" },
    rejected: { label: "Rechazada", variant: "danger" },
  };

export function ReservationBadge({ status }: { status: ReservationStatus }) {
  const { label, variant } = reservationStatusMap[status];
  return <Badge variant={variant}>{label}</Badge>;
}

export function QuoteBadge({ status }: { status: QuoteStatus }) {
  const { label, variant } = quoteStatusMap[status];
  return <Badge variant={variant}>{label}</Badge>;
}
