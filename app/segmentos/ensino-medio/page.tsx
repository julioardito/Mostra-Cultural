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
        className="page-header"
        style={{ background: "#d8ecf7", borderBottom: "1px solid #d8c7a1" }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 24,
          }}
        >
          <div>
            <Link href="/" style={{ color: "#173d5c", textDecoration: "none", fontWeight: 700 }}>
              ← Voltar para a página inicial
            </Link>

            <p
              style={{
                margin: "24px 0 0",
                color: "#a6782a",
                fontSize: 13,
                fontWeight: 800,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
              }}
            >
              Mostra Cultural e de Itinerários Formativos 2026
            </p>

            <h1
              className="text-3xl sm:text-5xl"
              style={{ margin: "10px 0 0", lineHeight: 1.05, fontWeight: 800, color: "#111827" }}
            >
              Ensino Médio
            </h1>

            <p
              className="text-base sm:text-lg"
              style={{ margin: "12px 0 0", maxWidth: 780, lineHeight: 1.5, color: "#111827" }}
            >
              Itinerários Formativos da Mostra Cultural e de Itinerários Formativos 2026.
            </p>
          </div>

          <div
            className="hidden sm:block"
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
              style={{ width: 200, height: "auto", display: "block" }}
            />
          </div>
        </div>
      </header>

      <section className="page-section" style={{ maxWidth: 1280, margin: "0 auto" }}>
        {/* Filter panel */}
        <div
          style={{
            background: "white",
            border: "1px solid #d8c7a1",
            borderRadius: 24,
            padding: "20px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
            marginBottom: 28,
          }}
        >
          <p
            style={{
              margin: 0,
              color: "#a6782a",
              fontSize: 13,
              fontWeight: 800,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
            }}
          >
            Filtros
          </p>

          <h2
            className="text-xl sm:text-3xl"
            style={{ margin: "10px 0 18px", fontWeight: 800 }}
          >
            Encontre os itinerários por eixo ou ano
          </h2>

          <div style={{ marginBottom: 18 }}>
            <h3 style={{ marginBottom: 10, fontSize: 16, fontWeight: 800 }}>
              Filtrar por itinerário
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              <Filtro href="/segmentos/ensino-medio" label="Todos" />
              <Filtro href="/segmentos/ensino-medio?eixo=EMA" label="EMA" />
              <Filtro href="/segmentos/ensino-medio?eixo=ECC" label="ECC" />
              <Filtro href="/segmentos/ensino-medio?eixo=CS" label="CS" />
            </div>
          </div>

          <div>
            <h3 style={{ marginBottom: 10, fontSize: 16, fontWeight: 800 }}>
              Filtrar por ano
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              <Filtro href="/segmentos/ensino-medio" label="Todos os anos" />
              <Filtro href="/segmentos/ensino-medio?serie=1º ano" label="1º ano" />
              <Filtro href="/segmentos/ensino-medio?serie=2º ano" label="2º ano" />
              <Filtro href="/segmentos/ensino-medio?serie=3º ano" label="3º ano" />
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <p
            style={{
              margin: 0,
              color: "#a6782a",
              fontSize: 13,
              fontWeight: 800,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
            }}
          >
            Ensino Médio
          </p>
          <h2
            className="text-2xl sm:text-4xl"
            style={{ margin: "8px 0 0", fontWeight: 800 }}
          >
            Itinerários da Mostra
          </h2>
        </div>

        {/* Grid: 1 col mobile, 2 cols tablet, 3 cols desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filtrados?.map((item) => (
            <div key={item.id}>

              {/* ── MOBILE: compact card (sigla only) ── */}
              <Link
                href={`/itinerarios/${item.sigla}`}
                className="flex items-center gap-3 sm:hidden"
                style={{
                  background: "white",
                  border: "1px solid #d8c7a1",
                  borderRadius: 18,
                  padding: "14px 18px",
                  textDecoration: "none",
                }}
              >
                <div
                  style={{
                    width: 5,
                    height: 44,
                    borderRadius: 999,
                    background: item.cor_hex || "#173d5c",
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{ fontWeight: 800, fontSize: 20, color: "#172033", flex: 1 }}
                >
                  {item.sigla}
                </span>
                <span style={{ color: "#a6782a", fontWeight: 700, fontSize: 14 }}>
                  Ver →
                </span>
              </Link>

              {/* ── DESKTOP: full card ── */}
              <div
                className="hidden sm:block"
                style={{
                  background: "white",
                  border: "1px solid #d8c7a1",
                  borderRadius: 24,
                  padding: 24,
                  boxShadow: "0 8px 22px rgba(0,0,0,0.06)",
                  height: "100%",
                }}
              >
                <div
                  style={{
                    height: 7,
                    borderRadius: 999,
                    background: item.cor_hex || "#173d5c",
                    marginBottom: 18,
                  }}
                />

                <p
                  style={{
                    margin: 0,
                    color: "#a6782a",
                    fontSize: 13,
                    fontWeight: 800,
                    letterSpacing: "0.2em",
                  }}
                >
                  {item.sigla}
                </p>

                <h3
                  style={{
                    margin: "12px 0 10px",
                    fontSize: 22,
                    lineHeight: 1.2,
                    fontWeight: 800,
                  }}
                >
                  {item.nome}
                </h3>

                <p
                  style={{
                    fontSize: 15,
                    lineHeight: 1.55,
                    color: "#4b5563",
                    minHeight: 80,
                  }}
                >
                  {item.descricao}
                </p>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 20 }}>
                  <Link
                    href={`/itinerarios/${item.sigla}`}
                    style={{
                      background: "#173d5c",
                      color: "white",
                      borderRadius: 999,
                      padding: "10px 16px",
                      textDecoration: "none",
                      fontWeight: 800,
                      fontSize: 13,
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
                      padding: "9px 16px",
                      textDecoration: "none",
                      fontWeight: 800,
                      fontSize: 13,
                    }}
                  >
                    Editar
                  </Link>
                </div>
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
        padding: "8px 14px",
        textDecoration: "none",
        fontWeight: 700,
        fontSize: 14,
        background: "white",
      }}
    >
      {label}
    </Link>
  );
}
