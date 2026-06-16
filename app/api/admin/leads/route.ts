import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const TABLE = "piscina_leads";

export async function GET() {
  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message, leads: [] },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, leads: data || [] });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Error desconocido.",
        leads: [],
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();

    if (!body.id || !body.status) {
      return NextResponse.json(
        { ok: false, error: "Falta id o estado." },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from(TABLE)
      .update({
        status: body.status,
        admin_notes: body.admin_notes ?? undefined,
        converted_reservation_id: body.converted_reservation_id ?? undefined,
        updated_at: new Date().toISOString(),
      })
      .eq("id", body.id)
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
