"use client";

import { useMemo, useState } from "react";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import type { FlowData } from "./ReservationFlow";

interface Props {
  data: FlowData;
  onBack: () => void;
  onReset: () => void;
}

function formatHour(value?: string) {
  return value?.slice(0, 5) ?? "";
}

export default function Step5Confirm({ data, onBack, onReset }: Props) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ code?: string; quote?: boolean } | null>(null);
  const [error, setError] = useState("");

  const totalGuests = data.numAdults + data.numChildren;
  const price = Number(data.timeBlock?.price ?? data.reservationType?.price_base ?? 0);
  const requiresQuote = Boolean(data.reservationType?.requires_quote);

  const summary = useMemo(
    () => [
      ["Sede", data.location?.name],
      ["Tipo", data.reservationType?.name],
      ["Fecha", data.date],
      ["Horario", `${formatHour(data.timeBlock?.start_time)} - ${formatHour(data.timeBlock?.end_time)}`],
      ["Asistentes", `${totalGuests} personas estimadas`],
      ["Valor", requiresQuote ? "Por cotización" : price > 0 ? `$${price} / bloque` : "Por confirmar"],
    ],
    [data, totalGuests, requiresQuote, price]
  );

  async function submit() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "No se pudo crear la solicitud");
      setResult({ code: payload.code, quote: payload.quote });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setLoading(false);
    }
  }

  if (result) {
    return (
      <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <div className="text-5xl mb-4">🏊‍♀️</div>
        <h2 className="text-2xl font-bold text-slate-900">Solicitud recibida</h2>
        <p className="mt-2 text-slate-600">
          {result.quote ? "El equipo revisará tu evento y te enviará cotización." : "Tu reserva quedó pendiente de confirmación del equipo."}
        </p>
        <div className="mt-5 inline-flex rounded-full bg-white px-4 py-2 text-sm font-bold text-pool-700 shadow-sm">Código: {result.code}</div>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Button onClick={onReset}>Hacer otra reserva</Button>
          <Button variant="outline" onClick={() => window.location.href = "/cuenta"}>Ir a mi cuenta</Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-slate-900 mb-2">Confirma tu solicitud</h2>
      <p className="text-sm text-slate-500 mb-6">Revisa los datos antes de enviarla. La unidad comercial es el bloque horario completo.</p>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
        {summary.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-4 last:border-b-0">
            <span className="text-sm text-slate-500">{label}</span>
            <span className="text-right text-sm font-semibold text-slate-900">{value}</span>
          </div>
        ))}
      </div>

      {data.notes && <div className="mt-4 rounded-2xl bg-slate-100 p-4 text-sm text-slate-600">{data.notes}</div>}
      {error && <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</div>}

      <div className="mt-6 flex justify-between gap-3">
        <Button variant="ghost" onClick={onBack}>Volver</Button>
        <Button onClick={submit} disabled={loading}>{loading ? <><Spinner size="sm" /> Enviando...</> : requiresQuote ? "Solicitar cotización" : "Enviar reserva"}</Button>
      </div>
    </div>
  );
}
