import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("piscina_reservations")
      .select("id, code, customer_name, created_at")
      .limit(5);

    if (error) {
      return NextResponse.json({
        ok: false,
        table: "public.piscina_reservations",
        error: error.message,
      }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      table: "public.piscina_reservations",
      rows: data || [],
    });
  } catch (error) {
    return NextResponse.json({
      ok: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }, { status: 500 });
  }
}
