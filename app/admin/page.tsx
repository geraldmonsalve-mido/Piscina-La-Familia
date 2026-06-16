import Link from "next/link";
import AdminBadge from "@/components/admin/AdminBadge";
import {
  demoLeads,
  demoReservations,
  locations,
  statusTone,
} from "@/lib/admin-demo-data";

function percent(value: number, total: number) {
  if (!total) return 0;
  return Math.round((value / total) * 100);
}

function money(value: number) {
  return `$${value.toLocaleString("en-US")}`;
}

const revenueTrend = [
  { id: "lun", label: "L", value: 90 },
  { id: "mar", label: "M", value: 70 },
  { id: "mie", label: "M", value: 160 },
  { id: "jue", label: "J", value: 90 },
  { id: "vie", label: "V", value: 220 },
  { id: "sab", label: "S", value: 320 },
  { id: "dom", label: "D", value: 220 },
];

const occupancyTrend = [
  { id: "lun", label: "L", value: 25 },
  { id: "mar", label: "M", value: 38 },
  { id: "mie", label: "M", value: 50 },
  { id: "jue", label: "J", value: 44 },
  { id: "vie", label: "V", value: 82 },
  { id: "sab", label: "S", value: 96 },
  { id: "dom", label: "D", value: 75 },
];

const quickActions = [
  { href: "/admin/calendario", label: "Calendario", hint: "Ver turnos", tone: "cyan" },
  { href: "/admin/reservas", label: "Reservas", hint: "Gestionar", tone: "slate" },
  { href: "/admin/solicitudes", label: "Solicitudes", hint: "Responder", tone: "amber" },
  { href: "/admin/ingresos", label: "Ingresos", hint: "Caja", tone: "emerald" },
];

