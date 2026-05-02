import Link from "next/link";

const anos = [
  {
    titulo: "6º Ano",
    descricao:
      "Projetos interdisciplinares das turmas do 6º ano na Mostra Cultural e de Itinerários Formativos 2026.",
    cor: "#2563eb",
    href: "/segmentos/fundamental-2/6-ano",
    etiqueta: "Ensino Fundamental 2",
  },
  {
    titulo: "7º Ano",
    descricao:
      "Projetos interdisciplinares das turmas do 7º ano na Mostra Cultural e de Itinerários Formativos 2026.",
    cor: "#059669",
    href: "/segmentos/fundamental-2/7-ano",
    etiqueta: "Ensino Fundamental 2",
  },
  {
    titulo: "8º Ano",
    descricao:
      "Projetos interdisciplinares das turmas do 8º ano na Mostra Cultural e de Itinerários Formativos 2026.",
    cor: "#d97706",
    href: "/segmentos/fundamental-2/8-ano",
    etiqueta: "Ensino Fundamental 2",
  },
  {
    titulo: "9º Ano",
    descricao:
      "Projetos interdisciplinares das turmas do 9º ano na Mostra Cultural e de Itinerários Formativos 2026.",
    cor: "#7c3aed",
    href: "/segmentos/fundamental-2/9-ano",
    etiqueta: "Ensino Fundamental 2",
  },
];

export default function Fundamental2Page() {
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
              Mostra Cultural e de Itinerários Formativos 2026
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
              Ensino Fundamental 2
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
              Projetos do 6º ao 9º ano — Socioecologia e Resiliência.
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
              style={{ width: 220, height: "auto", display: "block" }}
            />
          </div>
        </div>
      </header>

      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "44px 64px" }}>
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
            Fundamental 2
          </p>

          <h2 style={{ margin: "10px 0 0", fontSize: 40, fontWeight: 800 }}>
            Turmas da Mostra
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 24,
          }}
        >
          {anos.map((ano) => (
            <div
              key={ano.titulo}
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
                  background: ano.cor,
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
                  textTransform: "uppercase",
                }}
              >
                {ano.etiqueta}
              </p>

              <h3
                style={{
                  margin: "14px 0 12px",
                  fontSize: 36,
                  lineHeight: 1.15,
                  fontWeight: 800,
                }}
              >
                {ano.titulo}
              </h3>

              <p
                style={{
                  fontSize: 17,
                  lineHeight: 1.55,
                  color: "#4b5563",
                  minHeight: 60,
                }}
              >
                {ano.descricao}
              </p>

              <div style={{ marginTop: 24 }}>
                <Link
                  href={ano.href}
                  style={{
                    background: "#173d5c",
                    color: "white",
                    borderRadius: 999,
                    padding: "11px 22px",
                    textDecoration: "none",
                    fontWeight: 800,
                    fontSize: 14,
                    display: "inline-block",
                  }}
                >
                  Ver projetos
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
