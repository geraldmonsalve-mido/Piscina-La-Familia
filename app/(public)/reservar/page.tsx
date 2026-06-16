import ReservationFlow from "@/components/reservation/ReservationFlow";
import { locations, reservationTypes } from "@/lib/piscina-data";

export const metadata = {
  title: "Reservar — Piscina La Familia",
  description: "Reserva una piscina privada por turnos.",
};

export default function ReservarPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f6fbff] pt-24">
      <div className="absolute inset-x-0 top-0 h-[430px] bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.38),transparent_48%),linear-gradient(135deg,#06224a,#0b6f88_52%,#0f766e)]" />
      <div className="absolute left-[-8rem] top-28 h-72 w-72 rounded-full bg-cyan-300/25 blur-3xl" />
      <div className="absolute right-[-6rem] top-40 h-80 w-80 rounded-full bg-emerald-300/20 blur-3xl" />

      <section className="relative mx-auto max-w-7xl px-4 pb-16 pt-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center text-white">
          <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold backdrop-blur-xl">
            <span className="size-2 rounded-full bg-emerald-300" />
            Reservas privadas por turno
          </div>

          <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
            Reserva tu piscina privada
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-cyan-50/90">
            Elige sede, fecha y horario. No vendemos tickets individuales:
            reservas el espacio completo para tu grupo.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm font-bold text-white/85">
            <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur">
              2 sedes
            </span>
            <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur">
              Máximo 50 personas por reserva
            </span>
            <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur">
              Turno mañana y turno tarde
            </span>
          </div>
        </div>

        <div className="relative mx-auto mt-12 max-w-5xl rounded-[2rem] border border-white/70 bg-white/95 p-4 shadow-2xl shadow-cyan-950/20 backdrop-blur-xl sm:p-8">
          <ReservationFlow locations={locations} reservationTypes={reservationTypes} />
        </div>
      </section>
    </main>
  );
}
