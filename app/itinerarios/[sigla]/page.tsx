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
      <section
        style={{
          background: "#1f4e73",
          color: "white",
          padding: "48px 64px",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 40,
          }}
        >
          <div style={{ maxWidth: 650 }}>
            <Link
              href="/segmentos/ensino-medio"
              style={{
                color: "white",
                textDecoration: "none",
                border: "1px solid rgba(255,255,255,0.45)",
                borderRadius: 999,
                padding: "8px 16px",
                fontSize: 14,
                display: "inline-block",
                marginBottom: 32,
              }}
            >
              ← Voltar para Ensino Médio
            </Link>

            <p
              style={{
                color: "#f4d28c",
                fontWeight: 700,
                letterSpacing: "0.25em",
                fontSize: 14,
                marginBottom: 12,
              }}
            >
              {itinerario.sigla}
            </p>

            <h1
              style={{
                color: "white",
                fontSize: 48,
                lineHeight: 1.08,
                fontWeight: 800,
                margin: 0,
              }}
            >
              {itinerario.nome}
            </h1>

            <div
              style={{
                width: 120,
                height: 4,
                background: "#f4d28c",
                borderRadius: 999,
                marginTop: 22,
                marginBottom: 22,
              }}
            />

            <p
              style={{
                color: "#e8eef5",
                fontSize: 20,
                lineHeight: 1.5,
                margin: 0,
              }}
            >
              Mostra Cultural e de Itinerários Formativos 2026 · Socioecologia e Resiliência
            </p>
          </div>

          <div
            style={{
              background: "white",
              borderRadius: 18,
              padding: 16,
              boxShadow: "0 12px 30px rgba(0,0,0,0.18)",
              width: 230,
              height: 110,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <img
              src="/logo-benjamin.png"
              alt="Logo do Colégio Benjamin Constant"
              style={{
                maxWidth: 200,
                maxHeight: 80,
                width: "auto",
                height: "auto",
                display: "block",
                objectFit: "contain",
              }}
            />
          </div>
        </div>
      </section>

      <section style={{ padding: "40px 64px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div
            style={{
              background: "white",
              border: "1px solid #d8c7a1",
              borderRadius: 24,
              padding: 32,
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              marginBottom: 32,
            }}
          >
            <p
              style={{
                color: "#a6782a",
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                fontWeight: 800,
                fontSize: 14,
                margin: 0,
              }}
            >
              Colégio Benjamin Constant
            </p>

            <h2
              style={{
                fontSize: 40,
                margin: "14px 0 10px",
                color: "#172033",
              }}
            >
              Informações do Itinerário
            </h2>

            <p style={{ fontSize: 18, color: "#4b5563", margin: 0 }}>
              Página de organização, comunicação e orientação dos espaços da
              Mostra Cultural e de Itinerários Formativos 2026.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: 24,
            }}
          >
            <Card titulo="Professores Responsáveis" etiqueta="Equipe">
              {itinerario.professores_responsaveis || "A definir"}
            </Card>

            <Card titulo="Localização" etiqueta="Espaço">
              {itinerario.localizacao || "A definir"}
            </Card>

            <div
              style={{
                gridColumn: "1 / -1",
                background: "white",
                border: "1px solid #d8c7a1",
                borderRadius: 24,
                padding: 32,
              }}
            >
              <p style={labelStyle}>Proposta</p>
              <h2 style={cardTitleStyle}>
                Descrição do Projeto na Mostra Cultural e de Itinerários Formativos 2026
              </h2>
              <p style={{ fontSize: 18, lineHeight: 1.7, color: "#374151" }}>
                {itinerario.descricao_mostra || itinerario.descricao}
              </p>
            </div>

            <div
              style={{
                gridColumn: "1 / -1",
                background: "white",
                border: "1px solid #d8c7a1",
                borderRadius: 24,
                padding: 32,
              }}
            >
              <p style={labelStyle}>Mapa</p>
              <h2 style={cardTitleStyle}>Área da Escola</h2>

              {itinerario.mapa_url ? (
                <div
                  style={{
                    background: "#f7f4ef",
                    padding: 24,
                    borderRadius: 18,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src={itinerario.mapa_url}
                    alt={`Mapa de localização do itinerário ${itinerario.sigla}`}
                    style={{
                      width: "30%",
                      maxWidth: 420,
                      height: "auto",
                      borderRadius: 12,
                      border: "1px solid #ddd",
                      background: "white",
                    }}
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
    <div
      style={{
        background: "white",
        border: "1px solid #d8c7a1",
        borderRadius: 24,
        padding: 32,
      }}
    >
      <p style={labelStyle}>{etiqueta}</p>
      <h2 style={cardTitleStyle}>{titulo}</h2>
      <p style={{ fontSize: 18, lineHeight: 1.6, color: "#374151" }}>
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
  fontSize: 13,
  margin: "0 0 8px",
};

const cardTitleStyle = {
  fontSize: 26,
  color: "#172033",
  margin: "0 0 16px",
  fontWeight: 800,
};