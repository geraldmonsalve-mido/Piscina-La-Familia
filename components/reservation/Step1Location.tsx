import type { Location } from "@/lib/types";
import Button from "@/components/ui/Button";

interface Props {
  locations: Location[];
  selected: Location | null;
  onSelect: (location: Location) => void;
}

export default function Step1Location({ locations, selected, onSelect }: Props) {
  return (
    <div>
      <div className="mb-8 text-center">
        <p className="text-sm font-black uppercase tracking-[0.22em] text-cyan-700">
          Paso 1
        </p>
        <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
          Elige la sede
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-slate-600">
          Selecciona dónde quieres reservar. Ambas sedes tienen capacidad máxima para 50 personas.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {locations.map((location) => {
          const active = selected?.id === location.id;

          return (
            <div
              key={location.id}
              role="button"
              tabIndex={0}
              onClick={() => onSelect(location)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onSelect(location);
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

              {location.phone && (
                <p className="mt-5 text-sm font-bold text-slate-700">
                  WhatsApp: {location.phone}
                </p>
              )}

              <div className="mt-6">
                <Button
                  type="button"
                  variant={active ? "primary" : "secondary"}
                  className="w-full justify-center"
                  onClick={(event) => {
                    event.stopPropagation();
                    onSelect(location);
                  }}
                >
                  {active ? "Sede seleccionada" : "Elegir esta sede"}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
