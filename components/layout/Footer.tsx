import Link from "next/link";
import Logo from "@/components/brand/Logo";

export default function Footer() {
  return (
    <footer id="contacto" className="bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <Logo onDark size="md" />
            <p className="mt-5 max-w-xs text-sm leading-6 text-slate-300">
              Reservas privadas por horas para familias, cumpleaños y eventos especiales en el Zulia.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-cyan-300">Sedes</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              <li>Sierra Maestra — San Francisco</li>
              <li>Los Cortijos — Maracaibo</li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-cyan-300">Accesos rápidos</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li><Link href="/reservar" className="text-slate-300 hover:text-white">Reservar ahora</Link></li>
              <li><Link href="/auth/login" className="text-slate-300 hover:text-white">Iniciar sesión</Link></li>
              <li><Link href="/auth/registro" className="text-slate-300 hover:text-white">Crear cuenta</Link></li>
              <li><Link href="/staff" className="text-slate-300 hover:text-white">Staff</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-cyan-300">Contacto</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              <li>Sierra Maestra: 0412-549-7463</li>
              <li>Los Cortijos: 0412-105-5663</li>
              <li>
                <a
                  href="https://wa.me/584125497463?text=Hola!%20Quiero%20reservar%20en%20Piscina%20La%20Familia"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex rounded-2xl bg-emerald-400 px-4 py-2 font-black text-slate-950 hover:bg-emerald-300"
                >
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-xs text-slate-400">
          © {new Date().getFullYear()} Piscina La Familia. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
