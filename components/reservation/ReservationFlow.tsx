"use client";

import { useEffect, useMemo, useState } from "react";
import type { Location, ReservationType, TimeBlock } from "@/lib/types";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";

export interface FlowData {
  location: Location | null;
  reservationType: ReservationType | null;
  date: string;
  timeBlock: TimeBlock | null;

  // Nuevo flujo
  guests: number;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  notes?: string;

  // Compatibilidad con componentes antiguos Step4Guests y Step5Confirm
  numAdults: number;
  numChildren: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
}

interface Props {
  locations: Location[];
  reservationTypes?: ReservationType[];
  types?: ReservationType[];
}

type Step = 1 | 2 | 3 | 4 | 5;

function formatTime(value: string) {
  if (!value) return "";
  const [hourRaw, minute = "00"] = value.split(":");
  let hour = Number(hourRaw);
  const suffix = hour >= 12 ? "p.m." : "a.m.";
  hour = hour % 12 || 12;
  return `${hour}:${minute} ${suffix}`;
}

function dayLabel(date: string) {
  if (!date) return "";
  const value = new Date(`${date}T12:00:00`);
  return new Intl.DateTimeFormat("es-VE", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(value);
}

export default function ReservationFlow({
  locations,
  reservationTypes,
  types,
}: Props) {
  const availableTypes = useMemo(
    () => reservationTypes ?? types ?? [],
    [reservationTypes, types]
  );

  const [step, setStep] = useState<Step>(1);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [selectedType, setSelectedType] = useState<ReservationType | null>(null);
  const [date, setDate] = useState("");
  const [blocks, setBlocks] = useState<TimeBlock[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<TimeBlock | null>(null);
  const [loadingBlocks, setLoadingBlocks] = useState(false);

  const [guests, setGuests] = useState("25");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!selectedLocation || !date) {
      setBlocks([]);
      setSelectedBlock(null);
      return;
    }

    let active = true;

    async function loadBlocks() {
      try {
        setLoadingBlocks(true);
        const params = new URLSearchParams({
          location_id: selectedLocation!.id,
          date,
        });

        const response = await fetch(`/api/time-blocks?${params.toString()}`);
        const json = await response.json();

        if (!active) return;

        setBlocks(Array.isArray(json.blocks) ? json.blocks : []);
        setSelectedBlock(null);
      } catch {
        if (active) {
          setBlocks([]);
          setSelectedBlock(null);
        }
      } finally {
        if (active) setLoadingBlocks(false);
      }
    }

    loadBlocks();

    return () => {
      active = false;
    };
  }, [selectedLocation, date]);

  const maxCapacity = selectedLocation?.capacity_max ?? 50;
  const guestNumber = Number(guests || 0);
  const guestsInvalid = guestNumber < 1 || guestNumber > maxCapacity;

  const canContinueFromStep1 = Boolean(selectedLocation);
  const canContinueFromStep2 = Boolean(selectedType);
  const canContinueFromStep3 = Boolean(date && selectedBlock);
  const canContinueFromStep4 = Boolean(!guestsInvalid && name.trim() && phone.trim());

  function goBack() {
    setStep((current) => Math.max(1, current - 1) as Step);
  }

  function goNext() {
    setStep((current) => Math.min(5, current + 1) as Step);
  }

  const steps = ["Sede", "Tipo", "Fecha y turno", "Datos", "Confirmar"];

  return (
    <div>
      <div className="mb-10">
        <div className="grid grid-cols-5 gap-2">
          {steps.map((label, index) => {
            const number = index + 1;
            const active = number === step;
            const done = number < step;

            return (
              <div key={label} className="text-center">
                <div
                  className={[
                    "mx-auto flex size-10 items-center justify-center rounded-full border text-sm font-black transition-all",
                    active
                      ? "border-cyan-400 bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-900/20"
                      : done
                      ? "border-emerald-400 bg-emerald-100 text-emerald-700"
                      : "border-slate-200 bg-white text-slate-400",
                  ].join(" ")}
                >
                  {done ? "✓" : number}
                </div>
                <p
                  className={[
                    "mt-2 hidden text-xs font-bold sm:block",
                    active ? "text-cyan-700" : "text-slate-400",
                  ].join(" ")}
                >
                  {label}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {step === 1 && (
        <section>
          <div className="mb-8 text-center">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-cyan-700">
              Paso 1
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
              Elige la sede
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-600">
              Ambas sedes operan por turno privado y tienen capacidad máxima para 50 personas.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {locations.map((location) => {
              const active = selectedLocation?.id === location.id;

              return (
                <div
                  key={location.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedLocation(location)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setSelectedLocation(location);
                    }
                  }}
                  className={[
                    "group relative cursor-pointer overflow-hidden rounded-[2rem] border p-6 text-left transition-all duration-300",
                    active
                      ? "border-cyan-400 bg-cyan-50 shadow-xl shadow-cyan-900/10 ring-4 ring-cyan-100"
                      : "border-slate-200 bg-white hover:-translate-y-1 hover:border-cyan-200 hover:shadow-xl hover:shadow-slate-900/8",
                  ].join(" ")}
                >
                  <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-cyan-300 via-sky-400 to-emerald-300" />

                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-black text-slate-950">
                        {location.name}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {location.address}
                      </p>
                    </div>

                    <div
                      className={[
                        "flex size-12 shrink-0 items-center justify-center rounded-2xl text-lg font-black",
                        active
                          ? "bg-cyan-400 text-slate-950"
                          : "bg-slate-100 text-slate-500 group-hover:bg-cyan-100 group-hover:text-cyan-700",
                      ].join(" ")}
                    >
                      {active ? "✓" : "⌁"}
                    </div>
                  </div>

                  <p className="mt-5 text-sm leading-6 text-slate-600">
                    {location.description}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                      Máx. {location.capacity_max} personas
                    </span>
                    <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-bold text-cyan-800">
                      Reserva privada
                    </span>
                  </div>

                  <div className="mt-5 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
                    {(location.amenities || []).slice(0, 6).map((item) => (
                      <span key={item} className="flex items-center gap-2">
                        <span className="text-cyan-700">✓</span>
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex justify-end">
            <Button disabled={!canContinueFromStep1} onClick={goNext}>
              Continuar
            </Button>
          </div>
        </section>
      )}

      {step === 2 && (
        <section>
          <div className="mb-8 text-center">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-cyan-700">
              Paso 2
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
              Elige el tipo de reserva
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-600">
              Puedes reservar por turno normal o solicitar una celebración especial.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {availableTypes.map((type) => {
              const active = selectedType?.id === type.id;

              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setSelectedType(type)}
                  className={[
                    "rounded-[1.75rem] border p-5 text-left transition-all",
                    active
                      ? "border-cyan-400 bg-cyan-50 shadow-xl shadow-cyan-900/10 ring-4 ring-cyan-100"
                      : "border-slate-200 bg-white hover:-translate-y-1 hover:border-cyan-200 hover:shadow-lg",
                  ].join(" ")}
                >
                  <div className="text-2xl">
                    {type.name.toLowerCase().includes("cumple") ? "🎂" : "🏊"}
                  </div>
                  <h3 className="mt-3 text-xl font-black text-slate-950">
                    {type.name}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {type.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                      {type.duration_hours ? `${type.duration_hours}h aprox.` : "Flexible"}
                    </span>
                    {type.requires_quote && (
                      <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
                        Por cotización
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-8 flex justify-between">
            <Button variant="secondary" onClick={goBack}>
              Volver
            </Button>
            <Button disabled={!canContinueFromStep2} onClick={goNext}>
              Continuar
            </Button>
          </div>
        </section>
      )}

      {step === 3 && (
        <section>
          <div className="mb-8 text-center">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-cyan-700">
              Paso 3
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
              Fecha y turno
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-600">
              El precio cambia según sede y día de la semana.
            </p>
          </div>

          <div className="mx-auto max-w-xl">
            <Input
              label="Fecha deseada"
              type="date"
              value={date}
              min="2026-06-15"
              onChange={(event) => setDate(event.target.value)}
            />

            {date && (
              <p className="mt-3 rounded-2xl bg-cyan-50 px-4 py-3 text-sm font-bold text-cyan-800">
                {dayLabel(date)}
              </p>
            )}

            <div className="mt-6">
              <p className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-slate-500">
                Turnos disponibles
              </p>

              {loadingBlocks && (
                <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center text-slate-500">
                  Cargando turnos...
                </div>
              )}

              {!loadingBlocks && date && blocks.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center text-slate-500">
                  No hay turnos disponibles para esta fecha.
                </div>
              )}

              <div className="grid gap-3">
                {blocks.map((block) => {
                  const active = selectedBlock?.id === block.id;

                  return (
                    <button
                      key={block.id}
                      type="button"
                      onClick={() => setSelectedBlock(block)}
                      className={[
                        "flex items-center justify-between rounded-2xl border p-4 text-left transition-all",
                        active
                          ? "border-cyan-400 bg-cyan-50 ring-4 ring-cyan-100"
                          : "border-slate-200 bg-white hover:border-cyan-200",
                      ].join(" ")}
                    >
                      <span>
                        <span className="block font-black text-slate-950">
                          {formatTime(block.start_time)} - {formatTime(block.end_time)}
                        </span>
                        <span className="text-sm text-slate-500">
                          Turno privado para tu grupo
                        </span>
                      </span>

                      <span className="text-xl font-black text-cyan-700">
                        ${block.price}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-between">
            <Button variant="secondary" onClick={goBack}>
              Volver
            </Button>
            <Button disabled={!canContinueFromStep3} onClick={goNext}>
              Continuar
            </Button>
          </div>
        </section>
      )}

      {step === 4 && (
        <section>
          <div className="mb-8 text-center">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-cyan-700">
              Paso 4
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
              Datos de la reserva
            </h2>
          </div>

          <div className="mx-auto grid max-w-2xl gap-5">
            <Input
              label="Número estimado de asistentes"
              type="number"
              value={guests}
              min={1}
              max={maxCapacity}
              error={guestsInvalid ? `Máximo ${maxCapacity} personas por reserva.` : undefined}
              onChange={(event) => setGuests(event.target.value)}
            />

            <Input
              label="Nombre"
              value={name}
              placeholder="Tu nombre"
              onChange={(event) => setName(event.target.value)}
            />

            <Input
              label="WhatsApp"
              value={phone}
              placeholder="Ej: 0412-000-0000"
              onChange={(event) => setPhone(event.target.value)}
            />

            <Textarea
              label="Notas adicionales"
              value={notes}
              placeholder="Cuéntanos si es cumpleaños, evento o alguna solicitud especial."
              onChange={(event) => setNotes(event.target.value)}
            />
          </div>

          <div className="mt-8 flex justify-between">
            <Button variant="secondary" onClick={goBack}>
              Volver
            </Button>
            <Button disabled={!canContinueFromStep4} onClick={goNext}>
              Continuar
            </Button>
          </div>
        </section>
      )}

      {step === 5 && (
        <section>
          <div className="mb-8 text-center">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-cyan-700">
              Paso 5
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
              Confirma tu solicitud
            </h2>
          </div>

          <div className="mx-auto max-w-2xl rounded-[2rem] border border-slate-200 bg-slate-50 p-6">
            <dl className="grid gap-4 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="font-bold text-slate-500">Sede</dt>
                <dd className="text-right font-black text-slate-950">{selectedLocation?.name}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="font-bold text-slate-500">Tipo</dt>
                <dd className="text-right font-black text-slate-950">{selectedType?.name}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="font-bold text-slate-500">Fecha</dt>
                <dd className="text-right font-black text-slate-950">{dayLabel(date)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="font-bold text-slate-500">Turno</dt>
                <dd className="text-right font-black text-slate-950">
                  {selectedBlock
                    ? `${formatTime(selectedBlock.start_time)} - ${formatTime(selectedBlock.end_time)}`
                    : ""}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="font-bold text-slate-500">Asistentes</dt>
                <dd className="text-right font-black text-slate-950">{guestNumber}</dd>
              </div>
              <div className="flex justify-between gap-4 border-t border-slate-200 pt-4">
                <dt className="font-bold text-slate-500">Precio del turno</dt>
                <dd className="text-right text-2xl font-black text-cyan-700">
                  ${selectedBlock?.price ?? 0}
                </dd>
              </div>
            </dl>
          </div>

          <div className="mt-8 flex justify-between">
            <Button variant="secondary" onClick={goBack}>
              Volver
            </Button>
            <Button
              onClick={() => {
                const message = encodeURIComponent(
                  `Hola, quiero reservar Piscina La Familia.%0A%0ASede: ${selectedLocation?.name}%0ATipo: ${selectedType?.name}%0AFecha: ${dayLabel(date)}%0ATurno: ${
                    selectedBlock
                      ? `${formatTime(selectedBlock.start_time)} - ${formatTime(selectedBlock.end_time)}`
                      : ""
                  }%0AAsistentes: ${guestNumber}%0ANombre: ${name}%0ANotas: ${notes || "Sin notas"}`
                );
                window.open(`https://wa.me/584125497463?text=${message}`, "_blank");
              }}
            >
              Enviar por WhatsApp
            </Button>
          </div>
        </section>
      )}
    </div>
  );
}
