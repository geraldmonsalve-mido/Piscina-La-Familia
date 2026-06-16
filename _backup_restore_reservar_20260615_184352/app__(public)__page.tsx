import Link from "next/link";
import Button from "@/components/ui/Button";

const features = [
  {
    icon: (
      <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: "Privacidad total",
    desc: "Disfruta la piscina en exclusiva con tu familia o grupo. Sin extraños.",
  },
  {
    icon: (
      <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    title: "Reserva en minutos",
    desc: "Sin WhatsApp, sin llamadas. Elige fecha, horario y confirma al instante.",
  },
  {
    icon: (
      <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: "2 sedes disponibles",
    desc: "Sierra Maestra (San Francisco) y Los Cortijos (Maracaibo).",
  },
  {
    icon: (
      <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
    title: "Ideal para eventos",
    desc: "Cumpleaños, reuniones familiares, eventos corporativos. Cotización personalizada.",
  },
];

const services = [
  {
    name: "Reserva por Horas",
    duration: "3 horas",
    desc: "Perfecto para grupos pequeños o parejas. Máximo 50 personas.",
    tag: "Más popular",
    tagColor: "bg-pool-100 text-pool-700",
    icon: "⏱️",
  },
  {
    name: "Reserva Familiar Privada",
    duration: "6 horas",
    desc: "Medio día completo en privado con uso de parrilleras y área de descanso.",
    tag: "Familiar",
    tagColor: "bg-emerald-100 text-emerald-700",
    icon: "👨‍👩‍👧‍👦",
  },
  {
    name: "Cumpleaños",
    duration: "4 horas",
    desc: "Celebra en grande con decoración básica y asistencia de nuestro equipo.",
    tag: "Cotización",
    tagColor: "bg-sol-100 text-sol-700",
    icon: "🎂",
  },
  {
    name: "Evento Privado",
    duration: "Según evento",
    desc: "Graduaciones, empresas, reuniones. Personalizado a tu medida.",
    tag: "Cotización",
    tagColor: "bg-sol-100 text-sol-700",
    icon: "🎉",
  },
  {
    name: "Grupo Especial",
    duration: "A convenir",
    desc: "Grupos deportivos, escolares o corporativos. Precio especial por volumen.",
    tag: "Cotización",
    tagColor: "bg-sol-100 text-sol-700",
    icon: "👥",
  },
];

const steps = [
  {
    num: "01",
    title: "Elige tu sede y fecha",
    desc: "Selecciona entre Sierra Maestra o Los Cortijos y encuentra la fecha que más te convenga.",
  },
  {
    num: "02",
    title: "Selecciona el horario",
    desc: "Consulta la disponibilidad en tiempo real y elige el bloque horario que mejor se adapte.",
  },
  {
    num: "03",
    title: "Confirma tu reserva",
    desc: "Ingresa tus datos y confirma. Recibirás un correo con todos los detalles y código QR.",
  },
  {
    num: "04",
    title: "¡A disfrutar!",
    desc: "Preséntate en la sede con tu código QR y disfruta de la piscina en privado.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-pool-950">
        {/* Background gradient */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              "radial-gradient(ellipse at 30% 50%, #155ddc 0%, transparent 60%), radial-gradient(ellipse at 70% 20%, #06b6d4 0%, transparent 50%)",
          }}
        />

        {/* Wave SVG bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1450 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0 60 C250 100 480 20 720 60 C960 100 1200 20 1450 60 L1450 120 L0 120 Z"
              fill="white"
              fillOpacity="0.08"
            />
            <path
              d="M0 80 C360 50 720 120 1080 80 C1260 60 1380 90 1450 80 L1450 120 L0 120 Z"
              fill="white"
            />
          </svg>
        </div>

        <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto pt-20">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm text-white/90 mb-6">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            2 sedes disponibles en el Zulia
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            Tu piscina privada,{" "}
            <span className="text-agua-300">cuando quieras</span>
          </h1>

          <p className="text-lg sm:text-xl text-white/75 max-w-2xl mx-auto mb-10 leading-relaxed">
            Reserva una de nuestras piscinas exclusivas en San Francisco o
            Maracaibo. Sin ruido, sin aglomeraciones — solo tu familia y el agua.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/reservar">
              <Button size="lg" className="!bg-cyan-300 !text-slate-950 hover:!bg-cyan-200 !shadow-lg !shadow-cyan-900/30 font-bold">
                Reservar ahora
                <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Button>
            </Link>
            <a href="#servicios">
              <Button
                size="lg"
                variant="outline"
                className="!border-white/60 !text-white hover:!bg-white/15 font-bold"
              >
                Ver servicios
              </Button>
            </a>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-6 max-w-md mx-auto">
            {[
              { val: "2", label: "Sedes" },
              { val: "50", label: "Personas máx." },
              { val: "5", label: "Tipos de reserva" },
            ].map(({ val, label }) => (
              <div key={label} className="text-center">
                <p className="text-3xl font-bold text-white">{val}</p>
                <p className="text-xs text-white/60 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">
              ¿Por qué elegir Piscina La Familia?
            </h2>
            <p className="text-slate-600 max-w-xl mx-auto">
              Reemplazamos el caos del WhatsApp con una experiencia de reserva
              limpia, rápida y confiable.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon, title, desc }) => (
              <div
                key={title}
                className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-pool-200 hover:shadow-sm transition-all"
              >
                <div className="size-12 rounded-xl bg-pool-100 text-pool-600 flex items-center justify-center mb-4">
                  {icon}
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">{title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEDES */}
      <section id="sedes" className="py-20 bg-pool-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">
              Nuestras sedes
            </h2>
            <p className="text-slate-600">
              Dos ubicaciones estratégicas en el estado Zulia para tu comodidad.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                name: "Sierra Maestra",
                location: "San Francisco, Zulia",
                address: "Calle 22 entre Av. 10 y 12",
                phone: "0412-549-7463",
                capacity: 50,
                amenities: ["Parrilleras", "Vestuarios", "Estacionamiento", "Área infantil", "WiFi"],
                color: "from-pool-500 to-pool-700",
              },
              {
                name: "Los Cortijos",
                location: "Maracaibo, Zulia",
                address: "Kilómetro 12, Los Cortijos",
                phone: "0412-105-5663",
                capacity: 50,
                amenities: ["Parrilleras", "Vestuarios", "Estacionamiento amplio", "Área de eventos", "Rancho techado"],
                color: "from-agua-500 to-agua-700",
              },
            ].map((sede) => (
              <div
                key={sede.name}
                className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100"
              >
                {/* Imagen placeholder */}
                <div
                  className={`h-48 bg-gradient-to-br ${sede.color} flex items-center justify-center`}
                >
                  <svg className="size-16 text-white/50" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M2 18c1.5 0 2.5-1 4-1s2.5 1 4 1 2.5-1 4-1 2.5 1 4 1v2c-1.5 0-2.5-1-4-1s-2.5 1-4 1-2.5-1-4-1-2.5 1-4 1v-2zm0-4c1.5 0 2.5-1 4-1s2.5 1 4 1 2.5-1 4-1 2.5 1 4 1v2c-1.5 0-2.5-1-4-1s-2.5 1-4 1-2.5-1-4-1-2.5 1-4 1v-2zm8-10a4 4 0 110 8 4 4 0 010-8z" />
                  </svg>
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">{sede.name}</h3>
                      <p className="text-sm text-slate-500">{sede.location}</p>
                    </div>
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-medium">
                      Disponible
                    </span>
                  </div>

                  <div className="space-y-2 mb-4 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <svg className="size-4 text-slate-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {sede.address}
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="size-4 text-slate-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {sede.phone}
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="size-4 text-slate-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Hasta {sede.capacity} personas
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {sede.amenities.map((a) => (
                      <span
                        key={a}
                        className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full"
                      >
                        {a}
                      </span>
                    ))}
                  </div>

                  <Link href={`/reservar?sede=${encodeURIComponent(sede.name)}`}>
                    <Button fullWidth variant="outline">
                      Solicitar en {sede.name}
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICIOS */}
      <section id="servicios" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">
              Tipos de reserva
            </h2>
            <p className="text-slate-600 max-w-xl mx-auto">
              Desde un bloque de horas hasta eventos especiales. Tenemos la
              opción perfecta para ti.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((s) => (
              <div
                key={s.name}
                className="p-6 rounded-2xl border border-slate-100 hover:border-pool-200 hover:shadow-sm transition-all bg-white"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl">{s.icon}</span>
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-medium ${s.tagColor}`}
                  >
                    {s.tag}
                  </span>
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">{s.name}</h3>
                <p className="text-xs text-pool-600 font-medium mb-2">
                  Duración: {s.duration}
                </p>
                <p className="text-sm text-slate-600 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/reservar">
              <Button size="lg">Hacer mi reserva</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section id="como-funciona" className="py-20 bg-pool-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">
              ¿Cómo funciona?
            </h2>
            <p className="text-pool-200/70 max-w-xl mx-auto">
              4 pasos simples para tener tu piscina privada lista.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map(({ num, title, desc }) => (
              <div key={num} className="relative">
                <div className="text-5xl font-black text-pool-700/50 mb-3">
                  {num}
                </div>
                <h3 className="font-semibold text-white mb-2">{title}</h3>
                <p className="text-sm text-pool-200/70 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/reservar">
              <Button
                size="lg"
                className="!bg-cyan-300 !text-slate-950 hover:!bg-cyan-200 !shadow-lg !shadow-cyan-900/30 font-bold"
              >
                Empezar ahora
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-20 bg-gradient-to-br from-agua-500 to-pool-600">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            ¿Listo para el agua?
          </h2>
          <p className="text-white/80 text-lg mb-8 leading-relaxed">
            Crea tu cuenta gratis y reserva en menos de 3 minutos. Sin
            complicaciones, sin WhatsApp.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/auth/registro">
              <Button
                size="lg"
                className="!bg-cyan-300 !text-slate-950 hover:!bg-cyan-200 font-bold"
              >
                Crear cuenta gratis
              </Button>
            </Link>
            <Link href="/reservar">
              <Button
                size="lg"
                variant="outline"
                className="!border-white/70 !text-white hover:!bg-white/15 font-bold"
              >
                Reservar ahora
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
