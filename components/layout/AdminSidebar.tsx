"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Logo from "@/components/brand/Logo";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: "⌂" },
  { href: "/admin/calendario", label: "Calendario", icon: "□" },
  { href: "/admin/reservas", label: "Reservas", icon: "▣" },
  { href: "/admin/solicitudes", label: "Solicitudes", icon: "✉" },
  { href: "/admin/clientes", label: "Clientes", icon: "◎" },
  { href: "/admin/ingresos", label: "Ingresos", icon: "$" },
  { href: "/admin/disponibilidad", label: "Disponibilidad", icon: "◴" },
  { href: "/admin/planes", label: "Planes", icon: "◇" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-slate-200 bg-white lg:flex lg:flex-col">
      <div className="flex h-24 items-center border-b border-slate-100 px-6">
        <Logo href="/admin" size="md" />
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {navItems.map((item) => {
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-black transition-all",
                active
                  ? "bg-cyan-50 text-cyan-800 ring-1 ring-cyan-100"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-950",
              ].join(" ")}
            >
              <span
                className={[
                  "flex size-7 items-center justify-center rounded-xl text-xs",
                  active ? "bg-cyan-200 text-cyan-950" : "bg-slate-100 text-slate-500",
                ].join(" ")}
              >
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}

        <a
          href="/staff"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-black text-slate-600 transition-all hover:bg-slate-50 hover:text-slate-950"
        >
          <span className="flex size-7 items-center justify-center rounded-xl bg-slate-100 text-xs text-slate-500">
            ✎
          </span>
          <span>Staff CMS</span>
          <span className="ml-auto text-xs text-slate-400">↗</span>
        </a>
      </nav>

      <div className="border-t border-slate-100 p-3">
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="mb-2 flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 hover:bg-slate-50"
        >
          Ver sitio web ↗
        </a>

        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center justify-center rounded-2xl bg-rose-50 px-4 py-3 text-sm font-black text-rose-700 hover:bg-rose-100"
        >
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
