import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

function formatDate(value?: string) {
  if (!value) return "Fecha por confirmar";
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

function statusLabel(status: string) {
  if (status === "confirmed") return "Confirmada";
  if (status === "cancelled") return "Cancelada";
  if (status === "completed") return "Completada";
  return "Pendiente";
}

export default async function ConfirmacionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: reservation } = await supabase
    .from("reservations")
    .select("*, location:locations(name), time_block:time_blocks(start_time, end_time)")
    .eq("id", id)
    .single();

  let quoteData: { location?: { name?: string }; event_date?: string; status?: string } | null = null;
  if (!reservation) {
    const { data: quote } = await supabase
      .from("quote_requests")
      .select("*, location:locations(name)")
      .eq("id", id)
      .single();
    quoteData = quote;
  }

  const code = reservation?.qr_code ?? id.slice(0, 8).toUpperCase();
  const locationName =
    (reservation as any)?.location?.name ??
    (quoteData as any)?.location?.name ??
    "Piscina La Familia";
  const reservationDate = reservation?.reservation_date ?? (quoteData as any)?.event_date;
  const startTime = (reservation as any)?.time_block?.start_time;
  const endTime = (reservation as any)?.time_block?.end_time;
  const status = reservation?.status ?? quoteData?.status ?? "pending";
  const isQuote = !reservation && !!quoteData;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f6fbff] pt-24">
      <div className="absolute inset-x-0 top-0 h-[340px] bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.35),transparent_48%),linear-gradient(135deg,#06224a,#0b6f88_52%,#0f766e)]" />

      <section className="relative mx-auto max-w-2xl px-4 pb-20 pt-12 sm:px-6">
        <div className="text-center text-white">
          <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-3xl bg-emerald-400 text-3xl shadow-lg shadow-emerald-900/30">
            ✓
          </div>

          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
            {isQuote ? "Cotización enviada" : "Reserva recibida"}
          </h1>

          <p className="mx-auto mt-4 max-w-md text-base font-bold text-cyan-50/85">
            {isQuote
              ? "Un asesor te contactará por WhatsApp para confirmar disponibilidad y condiciones."
              : "Tu reserva está pendiente de confirmación. Te contactaremos por WhatsApp."}
          </p>
        </div>

        <div className="relative mx-auto mt-10 overflow-hidden rounded-[2rem] border border-white/70 bg-white shadow-2xl shadow-cyan-950/15">
          <div className="h-2 bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-300" />

          <div className="p-6 sm:p-8">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.26em] text-cyan-700">
                  {isQuote ? "Cotización" : "Reserva"}
                </p>
                <p className="mt-1 text-2xl font-black text-slate-950">{locationName}</p>
              </div>
              <span
                className={[
                  "rounded-full px-4 py-2 text-xs font-black",
                  status === "confirmed"
                    ? "bg-cyan-100 text-cyan-800"
                    : status === "cancelled"
                    ? "bg-rose-100 text-rose-800"
                    : "bg-amber-100 text-amber-800",
                ].join(" ")}
              >
                {statusLabel(status)}
              </span>
            </div>

            <dl className="grid gap-4 text-sm">
              {reservationDate && (
                <div className="flex justify-between gap-4 rounded-2xl bg-slate-50 px-4 py-3">
                  <dt className="font-bold text-slate-500">Fecha</dt>
                  <dd className="text-right font-black text-slate-950">{formatDate(reservationDate)}</dd>
                </div>
              )}

              {startTime && endTime && (
                <div className="flex justify-between gap-4 rounded-2xl bg-slate-50 px-4 py-3">
                  <dt className="font-bold text-slate-500">Turno</dt>
                  <dd className="text-right font-black text-slate-950">
                    {formatTime(startTime)} – {formatTime(endTime)}
                  </dd>
                </div>
              )}

              <div className="flex justify-between gap-4 rounded-2xl bg-slate-50 px-4 py-3">
                <dt className="font-bold text-slate-500">Estado</dt>
                <dd className="text-right font-black text-slate-950">{statusLabel(status)}</dd>
              </div>
            </dl>

            <div className="mt-6 rounded-2xl border-2 border-dashed border-cyan-200 bg-cyan-50 p-5 text-center">
              <p className="text-[10px] font-black uppercase tracking-[0.26em] text-cyan-600">
                Código de referencia
              </p>
              <p className="mt-2 font-mono text-3xl font-black tracking-wider text-slate-950">
                {code}
              </p>
              <p className="mt-2 text-xs text-slate-500">
                Guarda este código. Te lo pediremos al llegar a la sede.
              </p>
            </div>

            <div className="mt-6 rounded-2xl bg-slate-950 p-4 text-sm text-cyan-50/80">
              <p className="font-black text-white">¿Qué sigue?</p>
              <ol className="mt-2 list-inside list-decimal space-y-1">
                <li>Te contactamos por WhatsApp para confirmar.</li>
                <li>Realizas el abono acordado.</li>
                <li>El día de la reserva preséntate con este código.</li>
              </ol>
            </div>
          </div>

          <div className="border-t border-slate-100 px-6 py-4 sm:px-8">
            <div className="flex flex-wrap gap-3">
              <Link
                href="/cuenta"
                className="inline-flex flex-1 items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-800 hover:bg-slate-50"
              >
                Mi cuenta
              </Link>
              <a
                href={`https://wa.me/584125497463?text=Hola!%20Mi%20c%C3%B3digo%20de%20reserva%20es%20${code}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex flex-1 items-center justify-center rounded-2xl bg-emerald-400 px-4 py-3 text-sm font-black text-slate-950 hover:bg-emerald-300"
              >
                WhatsApp
              </a>
              <Link
                href="/reservar"
                className="inline-flex flex-1 items-center justify-center rounded-2xl bg-cyan-300 px-4 py-3 text-sm font-black text-slate-950 hover:bg-cyan-200"
              >
                Nueva reserva
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
