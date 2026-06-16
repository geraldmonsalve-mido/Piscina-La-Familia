import type { ReservationType } from "@/lib/types";
import Button from "@/components/ui/Button";

interface Props {
  types: ReservationType[];
  selected: ReservationType | null;
  onSelect: (type: ReservationType) => void;
  onBack: () => void;
}

const typeIcons: Record<string, string> = {
  "Reserva por Horas": "⏱️",
  "Reserva Familiar Privada": "👨‍👩‍👧‍👦",
  Cumpleaños: "🎂",
  "Evento Privado": "🎉",
  "Grupo Especial": "👥",
};

export default function Step2Type({ types, selected, onSelect, onBack }: Props) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-slate-900 mb-2">
        ¿Qué tipo de reserva necesitas?
      </h2>
      <p className="text-sm text-slate-500 mb-6">
        Las opciones marcadas con <span className="text-sol-600 font-medium">Cotización</span> requieren
        aprobación previa del equipo.
      </p>

      <div className="space-y-3">
        {types.map((type) => (
          <button
            key={type.id}
            onClick={() => onSelect(type)}
            className={[
              "w-full text-left p-4 rounded-2xl border-2 transition-all duration-150",
              "hover:border-pool-400 hover:shadow-sm",
              selected?.id === type.id
                ? "border-pool-500 bg-pool-50"
                : "border-slate-200 bg-white",
            ].join(" ")}
          >
            <div className="flex items-start gap-4">
              <span className="text-2xl shrink-0 mt-0.5">
                {typeIcons[type.name] ?? "🏊"}
              </span>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-slate-900">{type.name}</span>
                  {type.requires_quote ? (
                    <span className="text-xs bg-sol-100 text-sol-700 px-2 py-0.5 rounded-full font-medium">
                      Cotización
                    </span>
                  ) : (
                    <span className="text-xs bg-pool-100 text-pool-700 px-2 py-0.5 rounded-full font-medium">
                      Reserva directa
                    </span>
                  )}
                </div>

                {type.duration_hours > 0 && (
                  <p className="text-xs text-pool-600 font-medium mt-0.5">
                    Duración: {type.duration_hours} horas
                  </p>
                )}

                {type.description && (
                  <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                    {type.description}
                  </p>
                )}
              </div>

              <div className="shrink-0 mt-1">
                <div
                  className={[
                    "size-5 rounded-full border-2 flex items-center justify-center",
                    selected?.id === type.id
                      ? "border-pool-500 bg-pool-500"
                      : "border-slate-300",
                  ].join(" ")}
                >
                  {selected?.id === type.id && (
                    <svg className="size-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-6">
        <Button variant="ghost" onClick={onBack}>
          <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver
        </Button>
      </div>
    </div>
  );
}
