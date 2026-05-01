import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

type PageProps = {
  searchParams: Promise<{
    eixo?: string;
    serie?: string;
  }>;
};

function obterEixo(sigla: string) {
  if (sigla.startsWith("EMA")) return "EMA";
  if (sigla.startsWith("ECC")) return "ECC";
  if (sigla.startsWith("CS")) return "CS";
  return "";
}

function obterSerie(sigla: string) {
  if (sigla.endsWith("1")) return "1º ano";
  if (sigla.endsWith("2")) return "2º ano";
  if (sigla.endsWith("3")) return "3º ano";
  return "";
}

export default async function EnsinoMedioPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const filtroEixo = params.eixo;
  const filtroSerie = params.serie;

  const { data: itinerarios, error } = await supabase
    .from("itinerarios")
    .select("*")
    .eq("ativo", true)
    .order("sigla", { ascending: true });

  if (error) {
    return <main style={{ padding: 40 }}>Erro: {error.message}</main>;
  }

  const filtrados = itinerarios?.filter((item) => {
    const eixo = obterEixo(item.sigla);
    const serie = obterSerie(item.sigla);

    return (!filtroEixo || eixo === filtroEixo) && (!filtroSerie || serie === filtroSerie);
  });

  return (
    <main style={{ minHeight: "100vh", background: "#f7f4ef", color: "#172033" }}>
      <header
        style={{
          background: "#d8ecf7",
          borderBottom: "1px solid #d8c7a1",
          padding: "42px 64px",
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 40,
          }}
        >
          <div>
            <Link
              href="/"
              style={{
                color: "#173d5c",
                textDecoration: "none",
                fontWeight: 700,
              }}
            >
              ← Voltar para a página inicial
            </Link>

            <p
              style={{
                margin: "34px 0 0",
                color: "#a6782a",
                fontSize: 14,
                fontWeight: 800,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
              }}
            >
              Mostra Cultural 2026
            </p>

            <h1
              style={{
                margin: "12px 0 0",
                fontSize: 58,
                lineHeight: 1,
                fontWeight: 800,
                color: "#111827",
              }}
            >
              Ensino Médio
            </h1>

            <p
              style={{
                margin: "20px 0 0",
                maxWidth: 780,
                fontSize: 21,
                lineHeight: 1.5,
                color: "#111827",
              }}
            >
              Itinerários Formativos da Mostra Cultural 2026.
            </p>
          </div>

          <div
            style={{
              background: "white",
              borderRadius: 20,
              padding: 14,
              boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
              flexShrink: 0,
            }}
          >
            <img
              src="/logo-benjamin.png"
              alt="Logo do Colégio Benjamin Constant"
              style={{
                width: 220,
                height: "auto",
                display: "block",
              }}
            />
          </div>
        </div>
      </header>

      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "44px 64px" }}>
        <div
          style={{
            background: "white",
            border: "1px solid #d8c7a1",
            borderRadius: 28,
            padding: 32,
            boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
            marginBottom: 38,
          }}
        >
          <p
            style={{
              margin: 0,
              color: "#a6782a",
              fontSize: 14,
              fontWeight: 800,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
            }}
          >
            Filtros
          </p>

          <h2 style={{ margin: "12px 0 22px", fontSize: 32, fontWeight: 800 }}>
            Encontre os itinerários por eixo ou ano
          </h2>

          <div style={{ marginBottom: 24 }}>
            <h3 style={{ marginBottom: 12, fontSize: 20, fontWeight: 800 }}>
              Filtrar por itinerário
            </h3>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              <Filtro href="/segmentos/ensino-medio" label="Todos" />
              <Filtro href="/segmentos/ensino-medio?eixo=EMA" label="EMA" />
              <Filtro href="/segmentos/ensino-medio?eixo=ECC" label="ECC" />
              <Filtro href="/segmentos/ensino-medio?eixo=CS" label="CS" />
            </div>
          </div>

          <div>
            <h3 style={{ marginBottom: 12, fontSize: 20, fontWeight: 800 }}>
              Filtrar por ano
            </h3>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              <Filtro href="/segmentos/ensino-medio" label="Todos os anos" />
              <Filtro href="/segmentos/ensino-medio?serie=1º ano" label="1º ano" />
              <Filtro href="/segmentos/ensino-medio?serie=2º ano" label="2º ano" />
              <Filtro href="/segmentos/ensino-medio?serie=3º ano" label="3º ano" />
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 26 }}>
          <p
            style={{
              margin: 0,
              color: "#a6782a",
              fontSize: 14,
              fontWeight: 800,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
            }}
          >
            Ensino Médio
          </p>

          <h2 style={{ margin: "10px 0 0", fontSize: 40, fontWeight: 800 }}>
            Itinerários da Mostra
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 24,
          }}
        >
          {filtrados?.map((item) => (
            <div
              key={item.id}
              style={{
                background: "white",
                border: "1px solid #d8c7a1",
                borderRadius: 28,
                padding: 28,
                boxShadow: "0 8px 22px rgba(0,0,0,0.06)",
              }}
            >
              <div
                style={{
                  height: 8,
                  borderRadius: 999,
                  background: item.cor_hex || "#173d5c",
                  marginBottom: 22,
                }}
              />

              <p
                style={{
                  margin: 0,
                  color: "#a6782a",
                  fontSize: 14,
                  fontWeight: 800,
                  letterSpacing: "0.2em",
                }}
              >
                {item.sigla}
              </p>

              <h3
                style={{
                  margin: "14px 0 12px",
                  fontSize: 28,
                  lineHeight: 1.15,
                  fontWeight: 800,
                }}
              >
                {item.nome}
              </h3>

              <p
                style={{
                  minHeight: 110,
                  fontSize: 17,
                  lineHeight: 1.55,
                  color: "#4b5563",
                }}
              >
                {item.descricao}
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 24 }}>
                <Link
                  href={`/itinerarios/${item.sigla}`}
                  style={{
                    background: "#173d5c",
                    color: "white",
                    borderRadius: 999,
                    padding: "11px 18px",
                    textDecoration: "none",
                    fontWeight: 800,
                    fontSize: 14,
                  }}
                >
                  Ver projetos
                </Link>

                <Link
                  href={`/dashboard/itinerarios/${item.id}/editar`}
                  style={{
                    border: "1px solid #173d5c",
                    color: "#173d5c",
                    borderRadius: 999,
                    padding: "10px 18px",
                    textDecoration: "none",
                    fontWeight: 800,
                    fontSize: 14,
                  }}
                >
                  Editar
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

function Filtro({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      style={{
        display: "inline-block",
        border: "1px solid #173d5c",
        color: "#173d5c",
        borderRadius: 999,
        padding: "10px 18px",
        textDecoration: "none",
        fontWeight: 700,
        background: "white",
      }}
    >
      {label}
    </Link>
  );
}