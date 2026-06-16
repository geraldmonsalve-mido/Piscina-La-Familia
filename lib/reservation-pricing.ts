export type LocationId = "sierra-maestra" | "los-cortijos";
export type TurnId = "morning" | "night";

export const turns = {
  morning: {
    id: "morning",
    label: "Mañana",
    start_time: "10:00",
    end_time: "18:00",
    display: "10:00 a.m. - 6:00 p.m.",
  },
  night: {
    id: "night",
    label: "Tarde",
    start_time: "19:00",
    end_time: "01:00",
    display: "7:00 p.m. - 1:00 a.m.",
  },
} as const;

export const adminLocations = {
  "sierra-maestra": {
    id: "sierra-maestra",
    name: "Sierra Maestra",
    capacity: 50,
    weekdayPrice: 90,
    weekendPrice: 120,
  },
  "los-cortijos": {
    id: "los-cortijos",
    name: "Los Cortijos",
    capacity: 50,
    weekdayPrice: 70,
    weekendPrice: 100,
  },
} as const;

export function isWeekend(date: string) {
  const day = new Date(`${date}T12:00:00`).getDay();
  return day === 0 || day === 5 || day === 6;
}

export function calculateReservationPrice(locationId: string, date: string) {
  const location = adminLocations[locationId as LocationId];
  if (!location || !date) return 0;

  return isWeekend(date) ? location.weekendPrice : location.weekdayPrice;
}

export function generateReservationCode() {
  const random = Math.floor(1000 + Math.random() * 9000);
  const stamp = Date.now().toString().slice(-4);
  return `PLF-${stamp}${random}`;
}
