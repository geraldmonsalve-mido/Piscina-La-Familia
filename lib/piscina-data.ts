import type { Location, ReservationType, TimeBlock } from "@/lib/types";

export const locations: Location[] = [
  {
    id: "sierra-maestra",
    name: "Sierra Maestra",
    address: "Calle 22 entre Av. 10 y 12, San Francisco, Zulia",
    phone: "0412-549-7463",
    capacity_max: 50,
    description:
      "Piscina privada en San Francisco con espacios nuevos, zona infantil, parrillera, mini bar, tarima iluminada y ambientes instagrameables.",
    images: [],
    amenities: [
      "Piscina para adultos",
      "Piscina para niños",
      "Parque y zona infantil",
      "Parrillera y cocina",
      "Habitación con aire y cama para niños",
      "10 mesas con sus sillas",
      "Sonido Bluetooth",
      "WiFi",
      "Cava congeladora",
      "Muebles para sentarse",
      "Mini bar",
      "Tarima iluminada",
      "Baños",
      "Estacionamiento para 7 carros",
    ],
    is_active: true,
    created_at: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "los-cortijos",
    name: "Los Cortijos",
    address: "Kilómetro 12, Los Cortijos, Maracaibo",
    phone: "0412-105-5663",
    capacity_max: 50,
    description:
      "Sede privada en Los Cortijos con piscina para adultos y niños, cascada, jardín, grama, mesa de pool y zona familiar premium.",
    images: [],
    amenities: [
      "Piscina para adultos",
      "Piscina para niños",
      "Cascada",
      "Parque y zona infantil",
      "Mesa de pool",
      "Más de 1.500 m² con grama",
      "Hermoso jardín",
      "Parrillera y cocina",
      "Habitación con aire y cama para niños",
      "9 mesas con sus sillas",
      "Sonido Bluetooth",
      "WiFi",
      "Cava congeladora",
      "Mini bar",
      "Baños",
      "Estacionamiento para 10 carros",
    ],
    is_active: true,
    created_at: "2026-01-01T00:00:00.000Z",
  },
];

export const reservationTypes: ReservationType[] = [
  {
    id: "reserva-por-turno",
    name: "Reserva por Turno",
    description: "Reserva completa de la piscina para tu grupo en horario mañana o tarde.",
    price_base: 0,
    duration_hours: 8,
    requires_quote: false,
    is_active: true,
    sort_order: 1,
    created_at: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "cumpleanos",
    name: "Cumpleaños",
    description: "Celebración privada por turno con espacios para compartir, música y zona familiar.",
    price_base: 0,
    duration_hours: 8,
    requires_quote: true,
    is_active: true,
    sort_order: 2,
    created_at: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "evento-privado",
    name: "Evento Privado",
    description: "Eventos familiares o privados sujetos a disponibilidad y requerimientos.",
    price_base: 0,
    duration_hours: 8,
    requires_quote: true,
    is_active: true,
    sort_order: 3,
    created_at: "2026-01-01T00:00:00.000Z",
  },
];

export const timeBlocks: TimeBlock[] = [
  {
    id: "sierra-manana-lj",
    location_id: "sierra-maestra",
    day_of_week: [1, 2, 3, 4],
    start_time: "10:00",
    end_time: "18:00",
    price: 90,
    capacity: 50,
    is_active: true,
    created_at: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "sierra-tarde-lj",
    location_id: "sierra-maestra",
    day_of_week: [1, 2, 3, 4],
    start_time: "19:00",
    end_time: "01:00",
    price: 90,
    capacity: 50,
    is_active: true,
    created_at: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "sierra-manana-vsd",
    location_id: "sierra-maestra",
    day_of_week: [5, 6, 0],
    start_time: "10:00",
    end_time: "18:00",
    price: 120,
    capacity: 50,
    is_active: true,
    created_at: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "sierra-tarde-vsd",
    location_id: "sierra-maestra",
    day_of_week: [5, 6, 0],
    start_time: "19:00",
    end_time: "01:00",
    price: 120,
    capacity: 50,
    is_active: true,
    created_at: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "cortijos-manana-lj",
    location_id: "los-cortijos",
    day_of_week: [1, 2, 3, 4],
    start_time: "10:00",
    end_time: "18:00",
    price: 70,
    capacity: 50,
    is_active: true,
    created_at: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "cortijos-tarde-lj",
    location_id: "los-cortijos",
    day_of_week: [1, 2, 3, 4],
    start_time: "19:00",
    end_time: "01:00",
    price: 70,
    capacity: 50,
    is_active: true,
    created_at: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "cortijos-manana-vsd",
    location_id: "los-cortijos",
    day_of_week: [5, 6, 0],
    start_time: "10:00",
    end_time: "18:00",
    price: 100,
    capacity: 50,
    is_active: true,
    created_at: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "cortijos-tarde-vsd",
    location_id: "los-cortijos",
    day_of_week: [5, 6, 0],
    start_time: "19:00",
    end_time: "01:00",
    price: 100,
    capacity: 50,
    is_active: true,
    created_at: "2026-01-01T00:00:00.000Z",
  },
];

export function getBlocksForLocationAndDate(locationId: string, date?: string) {
  if (!date) return timeBlocks.filter((block) => block.location_id === locationId);

  const day = new Date(`${date}T12:00:00`).getDay();

  return timeBlocks.filter(
    (block) =>
      block.location_id === locationId &&
      block.day_of_week.includes(day) &&
      block.is_active
  );
}
