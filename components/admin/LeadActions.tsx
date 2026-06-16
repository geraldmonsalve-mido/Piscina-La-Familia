"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface LeadActionsProps {
  leadId: string;
  whatsappUrl: string;
}

const actions = [
  { status: "contacted", label: "Marcar como contactada" },
  { status: "reviewing", label: "Marcar en revisión" },
  { status: "lost", label: "Marcar como perdida" },
];

export default function LeadActions({ leadId, whatsappUrl }: LeadActionsProps) {
  const router = useRouter();
  const [loadingStatus, setLoadingStatus] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function updateStatus(status: string) {
    setLoadingStatus(status);
    setError("");

    try {
      const response = await fetch("/api/admin/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: leadId,
          status,
        }),
      });

      const json = await response.json();

      if (!response.ok || !json.ok) {
        throw new Error(json.error || "No se pudo actualizar la solicitud.");
      }

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido.");
    } finally {
      setLoadingStatus(null);
    }
  }

  return (
    <div className="grid gap-3">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noreferrer"
        className="rounded-2xl bg-emerald-400 px-5 py-4 text-center text-sm font-black text-slate-950 hover:bg-emerald-300"
      >
        Responder por WhatsApp ↗
      </a>

      {actions.map((item) => (
        <button
          key={item.status}
          type="button"
          disabled={loadingStatus !== null}
          onClick={() => updateStatus(item.status)}
          className="rounded-2xl bg-white/8 px-5 py-4 text-sm font-black text-white transition hover:bg-white/12 disabled:opacity-60"
        >
          {loadingStatus === item.status ? "Actualizando..." : item.label}
        </button>
      ))}

      {error && (
        <div className="rounded-2xl bg-rose-100 p-3 text-sm font-black text-rose-800">
          {error}
        </div>
      )}
    </div>
  );
}