export default function AdminDashboardPage() {
  const totalRevenue = demoReservations.reduce((sum, item) => sum + item.total, 0);
  const paidRevenue = demoReservations
    .filter((item) => item.payment === "paid")
    .reduce((sum, item) => sum + item.total, 0);
  const pendingRevenue = totalRevenue - paidRevenue;

  const pendingReservations = demoReservations.filter((item) => item.status === "pending").length;
  const confirmedReservations = demoReservations.filter((item) => item.status === "confirmed").length;
  const conversionRate = percent(confirmedReservations, demoReservations.length);

  const sierraCount = demoReservations.filter((item) => item.locationId === "sierra-maestra").length;
  const cortijosCount = demoReservations.filter((item) => item.locationId === "los-cortijos").length;
  const totalReservations = demoReservations.length || 1;
  const maxRevenue = Math.max(...revenueTrend.map((item) => item.value));
  const peakOccupancy = Math.max(...occupancyTrend.map((item) => item.value));

  const leadingLocation = sierraCount >= cortijosCount ? "Sierra Maestra" : "Los Cortijos";
  const nextAction =
    pendingReservations > 0
      ? "Confirmar reservas pendientes"
      : pendingRevenue > 0
      ? "Conciliar pagos"
      : "Revisar disponibilidad";

  return (
    <main className="min-h-screen bg-[#eef9ff] p-4">
      <div className="mx-auto grid max-w-[1440px] gap-3">
        <header className="relative overflow-hidden rounded-[1.35rem] bg-slate-950 px-5 py-4 text-white shadow-xl shadow-cyan-950/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(34,211,238,0.28),transparent_30%),radial-gradient(circle_at_88%_0%,rgba(45,212,191,0.22),transparent_28%)]" />

          <div className="relative grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-cyan-200">
                Panel operativo · Piscina La Familia
              </p>
              <h1 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">
                Centro de control
              </h1>
              <p className="mt-1 max-w-3xl truncate text-xs text-cyan-50/72 sm:text-sm">
                Reservas, caja, ocupación, sedes, clientes y solicitudes en una vista ejecutiva.
              </p>
            </div>

            <div className="flex flex-wrap justify-start gap-2 lg:justify-end">
              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-black text-white hover:bg-white/15"
              >
                Ver sitio ↗
              </a>

              <Link
                href="/admin/reservas/nueva"
                className="rounded-2xl bg-cyan-300 px-4 py-2.5 text-sm font-black text-slate-950 hover:bg-cyan-200"
              >
                Nueva reserva
              </Link>
            </div>
          </div>
        </header>

        <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[1.25rem] bg-white p-4 shadow-lg shadow-cyan-950/5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                Caja estimada
              </p>
              <AdminBadge tone="emerald">Mes</AdminBadge>
            </div>
            <p className="mt-3 text-3xl font-black leading-none text-slate-950">
              {money(totalRevenue)}
            </p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-300 to-cyan-300"
                style={{ width: `${percent(paidRevenue, totalRevenue)}%` }}
              />
            </div>
            <p className="mt-2 text-xs font-bold text-slate-500">
              {money(pendingRevenue)} por conciliar
            </p>
          </div>

          <div className="rounded-[1.25rem] bg-white p-4 shadow-lg shadow-cyan-950/5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                Conversión
              </p>
              <AdminBadge tone="cyan">{conversionRate}%</AdminBadge>
            </div>
            <p className="mt-3 text-3xl font-black leading-none text-slate-950">
              {confirmedReservations}/{demoReservations.length}
            </p>
            <p className="mt-3 text-xs font-bold text-slate-500">
              Reservas confirmadas vs. solicitudes activas
            </p>
          </div>

          <div className="rounded-[1.25rem] bg-white p-4 shadow-lg shadow-cyan-950/5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                Riesgo operativo
              </p>
              <AdminBadge tone={pendingReservations > 0 ? "amber" : "emerald"}>
                {pendingReservations > 0 ? "Atención" : "OK"}
              </AdminBadge>
            </div>
            <p className="mt-3 text-3xl font-black leading-none text-slate-950">
              {pendingReservations}
            </p>
            <p className="mt-3 text-xs font-bold text-slate-500">
              Reservas pendientes de confirmación
            </p>
          </div>

          <div className="rounded-[1.25rem] bg-white p-4 shadow-lg shadow-cyan-950/5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                Pico de ocupación
              </p>
              <AdminBadge tone="rose">{peakOccupancy}%</AdminBadge>
            </div>
            <p className="mt-3 text-3xl font-black leading-none text-slate-950">
              Sábado
            </p>
            <p className="mt-3 text-xs font-bold text-slate-500">
              Mayor presión operativa de la semana
            </p>
          </div>
        </section>

        <section className="grid gap-3 xl:grid-cols-[1.55fr_0.95fr]">
          <div className="grid gap-3">
            <div className="overflow-hidden rounded-[1.35rem] bg-white shadow-xl shadow-cyan-950/5">
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.24em] text-cyan-700">
                    Agenda prioritaria
                  </p>
                  <h2 className="text-xl font-black text-slate-950">
                    Reservas próximas
                  </h2>
                </div>

                <Link
                  href="/admin/reservas"
                  className="rounded-2xl bg-cyan-50 px-4 py-2 text-sm font-black text-cyan-800 hover:bg-cyan-100"
                >
                  Ver todas
                </Link>
              </div>

              <div className="divide-y divide-slate-100">
                {demoReservations.map((reservation) => (
                  <Link
                    key={reservation.id}
                    href={`/admin/reservas/${reservation.id}`}
                    className="grid gap-3 px-5 py-3 transition hover:bg-cyan-50/45 lg:grid-cols-[88px_1fr_88px_130px]"
                  >
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-[0.2em] text-cyan-700">
                        {reservation.code}
                      </p>
                      <p className="mt-1 text-xs font-bold text-slate-500">
                        {reservation.date.slice(5)}
                      </p>
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate text-base font-black text-slate-950">
                        {reservation.customer}
                      </h3>
                      <p className="truncate text-sm text-slate-500">
                        {reservation.location} · {reservation.turn}
                      </p>
                    </div>

                    <div className="lg:text-right">
                      <p className="text-lg font-black text-slate-950">
                        ${reservation.total}
                      </p>
                      <p className="text-xs font-bold text-slate-400">
                        {reservation.guests} pax
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 lg:justify-end">
                      <AdminBadge tone={statusTone(reservation.status)}>
                        {reservation.status}
                      </AdminBadge>
                      <AdminBadge tone={statusTone(reservation.payment)}>
                        {reservation.payment}
                      </AdminBadge>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="grid gap-3 lg:grid-cols-[1fr_1fr_0.86fr]">
              <div className="rounded-[1.35rem] bg-white p-4 shadow-xl shadow-cyan-950/5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-700">
                      Ingresos
                    </p>
                    <h3 className="text-lg font-black text-slate-950">Semana</h3>
                  </div>
                  <span className="text-xs font-black text-slate-400">USD</span>
                </div>

                <div className="mt-4 flex h-20 items-end gap-2">
                  {revenueTrend.map((item) => (
                    <div key={item.id} className="flex flex-1 flex-col items-center gap-1">
                      <div className="flex h-16 w-full items-end rounded-full bg-slate-100">
                        <div
                          className="w-full rounded-full bg-gradient-to-t from-cyan-500 to-cyan-200"
                          style={{ height: `${Math.max(16, percent(item.value, maxRevenue))}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-black text-slate-400">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[1.35rem] bg-white p-4 shadow-xl shadow-cyan-950/5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-700">
                      Ocupación
                    </p>
                    <h3 className="text-lg font-black text-slate-950">7 días</h3>
                  </div>
                  <span className="text-xs font-black text-slate-400">Turnos</span>
                </div>

                <div className="mt-4 grid grid-cols-7 gap-2">
                  {occupancyTrend.map((item) => (
                    <div key={item.id} className="text-center">
                      <div className="flex h-16 items-end rounded-2xl bg-slate-100 p-1">
                        <div
                          className={[
                            "w-full rounded-xl",
                            item.value > 80
                              ? "bg-rose-300"
                              : item.value > 55
                              ? "bg-amber-300"
                              : "bg-cyan-300",
                          ].join(" ")}
                          style={{ height: `${Math.max(18, item.value)}%` }}
                        />
                      </div>
                      <p className="mt-1 text-[10px] font-black text-slate-400">
                        {item.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-2">
                {quickActions.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={[
                      "rounded-[1.1rem] px-4 py-3 text-sm font-black transition",
                      item.tone === "cyan"
                        ? "bg-cyan-50 text-cyan-900 hover:bg-cyan-100"
                        : item.tone === "amber"
                        ? "bg-amber-50 text-amber-900 hover:bg-amber-100"
                        : item.tone === "emerald"
                        ? "bg-emerald-50 text-emerald-900 hover:bg-emerald-100"
                        : "bg-slate-100 text-slate-800 hover:bg-slate-200",
                    ].join(" ")}
                  >
                    <span className="flex items-center justify-between">
                      {item.label}
                      <span>→</span>
                    </span>
                    <span className="mt-0.5 block text-xs font-bold opacity-65">
                      {item.hint}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <aside className="grid gap-3">
            <div className="overflow-hidden rounded-[1.35rem] bg-white shadow-xl shadow-cyan-950/5">
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.24em] text-cyan-700">
                    Sedes
                  </p>
                  <h2 className="text-xl font-black text-slate-950">
                    Rendimiento
                  </h2>
                </div>

                <Link
                  href="/admin/disponibilidad"
                  className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-black text-slate-700 hover:bg-slate-200"
                >
                  Editar
                </Link>
              </div>

              <div className="grid gap-2 p-4">
                {locations.map((location) => {
                  const count = location.id === "sierra-maestra" ? sierraCount : cortijosCount;
                  const share = percent(count, totalReservations);

                  return (
                    <div key={location.id} className="rounded-[1.1rem] bg-slate-50 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="truncate text-lg font-black text-slate-950">
                            {location.name}
                          </h3>
                          <p className="mt-1 truncate text-sm text-slate-500">
                            {location.address}
                          </p>
                        </div>

                        <AdminBadge tone="cyan">{share}%</AdminBadge>
                      </div>

                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-emerald-300"
                          style={{ width: `${share}%` }}
                        />
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-black text-slate-500">
                        <div className="rounded-xl bg-white px-3 py-2">
                          {count} reservas
                        </div>
                        <div className="rounded-xl bg-white px-3 py-2">
                          Cap. 50
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[1.35rem] bg-slate-950 p-4 text-white shadow-xl shadow-cyan-950/10">
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-cyan-200">
                Inteligencia operativa
              </p>

              <div className="mt-4 grid gap-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-cyan-50/70">Sede líder</span>
                  <span className="font-black">{leadingLocation}</span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-cyan-50/70">Por cobrar</span>
                  <span className="font-black text-amber-200">{money(pendingRevenue)}</span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-cyan-50/70">Leads abiertos</span>
                  <span className="font-black">{demoLeads.length}</span>
                </div>

                <div className="rounded-2xl bg-white/8 p-3">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-200">
                    Siguiente acción
                  </p>
                  <p className="mt-1 font-black text-white">{nextAction}</p>
                </div>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
