import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import Button from "@/components/ui/Button";

export default async function ReservaDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: reservation } = await supabase
    .from("reservations")
    .select("*, location:locations(*), reservation_type:reservation_types(*), time_block:time_blocks(*)")
    .eq("id", id)
    .single();

  if (!reservation) {
    return <main className="min-h-screen pt-24"><div className="mx-auto max-w-3xl px-4"><h1 className="text-2xl font-bold">Reserva no encontrada</h1></div></main>;
  }

  return (
    <main className="min-h-screen bg-slate-50 pt-24 pb-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <Link href="/cuenta" className="text-sm font-semibold text-pool-700">← Volver a mi cuenta</Link>
        <div className="mt-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-slate-500">Reserva</p>
              <h1 className="text-2xl font-bold text-slate-950">{reservation.location?.name}</h1>
              <p className="text-slate-600">{reservation.reservation_type?.name}</p>
            </div>
            <span className="rounded-full bg-pool-50 px-3 py-1 text-xs font-bold text-pool-700">{reservation.status}</span>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Info label="Fecha" value={reservation.reservation_date} />
            <Info label="Horario" value={`${reservation.time_block?.start_time?.slice(0,5)} - ${reservation.time_block?.end_time?.slice(0,5)}`} />
            <Info label="Asistentes" value={`${reservation.num_adults + reservation.num_children} estimados`} />
            <Info label="Valor" value={Number(reservation.total_price) > 0 ? `$${reservation.total_price}` : "Por confirmar"} />
          </div>
          <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
            Código / QR: <strong>{reservation.qr_code ?? reservation.id}</strong>
          </div>
          <div className="mt-6 flex gap-3"><Link href="/reservar"><Button>Reservar otra fecha</Button></Link><Button variant="outline">WhatsApp</Button></div>
        </div>
      </div>
    </main>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl border border-slate-100 p-4"><div className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</div><div className="mt-1 font-bold text-slate-900">{value}</div></div>;
}
