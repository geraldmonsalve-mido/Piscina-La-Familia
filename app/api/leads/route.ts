import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const TABLE = "piscina_leads";

function cleanPhone(phone: string) {
  return String(phone || "").replace(/[^\d+]/g, "").trim();
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const fullName = String(body.full_name || body.fullName || "").trim();
    const phone = cleanPhone(String(body.phone || body.whatsapp || ""));
    const email = body.email ? String(body.email).trim() : null;
    const message = String(body.message || "").trim();

    if (!fullName || !phone || !message) {
      return NextResponse.json(
        { ok: false, error: "Nombre, WhatsApp y mensaje son obligatorios." },
        { status: 400 }
      );
    }

    const guests = body.guests ? Number(body.guests) : null;

    const requestType = String(body.request_type || body.requestType || "general");
    const preferredLocation = body.preferred_location || body.location || null;
    const preferredDate = body.preferred_date || body.date || null;
    const preferredTurn = body.preferred_turn || body.turn || null;

    const priority =
      guests && guests >= 40
        ? "high"
        : requestType.includes("evento") || requestType.includes("cumple")
        ? "high"
        : "normal";

    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from(TABLE)
      .insert({
        full_name: fullName,
        phone,
        email,
        request_type: requestType,
        preferred_location: preferredLocation,
        preferred_date: preferredDate,
        preferred_turn: preferredTurn,
        guests,
        message,
        source: body.source || "landing",
        status: "new",
        priority,
      })
      .select("*")
      .single();

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, lead: data });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Error desconocido.",
      },
      { status: 500 }
    );
  }
}
