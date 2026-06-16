"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import LeadActions from "@/components/admin/LeadActions";
import AdminBadge from "@/components/admin/AdminBadge";

type Lead = {
  id: string;
  full_name: string;
  phone: string;
  email?: string | null;
  request_type: string;
  preferred_location?: string | null;
  preferred_date?: string | null;
  preferred_turn?: string | null;
  guests?: number | null;
  message: string;
  source: string;
  status: string;
  priority: string;
  admin_notes?: string | null;
  created_at: string;
};

function statusLabel(value: string) {
  const labels: Record<string, string> = {
    new: "Nueva",
    contacted: "Contactada",
    reviewing: "En revisión",
    converted: "Convertida",
    lost: "Perdida",
  };

  return labels[value] || value;
}

function statusTone(value: string): "cyan" | "emerald" | "amber" | "rose" | "slate" {
  if (value === "contacted" || value === "reviewing") return "cyan";
  if (value === "converted") return "emerald";
  if (value === "new") return "amber";
  if (value === "lost") return "rose";
  return "slate";
}

function requestTypeLabel(value: string) {
  const labels: Record<string, string> = {
    general: "Solicitud general",
    birthday: "Cumpleaños",
    event: "Evento privado",
    quote: "Cotización",
    date_change: "Cambio de fecha",
    private_booking: "Reserva privada",
  };

  return labels[value] || value;
}

function locationToId(location?: string | null) {
  const normalized = String(location || "").toLowerCase();
  if (normalized.includes("cortijos")) return "los-cortijos";
  return "sierra-maestra";
}

function turnToId(turn?: string | null) {
  const normalized = String(turn || "").toLowerCase();

  if (
    normalized.includes("tarde") ||
    normalized.includes("noche") ||
    normalized.includes("7")
  ) {
    return "night";
  }

  return "morning";
}

function cleanWhatsappPhone(phone: string) {
  const raw = String(phone || "").replace(/\D/g, "");
  const withoutLeadingZero = raw.replace(/^0/, "");

  if (withoutLeadingZero.startsWith("58")) return withoutLeadingZero;
  return `58${withoutLeadingZero}`;
}

function buildWhatsappUrl(lead: Lead) {
  const phone = cleanWhatsappPhone(lead.phone);
  const message = encodeURIComponent(
    `Hola ${lead.full_name}, gracias por escribir a Piscina La Familia. Recibimos tu solicitud${lead.request_type ? ` de ${requestTypeLabel(lead.request_type).toLowerCase()}` : ""}${lead.preferred_date ? ` para el ${lead.preferred_date}` : ""}${lead.guests ? `, aproximadamente ${lead.guests} personas` : ""}. Te confirmo disponibilidad, precio, condiciones de abono y reglas de uso por esta vía.`
  );

  return `https://wa.me/${phone}?text=${message}`;
}

function formatDate(date: string) {
  try {
    return new Intl.DateTimeFormat("es-VE", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(date));
  } catch {
    return date;
  }
}

