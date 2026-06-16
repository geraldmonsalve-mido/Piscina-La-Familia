import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Mi cuenta — Piscina La Familia",
};

type Reservation = {
  id: string;
  code?: string;
  date?: string;
  start_time?: string;
  end_time?: string;
  status?: string;
  payment_status?: string;
  total_amount?: number;
  location?: {
    name?: string;
  };
};

function formatDate(value?: string) {
  if (!value) return "Fecha pendiente";

  try {
    return new Intl.DateTimeFormat("es-VE", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(`${value}T12:00:00`));
  } catch {
    return value;
  }
}

function formatTime(value?: string) {
  if (!value) return "";
  const [hourRaw, minute = "00"] = value.split(":");
  let hour = Number(hourRaw);
  const suffix = hour >= 12 ? "p.m." : "a.m.";
  hour = hour % 12 || 12;
  return `${hour}:${minute} ${suffix}`;
}

export default async function CuentaPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?redirect=/cuenta");
  }

  let role = "customer";
  let displayName = user.email || "Cliente";

  try {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, full_name")
      .eq("id", user.id)
      .single();

    if (profile?.role) role = profile.role;
    if (profile?.full_name) displayName = profile.full_name;
  } catch {
    role = "customer";
  }

  const isAdmin =
    role === "admin" ||
    role === "superadmin" ||
    user.email === "gerald.monsalve@gmail.com";

  let reservations: Reservation[] = [];

  try {
    const { data } = await supabase
      .from("reservations")
      .select("*")
      .eq("customer_id", user.id)
      .order("created_at", { ascending: false })
      .limit(6);

    reservations = (data || []) as Reservation[];
  } catch {
    reservations = [];
  }

  return (
    <main className="min-h-screen bg-[#f3fbff]">
      <section className="relative overflow-hidden bg-slate-950 pt-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(103,232,249,0.28),transparent_32%),radial-gradient(circle_at_80%_10%,rgba(45,212,191,0.22),transparent_30%),linear-gradient(135deg,#061831,#0b5f73_58%,#0f766e)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#f3fbff]/70 to-transparent" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
          <div className="grid gap-8 rounded-[2rem] border border-white/15 bg-white/[0.08] p-6 shadow-2xl shadow-cyan-950/25 backdrop-blur-xl sm:p-8 lg:grid-cols-[1fr_360px] lg:p-10">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-black text-white">
                <span className="size-2 rounded-full bg-emerald-300" />
                Área cliente
              </div>

              <h1 className="mt-6 text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
                Hola, {displayName.includes("@") ? "Gerald" : displayName}
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-7 text-cyan-50/85 sm:text-lg">
                Gestiona tus turnos privados, revisa solicitudes y reserva tu próxima visita
                sin depender de mensajes sueltos.
              </p>

              <div className="mt-7 grid gap-3 text-sm font-bold text-white/90 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/15 bg-slate-950/20 px-4 py-3">
                  <span className="block text-xs uppercase tracking-[0.16em] text-cyan-200">
                    Cuenta
                  </span>
                  <span className="mt-1 block truncate">{user.email}</span>
                </div>

                <div className="rounded-2xl border border-white/15 bg-slate-950/20 px-4 py-3">
                  <span className="block text-xs uppercase tracking-[0.16em] text-cyan-200">
                    Capacidad
                  </span>
                  <span className="mt-1 block">Máximo 50 personas</span>
                </div>

                <div className="rounded-2xl border border-white/15 bg-slate-950/20 px-4 py-3">
                  <span className="block text-xs uppercase tracking-[0.16em] text-cyan-200">
                    Horarios
                  </span>
                  <span className="mt-1 block">Mañana o tarde</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center gap-4">
              {isAdmin && (
                <Link
                  href="/admin"
                  className="group rounded-[1.5rem] border border-amber-200 bg-amber-300 p-5 text-slate-950 shadow-xl shadow-amber-950/20 transition-all hover:-translate-y-0.5 hover:bg-amber-200"
                >
                  <span className="block text-xs font-black uppercase tracking-[0.22em] text-amber-900/70">
                    Admin
                  </span>
                  <span className="mt-2 flex items-center justify-between text-xl font-black">
                    Ir al panel
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </span>
                  <span className="mt-2 block text-sm font-semibold text-amber-950/70">
                    Gestiona reservas, sedes, solicitudes e ingresos.
                  </span>
                </Link>
              )}

              <Link
                href="/reservar"
                className="group rounded-[1.5rem] border border-cyan-200 bg-cyan-300 p-5 text-slate-950 shadow-xl shadow-cyan-950/20 transition-all hover:-translate-y-0.5 hover:bg-cyan-200"
              >
                <span className="block text-xs font-black uppercase tracking-[0.22em] text-cyan-900/70">
                  Reserva
                </span>
                <span className="mt-2 flex items-center justify-between text-xl font-black">
                  Nuevo turno
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </span>
                <span className="mt-2 block text-sm font-semibold text-cyan-950/70">
                  Elige sede, fecha y horario privado.
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-20 mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <div className="rounded-[1.75rem] border border-white bg-white p-6 shadow-xl shadow-cyan-950/5">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-black text-slate-500">Reservas</p>
              <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-bold text-cyan-700">
                Historial
              </span>
            </div>
            <p className="mt-5 text-4xl font-black text-slate-950">{reservations.length}</p>
            <p className="mt-2 text-sm text-slate-500">Reservas recientes en tu cuenta</p>
          </div>

          <div className="rounded-[1.75rem] border border-white bg-white p-6 shadow-xl shadow-cyan-950/5">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-black text-slate-500">Capacidad</p>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                Por sede
              </span>
            </div>
            <p className="mt-5 text-4xl font-black text-slate-950">50</p>
            <p className="mt-2 text-sm text-slate-500">Personas máximo por reserva</p>
          </div>

          <div className="rounded-[1.75rem] border border-white bg-white p-6 shadow-xl shadow-cyan-950/5">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-black text-slate-500">Modalidad</p>
              <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
                Privado
              </span>
            </div>
            <p className="mt-5 text-4xl font-black text-slate-950">Turnos</p>
            <p className="mt-2 text-sm text-slate-500">10 a.m. - 6 p.m. / 7 p.m. - 1 a.m.</p>
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-[2rem] border border-white bg-white shadow-xl shadow-cyan-950/5">
          <div className="border-b border-slate-100 p-6 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.2em] text-cyan-700">
                  Mis reservas
                </p>
                <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
                  Próximos turnos y solicitudes
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                  Aquí aparecerán tus reservas privadas con sede, horario, precio y estado de confirmación.
                </p>
              </div>

              <Link
                href="/reservar"
                className="inline-flex items-center justify-center rounded-2xl border border-cyan-200 bg-cyan-50 px-5 py-3 text-sm font-black text-cyan-800 transition-all hover:bg-cyan-100"
              >
                Reservar otro turno
              </Link>
            </div>
          </div>

          {reservations.length === 0 ? (
            <div className="p-6 sm:p-8">
              <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-gradient-to-br from-slate-50 to-cyan-50/60 p-10 text-center">
                <div className="mx-auto flex size-16 items-center justify-center rounded-3xl bg-cyan-100 text-3xl">
                  🏊
                </div>

                <h3 className="mt-5 text-xl font-black text-slate-950">
                  Todavía no tienes reservas
                </h3>

                <p className="mx-auto mt-3 max-w-md text-slate-600">
                  Separa tu primer turno privado y lo verás aquí con todos los detalles.
                </p>

                <div className="mt-6 flex justify-center">
                  <Link
                    href="/reservar"
                    className="inline-flex rounded-2xl bg-cyan-300 px-6 py-4 text-sm font-black text-slate-950 shadow-lg shadow-cyan-900/20 transition-all hover:bg-cyan-200"
                  >
                    Reservar ahora
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 p-6 sm:p-8">
              {reservations.map((reservation) => (
                <Link
                  key={reservation.id}
                  href={`/cuenta/reservas/${reservation.id}`}
                  className="rounded-[1.5rem] border border-slate-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-cyan-200 hover:shadow-lg"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-700">
                        {reservation.code || "Reserva"}
                      </p>
                      <h3 className="mt-2 text-xl font-black text-slate-950">
                        {reservation.location?.name || "Piscina La Familia"}
                      </h3>
                      <p className="mt-1 text-sm text-slate-500">
                        {formatDate(reservation.date)} ·{" "}
                        {formatTime(reservation.start_time)} -{" "}
                        {formatTime(reservation.end_time)}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-bold text-cyan-800">
                        {reservation.status || "pendiente"}
                      </span>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                        {reservation.payment_status || "sin pago"}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
