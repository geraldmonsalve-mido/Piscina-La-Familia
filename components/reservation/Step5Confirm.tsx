"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

function pick(...values: unknown[]) {
  return values.find((value) => value !== undefined && value !== null && value !== "");
}

function getName(value: any) {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value.name || value.title || value.label || "";
}

function getId(value: any) {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value.id || value.value || value.slug || "";
}

function normalizeRequestType(type: any) {
  const raw = `${getName(type)} ${getId(type)}`.toLowerCase();

  if (raw.includes("cumple")) return "birthday";
  if (raw.includes("evento")) return "event";
  if (raw.includes("cotiz")) return "quote";
  if (raw.includes("familiar") || raw.includes("privada") || raw.includes("reserva")) {
    return "private_booking";
  }

  return "general";
}

function normalizeTurn(block: any) {
  const raw = `${getName(block)} ${block?.start_time || ""} ${block?.startTime || ""} ${block?.display || ""}`.toLowerCase();

  if (raw.includes("tarde") || raw.includes("noche") || raw.includes("19") || raw.includes("7:00")) {
    return "Tarde";
  }

  return "Mañana";
}

function normalizeDate(value: any) {
  if (!value) return "";
  if (typeof value === "string") return value.slice(0, 10);

  try {
    return new Date(value).toISOString().slice(0, 10);
  } catch {
    return "";
  }
}

