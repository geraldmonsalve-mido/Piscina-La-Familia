"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import type { FlowData } from "./ReservationFlow";

interface Props {
  data: FlowData;
  maxCapacity: number;
  onNext: (partial: Partial<FlowData>) => void;
  onBack: () => void;
}

export default function Step4Guests({ data, maxCapacity, onNext, onBack }: Props) {
  const [numAdults, setNumAdults] = useState(data.numAdults);
  const [numChildren, setNumChildren] = useState(data.numChildren);
  const [notes, setNotes] = useState(data.notes);
  const [guestName, setGuestName] = useState(data.guestName);
  const [guestEmail, setGuestEmail] = useState(data.guestEmail);
  const [guestPhone, setGuestPhone] = useState(data.guestPhone);

  const total = Number(numAdults) + Number(numChildren);
  const overCapacity = total > maxCapacity;
  const canContinue = total > 0 && !overCapacity && guestName.trim() && guestPhone.trim();

  return (
    <div>
      <h2 className="text-xl font-semibold text-slate-900 mb-2">Datos de la reserva</h2>
      <p className="text-sm text-slate-500 mb-6">
        El número de asistentes valida la capacidad máxima. No se calcula como ticket por persona.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Adultos estimados" type="number" min={1} value={numAdults} onChange={(e) => setNumAdults(Number(e.target.value))} />
        <Input label="Niños estimados" type="number" min={0} value={numChildren} onChange={(e) => setNumChildren(Number(e.target.value))} />
      </div>

      <div className={["mt-4 rounded-2xl border p-4", overCapacity ? "border-rose-200 bg-rose-50" : "border-pool-100 bg-pool-50"].join(" ")}>
        <div className="text-sm font-semibold text-slate-900">Asistentes estimados: {total}</div>
        <div className="text-sm text-slate-600">Capacidad máxima de la sede: {maxCapacity} personas por reserva.</div>
        {overCapacity && <div className="mt-2 text-sm font-medium text-rose-700">Este grupo supera la capacidad máxima. Solicita evento especial o ajusta el número.</div>}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Input label="Nombre completo" value={guestName} onChange={(e) => setGuestName(e.target.value)} placeholder="Nombre de quien reserva" />
        <Input label="WhatsApp" value={guestPhone} onChange={(e) => setGuestPhone(e.target.value)} placeholder="0412..." />
        <div className="sm:col-span-2">
          <Input label="Email" type="email" value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} placeholder="correo@ejemplo.com" />
        </div>
        <div className="sm:col-span-2">
          <Textarea label="Notas opcionales" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Cuéntanos si celebran algo, si necesitan apoyo o detalles especiales." />
        </div>
      </div>

      <div className="mt-6 flex justify-between gap-3">
        <Button variant="ghost" onClick={onBack}>Volver</Button>
        <Button disabled={!canContinue} onClick={() => onNext({ numAdults, numChildren, notes, guestName, guestEmail, guestPhone })}>Continuar</Button>
      </div>
    </div>
  );
}
