import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Piscina La Familia — Reserva tu día en el agua",
  description:
    "Disfruta de nuestras piscinas privadas en San Francisco y Maracaibo, Zulia. Reserva por horas, eventos familiares, cumpleaños y más.",
  keywords: ["piscina", "maracaibo", "san francisco", "zulia", "reservas", "alquiler piscina"],
  openGraph: {
    title: "Piscina La Familia",
    description: "Reserva tu piscina privada en el Zulia",
    type: "website",
    locale: "es_VE",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="h-full">
      <body
        className={`${inter.className} min-h-full flex flex-col antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
