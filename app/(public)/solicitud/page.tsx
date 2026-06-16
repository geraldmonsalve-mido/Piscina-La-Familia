import Link from "next/link";
import PublicLeadForm from "@/components/public/PublicLeadForm";

export const metadata = {
  title: "Solicitar reserva — Piscina La Familia",
  description: "Consulta disponibilidad para reservar Piscina La Familia.",
};

export default function SolicitudPage() {
  return (
    <main className="min-h-screen bg-[#eef9ff]">
      <section className="relative overflow-hidden bg-slate-950 px-4 py-16 text-white sm:px-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.26),transparent_32%),radial-gradient(circle_at_80%_0%,rgba(45,212,191,0.2),transparent_30%)]" />
        <div className="relative mx-auto max-w-6xl">
          <Link href="/" className="text-sm font-black text-cyan-200">
            ← Volver al inicio
          </Link>
          <h1 className="mt-8 max-w-4xl text-5xl font-black tracking-tight">
            Solicita tu reserva privada
          </h1>
          <p className="mt-4 max-w-2xl text-lg font-bold leading-8 text-cyan-50/75">
            No cobramos automáticamente. Primero confirmamos disponibilidad, condiciones y abono por WhatsApp.
          </p>
        </div>
      </section>

      <section className="mx-auto -mt-10 max-w-4xl px-4 pb-16 sm:px-6">
        <PublicLeadForm />
      </section>
    </main>
  );
}
