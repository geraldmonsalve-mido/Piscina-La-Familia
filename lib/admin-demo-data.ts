import { locations, timeBlocks, reservationTypes } from "@/lib/piscina-data";

export { locations, timeBlocks, reservationTypes };

export const demoReservations = [
  {
    id: "RES-001",
    code: "PLF-001",
    customer: "María González",
    phone: "0412-000-0001",
    location: "Sierra Maestra",
    locationId: "sierra-maestra",
    date: "2026-06-20",
    turn: "10:00 a.m. - 6:00 p.m.",
    guests: 32,
    total: 120,
    status: "confirmed",
    payment: "partial",
    origin: "WhatsApp",
  },
  {
    id: "RES-002",
    code: "PLF-002",
    customer: "Carlos Medina",
    phone: "0412-000-0002",
    location: "Los Cortijos",
    locationId: "los-cortijos",
    date: "2026-06-21",
    turn: "7:00 p.m. - 1:00 a.m.",
    guests: 45,
    total: 100,
    status: "pending",
    payment: "unpaid",
    origin: "Web",
  },
  {
    id: "RES-003",
    code: "PLF-003",
    customer: "Andrea Prieto",
    phone: "0412-000-0003",
    location: "Sierra Maestra",
    locationId: "sierra-maestra",
    date: "2026-06-23",
    turn: "10:00 a.m. - 6:00 p.m.",
    guests: 28,
    total: 90,
    status: "confirmed",
    payment: "paid",
    origin: "Instagram",
  },
];

export const demoLeads = [
  {
    id: "LEAD-001",
    name: "Valentina Rojas",
    phone: "0412-000-0090",
    type: "Cumpleaños",
    date: "2026-06-28",
    guests: 40,
    status: "Nuevo",
    source: "Instagram",
  },
  {
    id: "LEAD-002",
    name: "Eventos Aurora",
    phone: "0412-000-0091",
    type: "Evento Privado",
    date: "2026-07-03",
    guests: 50,
    status: "Contactado",
    source: "Web",
  },
];

export function priceLabel(locationId: string) {
  if (locationId === "sierra-maestra") return "L-J $90 · V-D $120";
  if (locationId === "los-cortijos") return "L-J $70 · V-D $100";
  return "Precio por turno";
}

export function statusTone(status: string): "cyan" | "emerald" | "amber" | "rose" | "slate" {
  if (status === "confirmed" || status === "Confirmada") return "cyan";
  if (status === "paid" || status === "Convertido") return "emerald";
  if (status === "pending" || status === "Nuevo" || status === "Contactado") return "amber";
  if (status === "cancelled" || status === "Perdido") return "rose";
  return "slate";
}
