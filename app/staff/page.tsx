import Link from "next/link";

const modules = [
  ["Landing", "Editar hero, textos, CTA y secciones principales."],
  ["Galería", "Gestionar fotos de sedes, eventos y espacios."],
  ["FAQs", "Actualizar preguntas frecuentes."],
  ["Promociones", "Activar avisos y campañas temporales."],
  ["Blog", "Publicar novedades, consejos y contenido familiar."],
];

export default function StaffPage() {
  return (
    <main className="min-h-screen bg-[#f3fbff] p-4 sm:p-6 lg:p-8">
      <section className="rounded-[2rem] bg-slate-950 p-8 text-white shadow-xl shadow-cyan-950/10">
        <p className="text-sm font-black uppercase tracking-[0.22em] text-cyan-200">Staff CMS</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight">Módulo editorial</h1>
        <p className="mt-4 max-w-2xl text-cyan-50/80">
          Espacio para editar contenido del landing, galería, FAQs, promociones y blog.
          La versión visual queda lista para conectar persistencia luego.
        </p>
        <div className="mt-6">
          <Link href="/admin" className="rounded-2xl bg-cyan-300 px-5 py-3 text-sm font-black text-slate-950">
            Volver al admin
          </Link>
        </div>
      </section>

      <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {modules.map(([title, description]) => (
          <div key={title} className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-xl shadow-cyan-950/5">
            <h2 className="text-2xl font-black text-slate-950">{title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">{description}</p>
            <button className="mt-6 rounded-2xl border border-cyan-200 bg-cyan-50 px-5 py-3 text-sm font-black text-cyan-800">
              Próximamente
            </button>
          </div>
        ))}
      </section>
    </main>
  );
}