export default function Step5Confirm(props: any) {
  const location = pick(
    props.location,
    props.selectedLocation,
    props.formData?.location,
    props.data?.location,
    props.state?.location
  );

  const reservationType = pick(
    props.type,
    props.selectedType,
    props.reservationType,
    props.formData?.type,
    props.data?.type,
    props.state?.type
  );

  const dateValue = pick(
    props.date,
    props.selectedDate,
    props.formData?.date,
    props.data?.date,
    props.state?.date
  );

  const timeBlock = pick(
    props.timeBlock,
    props.selectedTimeBlock,
    props.turn,
    props.selectedTurn,
    props.formData?.timeBlock,
    props.data?.timeBlock,
    props.state?.timeBlock
  );

  const initialGuests = String(
    pick(
      props.guests,
      props.selectedGuests,
      props.formData?.guests,
      props.data?.guests,
      props.state?.guests,
      25
    )
  );

  const preferredLocation = getName(location) || "Sierra Maestra";
  const preferredDate = normalizeDate(dateValue);
  const preferredTurn = normalizeTurn(timeBlock);
  const requestType = normalizeRequestType(reservationType);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [guests, setGuests] = useState(initialGuests);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  const summaryMessage = useMemo(() => {
    return (
      message ||
      `Solicitud desde el flujo público. Tipo: ${getName(reservationType) || "Reserva privada"}. Sede: ${preferredLocation}. Fecha: ${preferredDate || "por confirmar"}. Turno: ${preferredTurn}. Personas: ${guests}.`
    );
  }, [message, reservationType, preferredLocation, preferredDate, preferredTurn, guests]);

  async function submitLead(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setError("");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName,
          phone,
          email,
          request_type: requestType,
          preferred_location: preferredLocation,
          preferred_date: preferredDate || null,
          preferred_turn: preferredTurn,
          guests: Number(guests || 0),
          message: summaryMessage,
          source: "landing",
        }),
      });

      const json = await response.json();

      if (!response.ok || !json.ok) {
        throw new Error(json.error || "No pudimos enviar la solicitud.");
      }

      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Error desconocido.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-[2rem] bg-white p-8 text-center shadow-xl shadow-cyan-950/5">
        <div className="mx-auto flex size-16 items-center justify-center rounded-3xl bg-emerald-100 text-3xl">
          ✓
        </div>

        <h2 className="mt-5 text-3xl font-black text-slate-950">
          Solicitud enviada
        </h2>

        <p className="mx-auto mt-3 max-w-2xl text-base font-bold leading-7 text-slate-500">
          Un asesor de Piscina La Familia te contactará por WhatsApp para confirmar disponibilidad, condiciones y abono. Tu turno todavía no queda bloqueado hasta que el equipo lo confirme.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white"
          >
            Volver al inicio
          </Link>

          <button
            type="button"
            onClick={() => {
              setStatus("idle");
              setFullName("");
              setPhone("");
              setEmail("");
              setMessage("");
            }}
            className="rounded-2xl bg-cyan-300 px-5 py-3 text-sm font-black text-slate-950"
          >
            Hacer otra solicitud
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={submitLead}
      className="grid gap-6 rounded-[2rem] bg-white p-6 shadow-xl shadow-cyan-950/5 lg:grid-cols-[1fr_340px]"
    >
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-cyan-700">
          Último paso
        </p>

        <h2 className="mt-2 text-3xl font-black text-slate-950">
          Datos para confirmar tu solicitud
        </h2>

        <p className="mt-2 text-sm font-bold leading-6 text-slate-500">
          No pagarás todavía. Primero un asesor confirmará disponibilidad y condiciones por WhatsApp.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="grid gap-2">
            <span className="text-sm font-black text-slate-700">Nombre</span>
            <input
              required
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              placeholder="Tu nombre"
              className="rounded-2xl border border-slate-200 px-4 py-3 font-bold outline-none focus:border-cyan-300"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-black text-slate-700">WhatsApp</span>
            <input
              required
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="0412-000-0000"
              className="rounded-2xl border border-slate-200 px-4 py-3 font-bold outline-none focus:border-cyan-300"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-black text-slate-700">Correo opcional</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="correo@email.com"
              className="rounded-2xl border border-slate-200 px-4 py-3 font-bold outline-none focus:border-cyan-300"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-black text-slate-700">Personas</span>
            <input
              type="number"
              min={1}
              max={50}
              value={guests}
              onChange={(event) => setGuests(event.target.value)}
              className="rounded-2xl border border-slate-200 px-4 py-3 font-bold outline-none focus:border-cyan-300"
            />
          </label>

          <label className="grid gap-2 md:col-span-2">
            <span className="text-sm font-black text-slate-700">Mensaje opcional</span>
            <textarea
              rows={4}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Cuéntanos si es cumpleaños, decoración, comida, música, acuerdos especiales, etc."
              className="rounded-2xl border border-slate-200 px-4 py-3 font-bold outline-none focus:border-cyan-300"
            />
          </label>
        </div>

        {status === "error" && (
          <div className="mt-5 rounded-2xl bg-rose-100 p-4 text-sm font-black text-rose-800">
            {error || "No pudimos enviar la solicitud. Intenta nuevamente o escríbenos por WhatsApp."}
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          {typeof props.onBack === "function" && (
            <button
              type="button"
              onClick={props.onBack}
              className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-black text-slate-700 hover:bg-slate-50"
            >
              Volver
            </button>
          )}

          <button
            type="submit"
            disabled={status === "loading"}
            className="rounded-2xl bg-cyan-300 px-6 py-3 text-sm font-black text-slate-950 shadow-lg shadow-cyan-950/10 hover:bg-cyan-200 disabled:opacity-60"
          >
            {status === "loading" ? "Enviando solicitud..." : "Enviar solicitud"}
          </button>
        </div>
      </div>

      <aside className="rounded-[1.35rem] bg-slate-950 p-5 text-white">
        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-cyan-200">
          Resumen
        </p>

        <div className="mt-4 grid gap-3">
          <div className="rounded-2xl bg-white/8 p-4">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-200">
              Sede
            </p>
            <p className="mt-1 font-black">{preferredLocation}</p>
          </div>

          <div className="rounded-2xl bg-white/8 p-4">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-200">
              Fecha
            </p>
            <p className="mt-1 font-black">{preferredDate || "Por confirmar"}</p>
          </div>

          <div className="rounded-2xl bg-white/8 p-4">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-200">
              Turno
            </p>
            <p className="mt-1 font-black">{preferredTurn}</p>
          </div>

          <div className="rounded-2xl bg-cyan-300 p-4 text-slate-950">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-950/70">
              Estado
            </p>
            <p className="mt-1 text-xl font-black">Solicitud pendiente</p>
          </div>
        </div>
      </aside>
    </form>
  );
}
