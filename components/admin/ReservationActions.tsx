"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface ReservationActionsProps {
  reservationId: string;
  whatsappUrl: string;
}

const actions = [
  {
    action: "confirm",
    label: "Confirmar reserva",
    className: "bg-cyan-300 text-slate-950 hover:bg-cyan-200",
  },
  {
    action: "mark_paid",
    label: "Marcar pagada",
    className: "bg-emerald-300 text-slate-950 hover:bg-emerald-200",
  },
  {
    action: "complete",
    label: "Completar",
    className: "bg-slate-100 text-slate-800 hover:bg-slate-200",
  },
  {
    action: "cancel",
    label: "Cancelar",
    className: "bg-rose-100 text-rose-800 hover:bg-rose-200",
  },
];

export default function ReservationActions({
  reservationId,
  whatsappUrl,
}: ReservationActionsProps) {
  const router = useRouter();
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function runAction(action: string) {
    setLoadingAction(action);
    setError("");

    try {
      const response = await fetch("/api/admin/reservations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: reservationId,
          action,
        }),
      });

      const json = await response.json();

      if (!response.ok || !json.ok) {
        throw new Error(json.error || "No se pudo actualizar la reserva.");
      }

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido.");
    } finally {
      setLoadingAction(null);
    }
  }

  return (
    <div className="grid gap-3">
      {actions.map((item) => (
        <button
          key={item.action}
          type="button"
          disabled={loadingAction !== null}
          onClick={() => runAction(item.action)}
          className={[
            "rounded-2xl px-5 py-3 text-sm font-black transition disabled:cursor-not-allowed disabled:opacity-60",
            item.className,
          ].join(" ")}
        >
          {loadingAction === item.action ? "Actualizando..." : item.label}
        </button>
      ))}

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noreferrer"
        className="rounded-2xl bg-emerald-500 px-5 py-3 text-center text-sm font-black text-white hover:bg-emerald-400"
      >
        Enviar WhatsApp ↗
      </a>

      {error && (
        <div className="rounded-2xl bg-rose-100 p-3 text-sm font-black text-rose-800">
          {error}
        </div>
      )}
    </div>
  );
}
