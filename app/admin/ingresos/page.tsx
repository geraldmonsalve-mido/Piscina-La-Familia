import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminStatCard from "@/components/admin/AdminStatCard";
import { demoReservations } from "@/lib/admin-demo-data";

export default function AdminIngresosPage() {
  const total = demoReservations.reduce((sum, item) => sum + item.total, 0);
  const paid = demoReservations.filter((item) => item.payment === "paid").reduce((sum, item) => sum + item.total, 0);
  const pending = total - paid;

  return (
    <main className="min-h-screen bg-[#f3fbff] p-4 sm:p-6 lg:p-8">
      <AdminPageHeader title="Ingresos" description="Resumen financiero estimado por reservas, pagos y abonos." />

      <section className="grid gap-5 md:grid-cols-3">
        <AdminStatCard label="Total estimado" value={`$${total}`} hint="Reservas demo registradas." tone="emerald" />
        <AdminStatCard label="Pagado" value={`$${paid}`} hint="Reservas marcadas como paid." tone="cyan" />
        <AdminStatCard label="Pendiente" value={`$${pending}`} hint="Por cobrar o completar." tone="amber" />
      </section>

      <section className="mt-8 rounded-[2rem] border border-slate-100 bg-white p-6 shadow-xl shadow-cyan-950/5">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-cyan-700">Pagos recientes</p>
        <div className="mt-5 grid gap-3">
          {demoReservations.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
              <div>
                <p className="font-black text-slate-950">{item.customer}</p>
                <p className="text-sm text-slate-500">{item.location} · {item.date}</p>
              </div>
              <p className="text-xl font-black text-slate-950">${item.total}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
