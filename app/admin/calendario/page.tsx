import Link from "next/link";
import AdminBadge from "@/components/admin/AdminBadge";
import { createAdminClient } from "@/lib/supabase/admin";
import { adminLocations, calculateReservationPrice, turns } from "@/lib/reservation-pricing";

type CalendarReservation = {
  id: string;
  code: string;
  customer_name: string;
  customer_phone: string;
  location_id: string;
  reservation_date: string;
  turn_id: string;
  status: string;
  payment_status: string;
  amount_paid: number;
  balance_due: number;
};

function getWeekDays() {
  const today = new Date();
  const day = today.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;

  return Array.from({ length: 7 }).map((_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() + diffToMonday + index);

    const iso = date.toISOString().slice(0, 10);
    const label = new Intl.DateTimeFormat("es-VE", {
      weekday: "short",
      day: "numeric",
      month: "short",
    }).format(date);

    return { iso, label };
  });
}

function reservationKey(locationId: string, date: string, turnId: string) {
  return `${locationId}__${date}__${turnId}`;
}

function statusTone(status: string): "cyan" | "emerald" | "amber" | "rose" | "slate" {
  if (status === "confirmed") return "cyan";
  if (status === "completed") return "emerald";
  if (status === "pending") return "amber";
  if (status === "cancelled" || status === "no_show") return "rose";
  return "slate";
}

function paymentText(payment: string) {
  if (payment === "paid") return "Pagado";
  if (payment === "partial") return "Abono";
  if (payment === "refunded") return "Reembolso";
  return "Sin pago";
}

async function getCalendarReservations(days: { iso: string }[]) {
  try {
    const supabase = createAdminClient();

    const from = days[0]?.iso;
    const to = days[days.length - 1]?.iso;

    const { data, error } = await supabase
      .from("piscina_reservations")
      .select("id, code, customer_name, customer_phone, location_id, reservation_date, turn_id, status, payment_status, amount_paid, balance_due")
      .gte("reservation_date", from)
      .lte("reservation_date", to)
      .not("status", "in", "(cancelled,no_show)")
      .order("reservation_date", { ascending: true });

    if (error) {
      return {
        reservations: [] as CalendarReservation[],
        error: error.message,
      };
    }

    return {
      reservations: (data || []) as CalendarReservation[],
      error: null,
    };
  } catch (error) {
    return {
      reservations: [] as CalendarReservation[],
      error: error instanceof Error ? error.message : "No se pudo conectar con Supabase.",
    };
  }
}

