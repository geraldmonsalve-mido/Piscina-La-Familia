import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminBadge from "@/components/admin/AdminBadge";
import { locations, priceLabel } from "@/lib/admin-demo-data";

export default function AdminDisponibilidadPage() {
  return (
    <main className="min-h-screen bg-[#f3fbff] p-4 sm:p-6 lg:p-8">
      <AdminPageHeader title="Disponibilidad" description="Configuración base de sedes, precios, capacidad y turnos." />

      <section className="grid gap-6 lg:grid-cols-2">
        {locations.map((location) => (
          <div key={location.id} className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-xl shadow-cyan-950/5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.2em] text-cyan-700">Sede</p>
                <h2 className="mt-2 text-3xl font-black text-slate-950">{location.name}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">{location.address}</p>
              </div>
              <AdminBadge tone="emerald">Activa</AdminBadge>
            </div>

            <div className="mt-6 grid gap-3">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Precios</p>
                <p className="mt-1 font-black text-slate-950">{priceLabel(location.id)}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Turnos</p>
                <p className="mt-1 font-black text-slate-950">10:00 a.m. - 6:00 p.m. / 7:00 p.m. - 1:00 a.m.</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Capacidad</p>
                <p className="mt-1 font-black text-slate-950">50 personas máximo</p>
              </div>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
