import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminBadge from "@/components/admin/AdminBadge";
import { demoReservations } from "@/lib/admin-demo-data";

export default function AdminClientesPage() {
  return (
    <main className="min-h-screen bg-[#f3fbff] p-4 sm:p-6 lg:p-8">
      <AdminPageHeader title="Clientes" description="CRM simple para identificar clientes frecuentes, eventos y pendientes de pago." />

      <section className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-xl shadow-cyan-950/5">
        <div className="grid gap-4">
          {demoReservations.map((reservation) => (
            <div key={reservation.id} className="rounded-[1.5rem] border border-slate-100 bg-slate-50 p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-xl font-black text-slate-950">{reservation.customer}</h3>
                  <p className="mt-1 text-sm text-slate-500">{reservation.phone}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <AdminBadge tone="cyan">{reservation.location}</AdminBadge>
                  <AdminBadge tone="emerald">${reservation.total}</AdminBadge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
