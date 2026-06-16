"use client";

import { useState } from "react";

export default function PublicLeadForm() {
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    email: "",
    request_type: "private_booking",
    preferred_location: "Sierra Maestra",
    preferred_date: "",
    preferred_turn: "Tarde",
    guests: "25",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  function updateField(name: string, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setError("");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          guests: Number(form.guests || 0),
          source: "landing",
          message:
            form.message ||
            `Quiero consultar disponibilidad para ${form.preferred_location}, turno ${form.preferred_turn}, fecha ${form.preferred_date}, ${form.guests} personas.`,
        }),
      });

      const json = await response.json();

      if (!response.ok || !json.ok) {
        throw new Error(json.error || "No se pudo enviar la solicitud.");
      }

      setStatus("success");
      setForm({
        full_name: "",
        phone: "",
        email: "",
        request_type: "private_booking",
        preferred_location: "Sierra Maestra",
        preferred_date: "",
        preferred_turn: "Tarde",
        guests: "25",
        message: "",
      });
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Error desconocido.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-[2rem] bg-white p-6 shadow-2xl shadow-cyan-950/10">
      <div className="mb-6">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-700">
          Solicitud de reserva
        </p>
        <h2 className="mt-2 text-3xl font-black text-slate-950">
          Consulta disponibilidad
        </h2>
        <p className="mt-2 text-sm font-bold leading-6 text-slate-500">
          Déjanos tus datos. Un asesor confirmará disponibilidad, condiciones de pago y bloqueo del turno.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm font-black text-slate-700">Nombre</span>
          <input
            required
            value={form.full_name}
            onChange={(e) => updateField("full_name", e.target.value)}
            className="rounded-2xl border border-slate-200 px-4 py-3 font-bold outline-none focus:border-cyan-300"
            placeholder="Tu nombre"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-black text-slate-700">WhatsApp</span>
          <input
            required
            value={form.phone}
            onChange={(e) => updateField("phone", e.target.value)}
            className="rounded-2xl border border-slate-200 px-4 py-3 font-bold outline-none focus:border-cyan-300"
            placeholder="0412-000-0000"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-black text-slate-700">Correo opcional</span>
          <input
            type="email"
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
            className="rounded-2xl border border-slate-200 px-4 py-3 font-bold outline-none focus:border-cyan-300"
            placeholder="correo@email.com"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-black text-slate-700">Tipo de solicitud</span>
          <select
            value={form.request_type}
            onChange={(e) => updateField("request_type", e.target.value)}
            className="rounded-2xl border border-slate-200 px-4 py-3 font-bold outline-none focus:border-cyan-300"
          >
            <option value="private_booking">Reserva privada</option>
            <option value="birthday">Cumpleaños</option>
            <option value="event">Evento privado</option>
            <option value="quote">Cotización</option>
            <option value="general">Consulta general</option>
          </select>
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-black text-slate-700">Sede</span>
          <select
            value={form.preferred_location}
            onChange={(e) => updateField("preferred_location", e.target.value)}
            className="rounded-2xl border border-slate-200 px-4 py-3 font-bold outline-none focus:border-cyan-300"
          >
            <option>Sierra Maestra</option>
            <option>Los Cortijos</option>
          </select>
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-black text-slate-700">Fecha deseada</span>
          <input
            type="date"
            required
            value={form.preferred_date}
            onChange={(e) => updateField("preferred_date", e.target.value)}
            className="rounded-2xl border border-slate-200 px-4 py-3 font-bold outline-none focus:border-cyan-300"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-black text-slate-700">Turno</span>
          <select
            value={form.preferred_turn}
            onChange={(e) => updateField("preferred_turn", e.target.value)}
            className="rounded-2xl border border-slate-200 px-4 py-3 font-bold outline-none focus:border-cyan-300"
          >
            <option>Mañana</option>
            <option>Tarde</option>
          </select>
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-black text-slate-700">Personas</span>
          <input
            type="number"
            min={1}
            max={50}
            value={form.guests}
            onChange={(e) => updateField("guests", e.target.value)}
            className="rounded-2xl border border-slate-200 px-4 py-3 font-bold outline-none focus:border-cyan-300"
          />
        </label>

        <label className="grid gap-2 md:col-span-2">
          <span className="text-sm font-black text-slate-700">Mensaje</span>
          <textarea
            rows={4}
            value={form.message}
            onChange={(e) => updateField("message", e.target.value)}
            className="rounded-2xl border border-slate-200 px-4 py-3 font-bold outline-none focus:border-cyan-300"
            placeholder="Cuéntanos si es cumpleaños, evento, decoración, comida, música, abono, etc."
          />
        </label>
      </div>

      {status === "success" && (
        <div className="mt-5 rounded-2xl bg-emerald-100 p-4 text-sm font-black text-emerald-800">
          Solicitud enviada. Un asesor se comunicará contigo por WhatsApp para confirmar disponibilidad y pago.
        </div>
      )}

      {status === "error" && (
        <div className="mt-5 rounded-2xl bg-rose-100 p-4 text-sm font-black text-rose-800">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="mt-6 w-full rounded-2xl bg-cyan-300 px-5 py-4 text-sm font-black text-slate-950 shadow-lg shadow-cyan-950/10 transition hover:bg-cyan-200 disabled:opacity-60"
      >
        {status === "loading" ? "Enviando solicitud..." : "Solicitar reserva"}
      </button>
    </form>
  );
}
