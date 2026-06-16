import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function reservationCode() {
  return `PLF-${Date.now().toString(36).toUpperCase().slice(-6)}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`;
}

export async function POST(request: Request) {
  const body = await request.json();
  const code = reservationCode();

  const locationId = body.location?.id;
  const reservationTypeId = body.reservationType?.id;
  const timeBlockId = body.timeBlock?.id;
  const requiresQuote = Boolean(body.reservationType?.requires_quote);

  if (!locationId || !reservationTypeId || !body.date) {
    return NextResponse.json({ error: "Faltan datos obligatorios de la reserva" }, { status: 400 });
  }

  const supabase = await createClient();

  if (requiresQuote || !timeBlockId) {
    const { error } = await supabase.from("quote_requests").insert({
      location_id: locationId,
      reservation_type_id: reservationTypeId,
      name: body.guestName || "Cliente sin nombre",
      email: body.guestEmail || "sin-email@piscinalafamilia.local",
      phone: body.guestPhone || "Sin teléfono",
      event_date: body.date || null,
      num_guests: Number(body.numAdults ?? 0) + Number(body.numChildren ?? 0),
      event_details: body.notes || null,
      status: "pending",
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ code, quote: true });
  }

  const { data: existing } = await supabase
    .from("reservations")
    .select("id")
    .eq("location_id", locationId)
    .eq("time_block_id", timeBlockId)
    .eq("reservation_date", body.date)
    .in("status", ["pending", "confirmed"])
    .limit(1);

  if (existing && existing.length > 0) {
    return NextResponse.json({ error: "Ese bloque horario ya tiene una reserva en proceso." }, { status: 409 });
  }

  const { error } = await supabase.from("reservations").insert({
    location_id: locationId,
    reservation_type_id: reservationTypeId,
    time_block_id: timeBlockId,
    reservation_date: body.date,
    num_adults: Number(body.numAdults ?? 1),
    num_children: Number(body.numChildren ?? 0),
    total_price: Number(body.timeBlock?.price ?? body.reservationType?.price_base ?? 0),
    status: "pending",
    notes: [body.notes, `Contacto: ${body.guestName || ""} / ${body.guestPhone || ""} / ${body.guestEmail || ""}`]
      .filter(Boolean)
      .join("\n"),
    qr_code: code,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ code, quote: false });
}
