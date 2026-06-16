"use client";

import { useEffect, useMemo, useState } from "react";
import type { Location, ReservationType, TimeBlock } from "@/lib/types";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";

interface Props {
  location: Location;
  reservationType: ReservationType;
  selectedDate: string;
  selectedBlock: TimeBlock | null;
  onSelect: (date: string, timeBlock: TimeBlock) => void;
  onBack: () => void;
}

function todayISO() {
  const date = new Date();
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 10);
}

function dayOfWeek(dateISO: string) {
  const [year, month, day] = dateISO.split("-").map(Number);
  return new Date(year, month - 1, day).getDay();
}

function formatHour(value: string) {
  return value.slice(0, 5);
}

export default function Step3DateTime({
  location,
  reservationType,
  selectedDate,
  selectedBlock,
  onSelect,
  onBack,
}: Props) {
  const [date, setDate] = useState(selectedDate || todayISO());
  const [blocks, setBlocks] = useState<TimeBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function loadBlocks() {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(`/api/time-blocks?location_id=${location.id}&date=${date}`);
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error || "No se pudieron cargar los horarios");
        if (!cancelled) setBlocks(payload.blocks ?? []);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Error cargando horarios");
          setBlocks([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadBlocks();
    return () => {
      cancelled = true;
    };
  }, [location.id, date]);

  const filteredBlocks = useMemo(() => {
    const dow = dayOfWeek(date);
    return blocks.filter((block) => block.day_of_week.includes(dow));
  }, [blocks, date]);

  return (
    <div>
      <h2 className="text-xl font-semibold text-slate-900 mb-2">Elige fecha y bloque horario</h2>
      <p className="text-sm text-slate-500 mb-6">
        Estás reservando <strong>{reservationType.name}</strong> en <strong>{location.name}</strong>. La disponibilidad es por bloque, no por tickets individuales.
      </p>

      <label className="block mb-5">
        <span className="text-sm font-medium text-slate-700">Fecha</span>
        <input
          type="date"
          min={todayISO()}
          value={date}
          onChange={(event) => setDate(event.target.value)}
          className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-pool-500 focus:ring-4 focus:ring-pool-100"
        />
      </label>

      {loading ? (
        <div className="flex items-center justify-center py-12 text-slate-500"><Spinner /> <span className="ml-3">Buscando horarios...</span></div>
      ) : error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</div>
      ) : filteredBlocks.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center">
          <div className="text-3xl mb-2">🌤️</div>
          <h3 className="font-semibold text-slate-900">Sin bloques disponibles</h3>
          <p className="text-sm text-slate-500 mt-1">Prueba otra fecha o consulta por WhatsApp para revisar opciones especiales.</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {filteredBlocks.map((block) => {
            const active = selectedBlock?.id === block.id;
            return (
              <button
                key={block.id}
                type="button"
                onClick={() => onSelect(date, block)}
                className={[
                  "rounded-2xl border-2 bg-white p-4 text-left transition hover:border-pool-400 hover:shadow-sm",
                  active ? "border-pool-500 ring-4 ring-pool-100" : "border-slate-200",
                ].join(" ")}
              >
                <div className="text-lg font-bold text-slate-900">{formatHour(block.start_time)} - {formatHour(block.end_time)}</div>
                <div className="mt-1 text-sm text-slate-500">Bloque privado</div>
                <div className="mt-3 inline-flex rounded-full bg-pool-50 px-3 py-1 text-xs font-semibold text-pool-700">
                  {block.price > 0 ? `$${block.price} / bloque` : "Precio por confirmar"}
                </div>
              </button>
            );
          })}
        </div>
      )}

      <div className="mt-6 flex justify-between gap-3">
        <Button variant="ghost" onClick={onBack}>Volver</Button>
      </div>
    </div>
  );
}
