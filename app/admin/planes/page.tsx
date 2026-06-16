import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminBadge from "@/components/admin/AdminBadge";
import { reservationTypes } from "@/lib/admin-demo-data";

export default function AdminPlanesPage() {
  return (
    <main className="min-h-screen bg-[#f3fbff] p-4 sm:p-6 lg:p-8">
      <AdminPageHeader title="Planes" description="Tipos de reserva disponibles para el flujo comercial." />

      <section className="grid gap-5 md:grid-cols-3">
        {reservationTypes.map((type) => (
          <div key={type.id} className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-xl shadow-cyan-950/5">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-cyan-700">Tipo de reserva</p>
            <h2 className="mt-3 text-2xl font-black text-slate-950">{type.name}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">{type.description}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <AdminBadge tone="cyan">{type.duration_hours || 8}h aprox.</AdminBadge>
              <AdminBadge tone={type.requires_quote ? "amber" : "emerald"}>
                {type.requires_quote ? "Cotización" : "Reserva directa"}
              </AdminBadge>
              <AdminBadge tone="slate">50 máx.</AdminBadge>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
