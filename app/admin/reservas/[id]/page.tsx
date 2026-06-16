import Link from "next/link";
import AdminBadge from "@/components/admin/AdminBadge";
import ReservationActions from "@/components/admin/ReservationActions";
import { createAdminClient } from "@/lib/supabase/admin";

type Reservation = {
  id: string;
  code: string;
  customer_name: string;
  customer_phone: string;
  location_name: string;
  reservation_date: string;
  turn_label: string;
  guests: number;
  total_amount: number;
  amount_paid: number;
  balance_due: number;
  status: string;
  payment_status: string;
  origin: string;
  internal_notes?: string | null;
};

function statusLabel(value: string) {
  const labels: Record<string, string> = {
    pending: "Pendiente",
    confirmed: "Confirmada",
    cancelled: "Cancelada",
    completed: "Completada",
    no_show: "No asistió",
  };

  return labels[value] || value;
}

function paymentLabel(value: string) {
  const labels: Record<string, string> = {
    unpaid: "Sin pago",
    partial: "Abono",
    paid: "Pagado",
    refunded: "Reembolsado",
  };

  return labels[value] || value;
}

function originLabel(value: string) {
  const labels: Record<string, string> = {
    manual: "Manual",
    web: "Web",
    whatsapp: "WhatsApp",
    instagram: "Instagram",
    call: "Llamada",
  };

  return labels[value] || value;
}

function tone(value: string): "cyan" | "emerald" | "amber" | "rose" | "slate" {
  if (value === "confirmed") return "cyan";
  if (value === "paid" || value === "completed") return "emerald";
  if (value === "pending" || value === "partial" || value === "unpaid") return "amber";
  if (value === "cancelled" || value === "no_show" || value === "refunded") return "rose";
  return "slate";
}

async function getReservation(id: string) {
  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("piscina_reservations")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return { reservation: null, error: error.message };
    }

    return { reservation: data as Reservation, error: null };
  } catch (error) {
    return {
      reservation: null,
      error: error instanceof Error ? error.message : "Error desconocido.",
    };
  }
}

export default async function AdminReservaDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { reservation, error } = await getReservation(id);

  if (!reservation) {
    return (
      <main className="min-h-screen bg-[#eef9ff] p-4">
        <div className="mx-auto max-w-[1440px] rounded-[1.35rem] bg-white p-8 shadow-xl shadow-cyan-950/5">
          <h1 className="text-3xl font-black text-slate-950">Reserva no encontrada</h1>
          <p className="mt-2 text-sm font-bold text-rose-700">{error}</p>
          <Link
            href="/admin/reservas"
            className="mt-6 inline-flex rounded-2xl bg-cyan-300 px-5 py-3 text-sm font-black text-slate-950"
          >
            Volver a reservas
          </Link>
        </div>
      </main>
    );
  }

  const phone = reservation.customer_phone.replace(/\D/g, "").replace(/^0/, "");
  const whatsappMessage = encodeURIComponent(
    `Hola ${reservation.customer_name}, tu reserva en Piscina La Familia ${reservation.location_name} para el ${reservation.reservation_date} en el turno ${reservation.turn_label} está ${statusLabel(reservation.status).toLowerCase()}. Total: $${reservation.total_amount}. Abono: $${reservation.amount_paid || 0}. Por cobrar: $${reservation.balance_due || 0}.`
  );
  const whatsappUrl = `https://wa.me/58${phone}?text=${whatsappMessage}`;

  const details = [
    ["Cliente", reservation.customer_name],
    ["WhatsApp", reservation.customer_phone],
    ["Sede", reservation.location_name],
    ["Fecha", reservation.reservation_date],
    ["Turno", reservation.turn_label],
    ["Asistentes", String(reservation.guests)],
    ["Total", `$${reservation.total_amount || 0}`],
    ["Abono recibido", `$${reservation.amount_paid || 0}`],
    ["Por cobrar", `$${reservation.balance_due || 0}`],
    ["Origen", originLabel(reservation.origin)],
  ];

  return (
    <main className="min-h-screen bg-[#eef9ff] p-4">
      <div className="mx-auto grid max-w-[1440px] gap-4">
        <header className="relative overflow-hidden rounded-[1.35rem] bg-slate-950 px-6 py-5 text-white shadow-xl shadow-cyan-950/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(34,211,238,0.28),transparent_30%),radial-gradient(circle_at_88%_0%,rgba(45,212,191,0.22),transparent_28%)]" />

          <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-cyan-200">
                Reserva
              </p>
              <h1 className="mt-1 text-3xl font-black tracking-tight">
                {reservation.code}
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-cyan-50/72">
                Detalle operativo conectado a Supabase.
              </p>
            </div>

            <Link
              href="/admin/reservas"
              className="rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-black text-white hover:bg-white/15"
            >
              Volver a reservas
            </Link>
          </div>
        </header>

        <section className="grid gap-4 xl:grid-cols-[1fr_360px]">
          <div className="rounded-[1.35rem] bg-white p-6 shadow-xl shadow-cyan-950/5">
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-cyan-700">
              Datos principales
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {details.map(([label, value]) => (
                <div key={label} className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                    {label}
                  </p>
                  <p className="mt-1 font-black text-slate-950">{value}</p>
                </div>
              ))}
            </div>

            {reservation.internal_notes && (
              <div className="mt-4 rounded-2xl bg-amber-50 p-4">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-700">
                  Notas internas
                </p>
                <p className="mt-1 text-sm font-bold text-amber-950">
                  {reservation.internal_notes}
                </p>
              </div>
            )}
          </div>

          <aside className="rounded-[1.35rem] bg-white p-6 shadow-xl shadow-cyan-950/5">
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-cyan-700">
              Acciones
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <AdminBadge tone={tone(reservation.status)}>
                {statusLabel(reservation.status)}
              </AdminBadge>

              <AdminBadge tone={tone(reservation.payment_status)}>
                {paymentLabel(reservation.payment_status)}
              </AdminBadge>
            </div>

            <div className="mt-6">
              <ReservationActions
                reservationId={reservation.id}
                whatsappUrl={whatsappUrl}
              />
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
