"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  adminLocations,
  calculateReservationPrice,
  turns,
  type LocationId,
  type TurnId,
} from "@/lib/reservation-pricing";

export default function AdminReservationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialLocation = (searchParams.get("location_id") || "sierra-maestra") as LocationId;
  const initialDate = searchParams.get("date") || new Date().toISOString().slice(0, 10);
  const initialTurn = (searchParams.get("turn_id") || "morning") as TurnId;
  const initialCustomerName = searchParams.get("customer_name") || "";
  const initialCustomerPhone = searchParams.get("customer_phone") || "";
  const initialGuests = searchParams.get("guests") || "25";
  const initialOrigin = searchParams.get("origin") || "manual";
  const initialNotes = searchParams.get("notes") || "";
  const initialLeadId = searchParams.get("lead_id") || "";

  const [locationId, setLocationId] = useState<LocationId>(initialLocation);
  const [date, setDate] = useState(initialDate);
  const [turnId, setTurnId] = useState<TurnId>(initialTurn);
  const [guests, setGuests] = useState(initialGuests);
  const [customerName, setCustomerName] = useState(initialCustomerName);
  const [customerPhone, setCustomerPhone] = useState(initialCustomerPhone);
  const [status, setStatus] = useState("pending");
  const [paymentStatus, setPaymentStatus] = useState("unpaid");
  const [amountPaid, setAmountPaid] = useState("0");
  const [origin, setOrigin] = useState(initialOrigin);
  const [internalNotes, setInternalNotes] = useState(initialNotes);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const price = useMemo(
    () => calculateReservationPrice(locationId, date),
    [locationId, date]
  );

  const balanceDue = useMemo(() => {
    const paid = Number(amountPaid || 0);
    return Math.max(price - paid, 0);
  }, [price, amountPaid]);

  const location = adminLocations[locationId];
  const turn = turns[turnId];

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch("/api/admin/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location_id: locationId,
          reservation_date: date,
          turn_id: turnId,
          guests: Number(guests),
          customer_name: customerName,
          customer_phone: customerPhone,
          status,
          payment_status: paymentStatus,
          amount_paid: Number(amountPaid || 0),
          origin,
          internal_notes: internalNotes,
          lead_id: initialLeadId,
        }),
      });

      const json = await response.json();

      if (!response.ok || !json.ok) {
        throw new Error(json.error || "No se pudo guardar la reserva.");
      }

      setMessage({
        type: "success",
        text: `Reserva guardada correctamente: ${json.reservation.code}`,
      });

      setTimeout(() => {
        router.push("/admin/reservas");
        router.refresh();
      }, 700);
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Error desconocido.",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-6 rounded-[1.5rem] bg-white p-6 shadow-xl shadow-cyan-950/5 lg:grid-cols-[1fr_340px]"
    >
      <div className="grid gap-5 lg:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm font-black text-slate-700">Sede</span>
          <select
            value={locationId}
            onChange={(event) => setLocationId(event.target.value as LocationId)}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-800"
          >
            {Object.values(adminLocations).map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-black text-slate-700">Fecha</span>
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-800"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-black text-slate-700">Turno</span>
          <select
            value={turnId}
            onChange={(event) => setTurnId(event.target.value as TurnId)}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-800"
          >
            {Object.values(turns).map((item) => (
              <option key={item.id} value={item.id}>
                {item.display}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-black text-slate-700">Asistentes</span>
          <input
            type="number"
            min={1}
            max={50}
            value={guests}
            onChange={(event) => setGuests(event.target.value)}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-800"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-black text-slate-700">Cliente</span>
          <input
            required
            value={customerName}
            onChange={(event) => setCustomerName(event.target.value)}
            placeholder="Nombre del cliente"
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-800"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-black text-slate-700">WhatsApp</span>
          <input
            required
            value={customerPhone}
            onChange={(event) => setCustomerPhone(event.target.value)}
            placeholder="0412-000-0000"
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-800"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-black text-slate-700">Estado</span>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-800"
          >
            <option value="pending">Pendiente</option>
            <option value="confirmed">Confirmada</option>
            <option value="cancelled">Cancelada</option>
            <option value="completed">Completada</option>
            <option value="no_show">No asistió</option>
          </select>
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-black text-slate-700">Pago</span>
          <select
            value={paymentStatus}
            onChange={(event) => setPaymentStatus(event.target.value)}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-800"
          >
            <option value="unpaid">Sin pago</option>
            <option value="partial">Abono</option>
            <option value="paid">Pagado</option>
            <option value="refunded">Reembolsado</option>
          </select>
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-black text-slate-700">Abono recibido</span>
          <input
            type="number"
            min={0}
            value={amountPaid}
            onChange={(event) => setAmountPaid(event.target.value)}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-800"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-black text-slate-700">Origen</span>
          <select
            value={origin}
            onChange={(event) => setOrigin(event.target.value)}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-800"
          >
            <option value="manual">Manual</option>
            <option value="web">Web</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="instagram">Instagram</option>
            <option value="call">Llamada</option>
          </select>
        </label>

        <label className="grid gap-2 lg:col-span-2">
          <span className="text-sm font-black text-slate-700">Notas internas</span>
          <textarea
            rows={4}
            value={internalNotes}
            onChange={(event) => setInternalNotes(event.target.value)}
            placeholder="Detalles del evento, acuerdos, decoración, abono, etc."
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-800"
          />
        </label>
      </div>

      <aside className="rounded-[1.35rem] bg-slate-950 p-5 text-white">
        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-cyan-200">
          Resumen de reserva
        </p>

        <h2 className="mt-3 text-2xl font-black">{location.name}</h2>
        <p className="mt-1 text-sm text-cyan-50/70">{date}</p>

        <div className="mt-5 grid gap-3">
          <div className="rounded-2xl bg-white/8 p-4">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-200">
              Turno
            </p>
            <p className="mt-1 font-black">{turn.display}</p>
          </div>

          <div className="rounded-2xl bg-white/8 p-4">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-200">
              Asistentes
            </p>
            <p className="mt-1 font-black">{guests || 0} / 50</p>
          </div>

          <div className="rounded-2xl bg-cyan-300 p-4 text-slate-950">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-950/70">
              Total calculado
            </p>
            <p className="mt-1 text-4xl font-black">${price}</p>
          </div>

          <div className="rounded-2xl bg-amber-300 p-4 text-amber-950">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-950/70">
              Cuenta por cobrar
            </p>
            <p className="mt-1 text-3xl font-black">${balanceDue}</p>
          </div>

          {message && (
            <div
              className={[
                "rounded-2xl p-4 text-sm font-black",
                message.type === "success"
                  ? "bg-emerald-300 text-emerald-950"
                  : "bg-rose-300 text-rose-950",
              ].join(" ")}
            >
              {message.text}
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="rounded-2xl bg-white px-5 py-4 text-sm font-black text-slate-950 hover:bg-cyan-50 disabled:opacity-60"
          >
            {saving ? "Guardando..." : "Guardar en Calendario"}
          </button>
        </div>
      </aside>
    </form>
  );
}
