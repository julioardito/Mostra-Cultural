import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import KanbanBoard from "@/app/components/kanban/KanbanBoard";

type Props = { params: Promise<{ sigla: string }> };

export default async function KanbanPage({ params }: Props) {
  const { sigla } = await params;

  const { data: itinerario } = await supabase
    .from("itinerarios")
    .select("nome, cor_hex")
    .eq("sigla", sigla)
    .single();

  return (
    <main style={{ minHeight: "100vh", background: "#f7f4ef", color: "#172033" }}>
      <header
        className="page-header"
        style={{ background: "#d8ecf7", borderBottom: "1px solid #d8c7a1" }}
      >
        <div style={{ maxWidth: 1800, margin: "0 auto" }}>
          <Link
            href={`/itinerarios/${sigla}`}
            style={{ color: "#173d5c", fontWeight: 700, textDecoration: "none" }}
          >
            ← Voltar para {sigla}
          </Link>

          <p
            style={{
              margin: "20px 0 0",
              color: "#a6782a",
              fontSize: 13,
              fontWeight: 800,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
            }}
          >
            {sigla} · Mostra Cultural e de Itinerários Formativos 2026
          </p>

          <h1
            style={{
              margin: "10px 0 0",
              fontSize: 32,
              fontWeight: 800,
              color: "#111827",
              lineHeight: 1.1,
            }}
          >
            Quadro Kanban
          </h1>

          {itinerario?.nome && (
            <p style={{ margin: "8px 0 0", color: "#4b5563", fontSize: 16 }}>
              {itinerario.nome}
            </p>
          )}
        </div>
      </header>

      <div style={{ padding: "24px 16px", maxWidth: 1800, margin: "0 auto" }}>
        <KanbanBoard sigla={sigla} />
      </div>
    </main>
  );
}
