"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Logo from "@/components/brand/Logo";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

const navItems = [
  { href: "/#sedes", label: "Sedes" },
  { href: "/#servicios", label: "Servicios" },
  { href: "/#como-funciona", label: "¿Cómo funciona?" },
  { href: "/#contacto", label: "Contacto" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));
  }, []);

  const transparent = pathname === "/" && !scrolled;

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        transparent
          ? "bg-transparent"
          : "bg-white/95 backdrop-blur-xl shadow-sm ring-1 ring-slate-900/5",
      ].join(" ")}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo size="sm" onDark={transparent} />

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "text-sm font-semibold transition-colors",
                transparent
                  ? "text-white/85 hover:text-white"
                  : "text-slate-700 hover:text-cyan-700",
              ].join(" ")}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href={user ? "/cuenta" : "/auth/login"}
            className={[
              "rounded-2xl px-5 py-3 text-sm font-bold transition-all",
              transparent
                ? "border border-white/45 bg-white/10 text-white hover:bg-white/20"
                : "border border-slate-200 bg-white text-slate-800 shadow-sm hover:border-cyan-200 hover:bg-cyan-50",
            ].join(" ")}
          >
            {user ? "Mi cuenta" : "Iniciar sesión"}
          </Link>

          <Link
            href="/reservar"
            className="rounded-2xl bg-cyan-300 px-5 py-3 text-sm font-black text-slate-950 shadow-lg shadow-cyan-900/20 transition-all hover:-translate-y-0.5 hover:bg-cyan-200"
          >
            Reservar ahora
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className={[
            "inline-flex size-11 items-center justify-center rounded-2xl border md:hidden",
            transparent
              ? "border-white/35 bg-white/10 text-white"
              : "border-slate-200 bg-white text-slate-900",
          ].join(" ")}
          aria-label="Abrir menú"
        >
          <span className="text-xl">{open ? "×" : "☰"}</span>
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-white px-4 py-5 shadow-xl md:hidden">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-cyan-50"
              >
                {item.label}
              </Link>
            ))}

            <div className="mt-3 grid grid-cols-2 gap-3">
              <Link
                href={user ? "/cuenta" : "/auth/login"}
                onClick={() => setOpen(false)}
                className="rounded-2xl border border-slate-200 px-4 py-3 text-center text-sm font-bold text-slate-800"
              >
                {user ? "Mi cuenta" : "Iniciar sesión"}
              </Link>

              <Link
                href="/reservar"
                onClick={() => setOpen(false)}
                className="rounded-2xl bg-cyan-300 px-4 py-3 text-center text-sm font-black text-slate-950"
              >
                Reservar
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
