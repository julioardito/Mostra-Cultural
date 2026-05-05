import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

type Props = {
  params: Promise<{ sigla: string }>;
};

export default async function ItinerarioPage({ params }: Props) {
  const { sigla } = await params;

  const { data: itinerario, error } = await supabase
    .from("itinerarios")
    .select("*")
    .eq("sigla", sigla)
    .single();

  if (error || !itinerario) {
    return <main style={{ padding: 40 }}>Itinerário não encontrado.</main>;
  }

  return (
    <main style={{ minHeight: "100vh", background: "#f7f4ef", color: "#172033" }}>
      {/* Dark header */}
      <header
        className="page-header"
        style={{ background: "#d8ecf7", borderBottom: "1px solid #d8c7a1" }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 24,
          }}
        >
          <div style={{ maxWidth: 650 }}>
            <Link
              href="/segmentos/ensino-medio"
              style={{
                color: "#173d5c",
                textDecoration: "none",
                fontWeight: 700,
              }}
            >
              ← Voltar para Ensino Médio
            </Link>

            <p
              style={{
                color: "#a6782a",
                fontWeight: 800,
                letterSpacing: "0.25em",
                fontSize: 13,
                margin: "24px 0 10px",
                textTransform: "uppercase",
              }}
            >
              {itinerario.sigla}
            </p>

            <h1
              className="text-2xl sm:text-5xl"
              style={{ color: "#111827", lineHeight: 1.08, fontWeight: 800, margin: 0 }}
            >
              {itinerario.nome}
            </h1>

            <div
              style={{
                width: 100,
                height: 4,
                background: itinerario.cor_hex || "#173d5c",
                borderRadius: 999,
                marginTop: 18,
                marginBottom: 18,
              }}
            />

            <p
              className="text-sm sm:text-lg"
              style={{ color: "#4b5563", lineHeight: 1.5, margin: 0 }}
            >
              Mostra Cultural e de Itinerários Formativos 2026 · Socioecologia e Resiliência
            </p>
          </div>

          <div
            className="hidden sm:block"
            style={{
              background: "white",
              borderRadius: 18,
              padding: 14,
              boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
              flexShrink: 0,
            }}
          >
            <img
              src="/logo-benjamin.png"
              alt="Logo do Colégio Benjamin Constant"
              style={{ width: 200, height: "auto", display: "block" }}
            />
          </div>
        </div>
      </header>

      {/* Content */}
      <section className="page-section">
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div
            style={{
              background: "white",
              border: "1px solid #d8c7a1",
              borderRadius: 22,
              padding: "20px 22px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              marginBottom: 24,
            }}
          >
            <p style={{ color: "#a6782a", textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 800, fontSize: 13, margin: 0 }}>
              Colégio Benjamin Constant
            </p>
            <h2 className="text-2xl sm:text-4xl" style={{ margin: "12px 0 8px", color: "#172033", fontWeight: 800 }}>
              Informações do Itinerário
            </h2>
            <p className="text-sm sm:text-lg" style={{ color: "#4b5563", margin: 0 }}>
              Página de organização, comunicação e orientação dos espaços da
              Mostra Cultural e de Itinerários Formativos 2026.
            </p>
          </div>

          {/* Cards grid: 1 col mobile, 2 cols desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <Card titulo="Professores Responsáveis" etiqueta="Equipe">
              {itinerario.professores_responsaveis || "A definir"}
            </Card>

            <Card titulo="Localização" etiqueta="Espaço">
              {itinerario.localizacao || "A definir"}
            </Card>

            <div
              className="sm:col-span-2"
              style={{ background: "white", border: "1px solid #d8c7a1", borderRadius: 22, padding: "20px 22px" }}
            >
              <p style={labelStyle}>Proposta</p>
              <h2 className="text-xl sm:text-2xl" style={cardTitleStyle}>
                Descrição do Projeto na Mostra Cultural e de Itinerários Formativos 2026
              </h2>
              <p className="text-sm sm:text-lg" style={{ lineHeight: 1.7, color: "#374151" }}>
                {itinerario.descricao_mostra || itinerario.descricao}
              </p>
            </div>

            <div
              className="sm:col-span-2"
              style={{ background: "white", border: "1px solid #d8c7a1", borderRadius: 22, padding: "20px 22px" }}
            >
              <p style={labelStyle}>Mapa</p>
              <h2 className="text-xl sm:text-2xl" style={cardTitleStyle}>Área da Escola</h2>

              {itinerario.mapa_url ? (
                <div style={{ background: "#f7f4ef", padding: 20, borderRadius: 16, display: "flex", justifyContent: "center" }}>
                  <img
                    src={itinerario.mapa_url}
                    alt={`Mapa de localização do itinerário ${itinerario.sigla}`}
                    style={{ width: "80%", maxWidth: 420, height: "auto", borderRadius: 12, border: "1px solid #ddd", background: "white" }}
                  />
                </div>
              ) : (
                <p>Nenhum mapa cadastrado ainda.</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Card({
  etiqueta,
  titulo,
  children,
}: {
  etiqueta: string;
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ background: "white", border: "1px solid #d8c7a1", borderRadius: 22, padding: "20px 22px" }}>
      <p style={labelStyle}>{etiqueta}</p>
      <h2 className="text-xl sm:text-2xl" style={cardTitleStyle}>{titulo}</h2>
      <p className="text-sm sm:text-base" style={{ lineHeight: 1.6, color: "#374151" }}>
        {children}
      </p>
    </div>
  );
}

const labelStyle = {
  color: "#a6782a",
  textTransform: "uppercase" as const,
  letterSpacing: "0.18em",
  fontWeight: 800,
  fontSize: 12,
  margin: "0 0 8px",
};

const cardTitleStyle = {
  color: "#172033",
  margin: "0 0 14px",
  fontWeight: 800,
};
