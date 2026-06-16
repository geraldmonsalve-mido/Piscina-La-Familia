import Link from "next/link";
import AdminReservationForm from "@/components/admin/AdminReservationForm";

export default function AdminNuevaReservaPage() {
  return (
    <main className="min-h-screen bg-[#eef9ff] p-4">
      <div className="mx-auto grid max-w-[1440px] gap-4">
        <header className="relative overflow-hidden rounded-[1.35rem] bg-slate-950 px-6 py-5 text-white shadow-xl shadow-cyan-950/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(34,211,238,0.28),transparent_30%),radial-gradient(circle_at_88%_0%,rgba(45,212,191,0.22),transparent_28%)]" />

          <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-cyan-200">
                Reserva manual
              </p>
              <h1 className="mt-1 text-3xl font-black tracking-tight">
                Crear reserva
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-cyan-50/72">
                Guarda reservas reales en Supabase. Si vienes desde calendario, sede, fecha y turno ya vienen preseleccionados.
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

        <AdminReservationForm />
      </div>
    </main>
  );
}
