import LeadInbox from "@/components/admin/LeadInbox";
import { createAdminClient } from "@/lib/supabase/admin";

type Lead = {
  id: string;
  full_name: string;
  phone: string;
  email?: string | null;
  request_type: string;
  preferred_location?: string | null;
  preferred_date?: string | null;
  preferred_turn?: string | null;
  guests?: number | null;
  message: string;
  source: string;
  status: string;
  priority: string;
  admin_notes?: string | null;
  created_at: string;
};

async function getLeads(): Promise<{ leads: Lead[]; error?: string }> {
  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("piscina_leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return { leads: [], error: error.message };

    return { leads: (data || []) as Lead[] };
  } catch (error) {
    return {
      leads: [],
      error: error instanceof Error ? error.message : "No se pudo conectar con Supabase.",
    };
  }
}

export default async function AdminSolicitudesPage() {
  const { leads, error } = await getLeads();

  const pendingCount = leads.filter((lead) => lead.status === "new").length;
  const highPriorityCount = leads.filter((lead) => lead.priority === "high").length;

  return (
    <main className="min-h-screen bg-[#eef9ff] p-4">
      <div className="mx-auto grid max-w-[1440px] gap-4">
        <header className="relative overflow-hidden rounded-[1.35rem] bg-slate-950 px-6 py-5 text-white shadow-xl shadow-cyan-950/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(34,211,238,0.28),transparent_30%),radial-gradient(circle_at_88%_0%,rgba(45,212,191,0.22),transparent_28%)]" />

          <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-cyan-200">
                Solicitudes
              </p>
              <h1 className="mt-1 text-3xl font-black tracking-tight">
                Bandeja comercial
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-cyan-50/72">
                Lista de mensajes del landing y panel individual para responder, clasificar o convertir en reserva.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-2xl bg-white/10 px-4 py-3">
                <p className="text-2xl font-black">{leads.length}</p>
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-cyan-100/70">
                  Total
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 px-4 py-3">
                <p className="text-2xl font-black">{pendingCount}</p>
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-cyan-100/70">
                  Nuevas
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 px-4 py-3">
                <p className="text-2xl font-black">{highPriorityCount}</p>
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-cyan-100/70">
                  Prioridad
                </p>
              </div>
            </div>
          </div>
        </header>

        {error && (
          <div className="rounded-2xl bg-rose-100 p-4 text-sm font-black text-rose-800">
            Error Supabase: {error}
          </div>
        )}

        <LeadInbox leads={leads} />
      </div>
    </main>
  );
}
