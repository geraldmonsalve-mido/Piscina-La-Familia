import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  adminLocations,
  calculateReservationPrice,
  generateReservationCode,
  turns,
  type LocationId,
  type TurnId,
} from "@/lib/reservation-pricing";

const TABLE = "piscina_reservations";

export async function GET() {
  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .order("reservation_date", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message, reservations: [] },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, reservations: data || [] });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Error desconocido",
        reservations: [],
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const locationId = body.location_id as LocationId;
    const turnId = body.turn_id as TurnId;
    const location = adminLocations[locationId];
    const turn = turns[turnId];

    if (!location || !turn) {
      return NextResponse.json(
        { ok: false, error: "Sede o turno inválido." },
        { status: 400 }
      );
    }

    if (!body.reservation_date || !body.customer_name || !body.customer_phone) {
      return NextResponse.json(
        { ok: false, error: "Faltan datos obligatorios." },
        { status: 400 }
      );
    }

    const guests = Number(body.guests || 0);

    if (guests < 1 || guests > 50) {
      return NextResponse.json(
        { ok: false, error: "La reserva debe tener entre 1 y 50 asistentes." },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    const { data: existingReservation, error: existingError } = await supabase
      .from(TABLE)
      .select("id, code, customer_name, status")
      .eq("location_id", location.id)
      .eq("reservation_date", body.reservation_date)
      .eq("turn_id", turn.id)
      .not("status", "in", "(cancelled,no_show)")
      .maybeSingle();

    if (existingError) {
      return NextResponse.json(
        { ok: false, error: existingError.message },
        { status: 500 }
      );
    }

    if (existingReservation) {
      return NextResponse.json(
        {
          ok: false,
          error: `Este turno ya está reservado por ${existingReservation.customer_name} (${existingReservation.code}).`,
        },
        { status: 409 }
      );
    }

    const price = calculateReservationPrice(locationId, body.reservation_date);
    const amountPaid = Number(body.amount_paid || 0);
    const balanceDue = Math.max(price - amountPaid, 0);

    const payload = {
      code: generateReservationCode(),
      customer_name: body.customer_name,
      customer_phone: body.customer_phone,
      customer_email: body.customer_email || null,
      location_id: location.id,
      location_name: location.name,
      reservation_date: body.reservation_date,
      turn_id: turn.id,
      turn_label: turn.display,
      start_time: turn.start_time,
      end_time: turn.end_time,
      guests,
      total_amount: price,
      status: body.status || "pending",
      payment_status: body.payment_status || "unpaid",
      amount_paid: amountPaid,
      balance_due: balanceDue,
      origin: body.origin || "manual",
      internal_notes: body.internal_notes || null,
      customer_notes: body.customer_notes || null,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from(TABLE)
      .insert(payload)
      .select("*")
      .single();

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    if (body.lead_id) {
      await supabase
        .from("piscina_leads")
        .update({
          status: "converted",
          converted_reservation_id: data.id,
          updated_at: new Date().toISOString(),
        })
        .eq("id", body.lead_id);
    }

    return NextResponse.json({ ok: true, reservation: data });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const id = body.id as string;
    const action = body.action as string;

    if (!id || !action) {
      return NextResponse.json(
        { ok: false, error: "Falta id o acción." },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    const { data: current, error: readError } = await supabase
      .from(TABLE)
      .select("*")
      .eq("id", id)
      .single();

    if (readError || !current) {
      return NextResponse.json(
        { ok: false, error: readError?.message || "Reserva no encontrada." },
        { status: 404 }
      );
    }

    let update: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (action === "confirm") {
      update.status = "confirmed";
    }

    if (action === "mark_paid") {
      update.payment_status = "paid";
      update.amount_paid = Number(current.total_amount || 0);
      update.balance_due = 0;
    }

    if (action === "complete") {
      update.status = "completed";
      update.payment_status = "paid";
      update.amount_paid = Number(current.total_amount || 0);
      update.balance_due = 0;
    }

    if (action === "cancel") {
      update.status = "cancelled";
    }

    const { data, error } = await supabase
      .from(TABLE)
      .update(update)
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    if (body.lead_id) {
      await supabase
        .from("piscina_leads")
        .update({
          status: "converted",
          converted_reservation_id: data.id,
          updated_at: new Date().toISOString(),
        })
        .eq("id", body.lead_id);
    }

    return NextResponse.json({ ok: true, reservation: data });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 }
    );
  }
}
