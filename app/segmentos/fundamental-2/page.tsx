import Link from "next/link";

const anos = [
  { num: "6", titulo: "6º Ano", cor: "#2563eb", turmas: ["A", "B"] },
  { num: "7", titulo: "7º Ano", cor: "#059669", turmas: ["A", "B", "C"] },
  { num: "8", titulo: "8º Ano", cor: "#d97706", turmas: ["A", "B", "C", "D"] },
  { num: "9", titulo: "9º Ano", cor: "#7c3aed", turmas: ["A", "B", "C", "D"] },
];

export default function FundamentalAnosFinaisPage() {
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
              Ensino Fundamental (Anos Finais)
            </h1>

            <p
              className="text-base sm:text-lg"
              style={{ margin: "12px 0 0", maxWidth: 780, lineHeight: 1.5, color: "#111827" }}
            >
              Projetos do 6º ao 9º ano — Socioecologia e Resiliência.
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
            Ensino Fundamental — Anos Finais
          </p>
          <h2 className="text-2xl sm:text-4xl" style={{ margin: "8px 0 0", fontWeight: 800 }}>
            Turmas da Mostra
          </h2>
        </div>

        {/* Card IA — largura total */}
        <Link
          href="/segmentos/fundamental-2/desenvolvedor-projetos"
          style={{
            display: "block",
            background: "#173d5c",
            color: "white",
            borderRadius: 24,
            padding: "22px 26px",
            textDecoration: "none",
            boxShadow: "0 10px 24px rgba(0,0,0,0.14)",
            marginBottom: 24,
          }}
        >
          <p style={{ margin: 0, color: "#f4d28c", fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", fontSize: 12 }}>
            IA Pedagógica
          </p>
          <h2 style={{ margin: "12px 0 0", fontSize: 26, fontWeight: 800, color: "white" }}>
            Desenvolvedor de Projetos
          </h2>
          <p style={{ marginTop: 10, lineHeight: 1.5, color: "#d8ecf7", fontSize: 15 }}>
            Assistente inteligente para criar propostas pedagógicas, planos de aula e roteiros para a Mostra Cultural.
          </p>
        </Link>

        {/* 1 col mobile, 2 cols desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {anos.map((ano) => (
            <div
              key={ano.titulo}
              style={{
                background: "white",
                border: "1px solid #d8c7a1",
                borderRadius: 24,
                padding: "20px 22px",
                boxShadow: "0 8px 22px rgba(0,0,0,0.06)",
              }}
            >
              <div
                style={{
                  height: 6,
                  borderRadius: 999,
                  background: ano.cor,
                  marginBottom: 16,
                }}
              />

              <p
                style={{
                  margin: 0,
                  color: "#a6782a",
                  fontSize: 12,
                  fontWeight: 800,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                }}
              >
                Ensino Fundamental — Anos Finais
              </p>

              <h3
                className="text-3xl sm:text-4xl"
                style={{ margin: "10px 0 8px", lineHeight: 1.1, fontWeight: 800 }}
              >
                {ano.titulo}
              </h3>

              <p style={{ fontSize: 14, lineHeight: 1.5, color: "#6b7280", margin: "0 0 16px" }}>
                Selecione a turma para acessar a Área do Aluno.
              </p>

              {/* Botões de turma */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {ano.turmas.map((letra) => (
                  <Link
                    key={letra}
                    href={`/segmentos/fundamental-2/${ano.num}-ano/${letra.toLowerCase()}`}
                    style={{
                      background: ano.cor,
                      color: "white",
                      borderRadius: 999,
                      padding: "10px 22px",
                      textDecoration: "none",
                      fontWeight: 800,
                      fontSize: 15,
                      display: "inline-block",
                    }}
                  >
                    {ano.num}º{letra}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Mapa */}
        <div
          style={{
            marginTop: 28,
            background: "white",
            border: "1px solid #d8c7a1",
            borderRadius: 24,
            padding: "24px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
          }}
        >
          <p
            style={{
              margin: "0 0 4px",
              color: "#a6782a",
              fontSize: 13,
              fontWeight: 800,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
            }}
          >
            Espaço
          </p>
          <h2 className="text-2xl sm:text-3xl" style={{ margin: "0 0 20px", fontWeight: 800 }}>
            Mapa do Ensino Fundamental (Anos Finais)
          </h2>
          <div style={{ background: "#f7f4ef", borderRadius: 16, padding: "16px", display: "flex", justifyContent: "center" }}>
            <img
              src="/fund2.png"
              alt="Mapa do espaço do Ensino Fundamental Anos Finais na Mostra Cultural"
              style={{ width: "100%", maxWidth: 860, height: "auto", borderRadius: 12, border: "1px solid #d8c7a1" }}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