export default async function AdminCalendarioPage() {
  const days = getWeekDays();
  const turnList = Object.values(turns);
  const { reservations, error } = await getCalendarReservations(days);

  const reservationMap = new Map<string, CalendarReservation>();

  for (const reservation of reservations) {
    reservationMap.set(
      reservationKey(
        reservation.location_id,
        reservation.reservation_date,
        reservation.turn_id
      ),
      reservation
    );
  }

  return (
    <main className="min-h-screen bg-[#eef9ff] p-4">
      <div className="mx-auto grid max-w-[1440px] gap-4">
        <header className="relative overflow-hidden rounded-[1.35rem] bg-slate-950 px-6 py-5 text-white shadow-xl shadow-cyan-950/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(34,211,238,0.28),transparent_30%),radial-gradient(circle_at_88%_0%,rgba(45,212,191,0.22),transparent_28%)]" />

          <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-cyan-200">
                Calendario operativo
              </p>
              <h1 className="mt-1 text-3xl font-black tracking-tight">
                Agenda semanal
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-cyan-50/72">
                Los turnos reservados se bloquean automáticamente desde Supabase.
              </p>
            </div>

            <Link
              href="/admin/reservas/nueva"
              className="rounded-2xl bg-cyan-300 px-5 py-3 text-sm font-black text-slate-950 hover:bg-cyan-200"
            >
              Crear reserva libre
            </Link>
          </div>
        </header>

        {error && (
          <div className="rounded-2xl bg-rose-100 p-4 text-sm font-black text-rose-800">
            Error Supabase: {error}
          </div>
        )}

        <section className="grid gap-4">
          {Object.values(adminLocations).map((location) => {
            const locationReservations = reservations.filter(
              (item) => item.location_id === location.id
            );

            return (
              <div
                key={location.id}
                className="overflow-hidden rounded-[1.35rem] bg-white shadow-xl shadow-cyan-950/5"
              >
                <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.24em] text-cyan-700">
                      {location.name}
                    </p>
                    <h2 className="mt-1 text-2xl font-black text-slate-950">
                      L-J ${location.weekdayPrice} · V-D ${location.weekendPrice}
                    </h2>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <AdminBadge tone="cyan">Capacidad 50</AdminBadge>
                    <AdminBadge tone="emerald">2 turnos/día</AdminBadge>
                    <AdminBadge tone={locationReservations.length ? "amber" : "slate"}>
                      {locationReservations.length} reservados
                    </AdminBadge>
                  </div>
                </div>

                <div className="overflow-x-auto p-4">
                  <div className="min-w-[980px] overflow-hidden rounded-[1.15rem] border border-slate-100">
                    <div className="grid grid-cols-[120px_repeat(7,1fr)] bg-slate-950 text-white">
                      <div className="border-r border-white/10 px-4 py-3 text-xs font-black uppercase tracking-[0.18em] text-cyan-200">
                        Turno
                      </div>

                      {days.map((day) => (
                        <div
                          key={`${location.id}-${day.iso}-header`}
                          className="border-r border-white/10 px-3 py-3 last:border-r-0"
                        >
                          <p className="text-sm font-black capitalize">{day.label}</p>
                          <p className="mt-0.5 text-xs font-bold text-cyan-100/65">{day.iso}</p>
                        </div>
                      ))}
                    </div>

                    {turnList.map((turn) => (
                      <div
                        key={`${location.id}-${turn.id}-row`}
                        className="grid grid-cols-[120px_repeat(7,1fr)] border-t border-slate-100 bg-white"
                      >
                        <div className="flex flex-col justify-center border-r border-slate-100 bg-slate-50 px-4 py-4">
                          <p className="text-base font-black text-slate-950">{turn.label}</p>
                          <p className="mt-1 text-xs font-bold text-slate-500">{turn.display}</p>
                        </div>

                        {days.map((day) => {
                          const price = calculateReservationPrice(location.id, day.iso);
                          const reserved = reservationMap.get(
                            reservationKey(location.id, day.iso, turn.id)
                          );

                          if (reserved) {
                            return (
                              <Link
                                key={`${location.id}-${day.iso}-${turn.id}`}
                                href={`/admin/reservas/${reserved.id}`}
                                className="group flex min-h-[128px] flex-col justify-between border-r border-slate-100 bg-amber-50 p-3 transition hover:bg-amber-100 last:border-r-0"
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <span className="rounded-full bg-amber-200 px-3 py-1 text-xs font-black text-amber-900">
                                    Apartado
                                  </span>
                                  <span className="text-xs font-black text-amber-800 opacity-0 transition group-hover:opacity-100">
                                    Ver →
                                  </span>
                                </div>

                                <div>
                                  <p className="truncate text-sm font-black text-slate-950">
                                    {reserved.customer_name}
                                  </p>
                                  <p className="mt-1 text-xs font-bold text-slate-500">
                                    {reserved.code}
                                  </p>
                                  <div className="mt-2 flex flex-wrap gap-1">
                                    <AdminBadge tone={statusTone(reserved.status)}>
                                      {reserved.status === 'confirmed' ? 'Confirmada' : reserved.status === 'pending' ? 'Pendiente' : reserved.status === 'completed' ? 'Completada' : reserved.status}
                                    </AdminBadge>
                                    <span className="rounded-full bg-white px-2 py-1 text-[10px] font-black text-slate-600">
                                      {paymentText(reserved.payment_status)}
                                    </span>
                                  </div>
                                  {reserved.balance_due > 0 && (
                                    <p className="mt-2 text-xs font-black text-amber-800">
                                      Por cobrar: ${reserved.balance_due}
                                    </p>
                                  )}
                                </div>
                              </Link>
                            );
                          }

                          return (
                            <Link
                              key={`${location.id}-${day.iso}-${turn.id}`}
                              href={`/admin/reservas/nueva?location_id=${location.id}&date=${day.iso}&turn_id=${turn.id}`}
                              className="group flex min-h-[128px] flex-col justify-between border-r border-slate-100 p-3 transition hover:bg-cyan-50 last:border-r-0"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-black text-cyan-800">
                                  ${price}
                                </span>
                                <span className="text-xs font-black text-cyan-700 opacity-0 transition group-hover:opacity-100">
                                  Reservar →
                                </span>
                              </div>

                              <div>
                                <p className="text-sm font-black text-slate-950">Disponible</p>
                                <p className="mt-1 text-xs font-bold text-slate-500">
                                  Crear reserva
                                </p>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      </div>
    </main>
  );
}