export default function LeadInbox({ leads }: { leads: Lead[] }) {
  const [selectedId, setSelectedId] = useState(leads[0]?.id || "");
  const [filter, setFilter] = useState<"all" | "new" | "reviewing" | "contacted">("all");

  const filteredLeads = useMemo(() => {
    if (filter === "all") return leads;
    return leads.filter((lead) => lead.status === filter);
  }, [leads, filter]);

  const selected =
    leads.find((lead) => lead.id === selectedId) ||
    filteredLeads[0] ||
    leads[0];

  if (!selected) {
    return (
      <section className="rounded-[1.15rem] bg-white p-8 text-center shadow-xl shadow-cyan-950/5">
        <div className="mx-auto flex size-16 items-center justify-center rounded-3xl bg-cyan-100 text-xl">
          💬
        </div>
        <h2 className="mt-3 text-xl font-black text-slate-950">
          Todavía no hay solicitudes
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-sm font-bold leading-6 text-slate-500">
          Cuando alguien deje un mensaje desde el landing, aparecerá aquí con sus datos y botón de respuesta por WhatsApp.
        </p>
      </section>
    );
  }

  const reserveParams = new URLSearchParams({
    location_id: locationToId(selected.preferred_location),
    date: selected.preferred_date || new Date().toISOString().slice(0, 10),
    turn_id: turnToId(selected.preferred_turn),
    customer_name: selected.full_name || "",
    customer_phone: selected.phone || "",
    guests: String(selected.guests || 25),
    origin: selected.source || "landing",
    lead_id: selected.id,
    notes: selected.message || "",
  });

  const reserveHref = `/admin/reservas/nueva?${reserveParams.toString()}`;

  return (
    <section className="grid gap-3 xl:grid-cols-[390px_1fr]">
      <aside className="overflow-hidden rounded-[1.15rem] bg-white shadow-xl shadow-cyan-950/5">
        <div className="border-b border-slate-100 p-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-cyan-700">
                Entrada
              </p>
              <h2 className="mt-1 text-xl font-black text-slate-950">
                Solicitudes
              </h2>
            </div>

            <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-black text-cyan-800">
              {filteredLeads.length}
            </span>
          </div>

          <div className="mt-3 grid grid-cols-4 gap-2">
            {[
              ["all", "Todas"],
              ["new", "Nuevas"],
              ["reviewing", "Revisión"],
              ["contacted", "Contactadas"],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setFilter(value as typeof filter)}
                className={[
                  "rounded-2xl px-3 py-2 text-xs font-black transition",
                  filter === value
                    ? "bg-slate-950 text-white"
                    : "bg-slate-50 text-slate-500 hover:bg-slate-100",
                ].join(" ")}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="max-h-[calc(100vh-270px)] overflow-y-auto p-3">
          {filteredLeads.length === 0 ? (
            <div className="rounded-2xl bg-slate-50 p-3 text-center text-sm font-bold text-slate-500">
              No hay solicitudes en este filtro.
            </div>
          ) : (
            <div className="grid gap-2">
              {filteredLeads.map((lead) => {
                const active = lead.id === selected.id;

                return (
                  <button
                    key={lead.id}
                    type="button"
                    onClick={() => setSelectedId(lead.id)}
                    className={[
                      "rounded-[1rem] border p-3 text-left transition",
                      active
                        ? "border-cyan-300 bg-cyan-50 shadow-lg shadow-cyan-950/5"
                        : "border-slate-100 bg-slate-50 hover:border-cyan-100 hover:bg-cyan-50/55",
                    ].join(" ")}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-700">
                          {requestTypeLabel(lead.request_type)}
                        </p>
                        <h3 className="mt-1 truncate text-base font-black text-slate-950">
                          {lead.full_name}
                        </h3>
                        <p className="mt-1 truncate text-xs font-bold text-slate-500">
                          {lead.phone}
                          {lead.guests ? ` · ${lead.guests} personas` : ""}
                        </p>
                      </div>

                      <AdminBadge tone={statusTone(lead.status)}>
                        {statusLabel(lead.status)}
                      </AdminBadge>
                    </div>

                    <p className="mt-3 line-clamp-2 text-xs font-bold leading-5 text-slate-500">
                      {lead.message}
                    </p>

                    <div className="mt-3 flex items-center justify-between gap-2">
                      <span className="text-xs font-black text-slate-400">
                        {formatDate(lead.created_at)}
                      </span>

                      <span
                        className={[
                          "rounded-full px-2.5 py-1 text-[10px] font-black",
                          lead.priority === "high"
                            ? "bg-rose-100 text-rose-700"
                            : "bg-slate-100 text-slate-500",
                        ].join(" ")}
                      >
                        {lead.priority === "high" ? "Alta" : "Normal"}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </aside>

      <article className="overflow-hidden rounded-[1.15rem] bg-white shadow-xl shadow-cyan-950/5">
        <div className="grid gap-3 p-3 xl:grid-cols-[1fr_340px]">
          <div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.26em] text-cyan-700">
                  {requestTypeLabel(selected.request_type)}
                </p>
                <h2 className="mt-1 text-xl font-black leading-tight text-slate-950">
                  {selected.full_name}
                </h2>
                <p className="mt-1 text-sm font-bold text-slate-500">
                  {selected.phone}
                  {selected.preferred_date ? ` · ${selected.preferred_date}` : ""}
                  {selected.guests ? ` · ${selected.guests} personas` : ""}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <AdminBadge tone={statusTone(selected.status)}>
                  {statusLabel(selected.status)}
                </AdminBadge>
                <AdminBadge tone={selected.priority === "high" ? "rose" : "slate"}>
                  {selected.priority === "high" ? "Prioridad alta" : "Normal"}
                </AdminBadge>
                <AdminBadge tone="slate">{selected.source}</AdminBadge>
              </div>
            </div>

            <div className="mt-3 rounded-[1rem] border border-slate-100 bg-slate-50 p-3">
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-400">
                Mensaje recibido
              </p>
              <p className="mt-3 text-base font-bold leading-7 text-slate-700">
                {selected.message}
              </p>
            </div>

            <div className="mt-3 grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl bg-cyan-50 p-3">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-700">
                  Sede solicitada
                </p>
                <p className="mt-1 font-black text-slate-950">
                  {selected.preferred_location || "Sin definir"}
                </p>
              </div>

              <div className="rounded-2xl bg-amber-50 p-3">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-700">
                  Turno preferido
                </p>
                <p className="mt-1 font-black text-slate-950">
                  {selected.preferred_turn || "Sin definir"}
                </p>
              </div>

              <div className="rounded-2xl bg-emerald-50 p-3">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-700">
                  Fecha de ingreso
                </p>
                <p className="mt-1 font-black text-slate-950">
                  {formatDate(selected.created_at)}
                </p>
              </div>
            </div>

            <div className="mt-3 rounded-[1rem] bg-slate-950 p-3 text-white">
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-cyan-200">
                Lectura comercial
              </p>
              <p className="mt-2 text-sm font-bold leading-6 text-white/78">
                {selected.guests && selected.guests >= 40
                  ? "Solicitud de alta demanda. Conviene responder rápido, confirmar disponibilidad, explicar condiciones de abono y empujar a reserva."
                  : "Solicitud estándar. Responder con disponibilidad, precio, reglas de uso y pasos para reservar."}
              </p>
            </div>
          </div>

          <aside className="rounded-[1rem] bg-slate-950 p-3 text-white">
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-cyan-200">
              Gestión rápida
            </p>

            <div className="mt-3 grid gap-3">
              <div className="rounded-2xl bg-white/8 p-3">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-200">
                  Respuesta sugerida
                </p>
                <p className="mt-2 text-sm font-bold leading-5 text-white/78">
                  Confirmar disponibilidad, precio, condiciones de abono y reglas de uso.
                </p>
              </div>

              <LeadActions
                leadId={selected.id}
                whatsappUrl={buildWhatsappUrl(selected)}
              />

              <Link
                href={reserveHref}
                className="rounded-2xl bg-cyan-300 px-5 py-4 text-center text-sm font-black text-slate-950 hover:bg-cyan-200"
              >
                Convertir en reserva →
              </Link>
            </div>
          </aside>
        </div>
      </article>
    </section>
  );
}
