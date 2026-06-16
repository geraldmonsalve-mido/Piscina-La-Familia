import Link from "next/link";
import AdminBadge from "@/components/admin/AdminBadge";
import AdminEmptyState from "@/components/admin/AdminEmptyState";
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
};

function tone(value: string): "cyan" | "emerald" | "amber" | "rose" | "slate" {
  if (value === "confirmed") return "cyan";
  if (value === "paid" || value === "completed") return "emerald";
  if (value === "pending" || value === "partial" || value === "unpaid") return "amber";
  if (value === "cancelled" || value === "no_show" || value === "refunded") return "rose";
  return "slate";
}

async function getReservations(): Promise<{ reservations: Reservation[]; error?: string }> {
  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("piscina_reservations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return { reservations: [], error: error.message };
    }

    return { reservations: (data || []) as Reservation[] };
  } catch (error) {
    return {
      reservations: [],
      error: error instanceof Error ? error.message : "No se pudo conectar con Supabase.",
    };
  }
}

export default async function AdminReservasPage() {
  const { reservations, error } = await getReservations();

  return (
    <main className="min-h-screen bg-[#eef9ff] p-4">
      <div className="mx-auto grid max-w-[1440px] gap-4">
        <header className="relative overflow-hidden rounded-[1.35rem] bg-slate-950 px-6 py-5 text-white shadow-xl shadow-cyan-950/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(34,211,238,0.28),transparent_30%),radial-gradient(circle_at_88%_0%,rgba(45,212,191,0.22),transparent_28%)]" />

          <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-cyan-200">
                Reservas
              </p>
              <h1 className="mt-1 text-3xl font-black tracking-tight">
                Gestión operativa
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-cyan-50/72">
                Listado real conectado a Supabase en public.piscina_reservations.
              </p>
            </div>

            <Link
              href="/admin/reservas/nueva"
              className="rounded-2xl bg-cyan-300 px-5 py-3 text-sm font-black text-slate-950 hover:bg-cyan-200"
            >
              Nueva reserva
            </Link>
          </div>
        </header>

        {error && (
          <div className="rounded-2xl bg-rose-100 p-4 text-sm font-black text-rose-800">
            Error Supabase: {error}
          </div>
        )}

        <section className="overflow-hidden rounded-[1.35rem] bg-white shadow-xl shadow-cyan-950/5">
          {reservations.length === 0 ? (
            <div className="p-6">
              <AdminEmptyState
                title="Todavía no hay reservas guardadas"
                description="Crea una reserva manual o selecciona un turno desde el calendario. Cuando se guarde aparecerá aquí."
                actionLabel="Crear reserva"
                actionHref="/admin/reservas/nueva"
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1080px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-[0.16em] text-slate-400">
                    <th className="px-5 py-4">Código</th>
                    <th>Cliente</th>
                    <th>Sede</th>
                    <th>Fecha</th>
                    <th>Turno</th>
                    <th>Asist.</th>
                    <th>Total</th>
                    <th>Abono</th>
                    <th>Por cobrar</th>
                    <th>Estado</th>
                    <th>Pago</th>
                    <th>Origen</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.map((reservation) => (
                    <tr key={reservation.id} className="border-b border-slate-100 hover:bg-cyan-50/35">
                      <td className="px-5 py-4 font-black text-cyan-700">
                        {reservation.code}
                      </td>
                      <td>
                        <p className="font-black text-slate-950">{reservation.customer_name}</p>
                        <p className="text-xs text-slate-500">{reservation.customer_phone}</p>
                      </td>
                      <td className="font-bold text-slate-700">{reservation.location_name}</td>
                      <td className="text-slate-600">{reservation.reservation_date}</td>
                      <td className="text-slate-600">{reservation.turn_label}</td>
                      <td className="font-black text-slate-950">{reservation.guests}</td>
                      <td className="font-black text-slate-950">${reservation.total_amount || 0}</td>
                      <td className="font-black text-emerald-700">${reservation.amount_paid || 0}</td>
                      <td className="font-black text-amber-700">${reservation.balance_due || 0}</td>
                      <td><AdminBadge tone={tone(reservation.status)}>{reservation.status}</AdminBadge></td>
                      <td><AdminBadge tone={tone(reservation.payment_status)}>{reservation.payment_status}</AdminBadge></td>
                      <td className="font-bold text-slate-500">{reservation.origin}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
