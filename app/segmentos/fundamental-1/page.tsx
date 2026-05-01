import Link from "next/link";

export default function Fundamental1Page() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f7f4ef",
        color: "#172033",
      }}
    >
      <header
        style={{
          background: "#d8ecf7",
          borderBottom: "1px solid #d8c7a1",
          padding: "40px 64px",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 32,
          }}
        >
          <div>
            <Link
              href="/"
              style={{
                color: "#173d5c",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              ← Voltar para a página inicial
            </Link>

            <p
              style={{
                marginTop: 32,
                color: "#a6782a",
                fontWeight: 800,
                letterSpacing: "0.25em",
                textTransform: "uppercase",
              }}
            >
              Mostra Cultural 2026
            </p>

            <h1 style={{ fontSize: 56, margin: "12px 0 0", fontWeight: 800 }}>
              Ensino Fundamental 1
            </h1>

            <p style={{ fontSize: 21, maxWidth: 780, lineHeight: 1.5 }}>
              Espaço dedicado aos projetos do 1º ao 5º ano na Mostra Cultural.
            </p>
          </div>

          <div
            style={{
              background: "white",
              borderRadius: 20,
              padding: 14,
              boxShadow: "0 10px 24px rgba(0,0,0,0.12)",
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

      <section
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "48px 32px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 24,
          }}
        >
          <AnoCard href="/segmentos/fundamental-1/1-ano" titulo="1º Ano" />
          <AnoCard href="/segmentos/fundamental-1/2-ano" titulo="2º Ano" />
          <AnoCard href="/segmentos/fundamental-1/3-ano" titulo="3º Ano" />
          <AnoCard href="/segmentos/fundamental-1/4-ano" titulo="4º Ano" />
          <AnoCard href="/segmentos/fundamental-1/5-ano" titulo="5º Ano" />

          <Link
            href="/segmentos/fundamental-1/desenvolvedor-projetos"
            style={{
              display: "block",
              background: "#173d5c",
              color: "white",
              borderRadius: 28,
              padding: 30,
              textDecoration: "none",
              boxShadow: "0 10px 24px rgba(0,0,0,0.14)",
            }}
          >
            <p
              style={{
                margin: 0,
                color: "#f4d28c",
                fontWeight: 800,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                fontSize: 13,
              }}
            >
              IA Pedagógica
            </p>

            <h2 style={{ margin: "16px 0 0", fontSize: 30 }}>
              Desenvolvedor de Projetos
            </h2>

            <p style={{ marginTop: 14, lineHeight: 1.5 }}>
              Assistente para criar propostas pedagógicas da Mostra Cultural.
            </p>
          </Link>
        </div>
      </section>
    </main>
  );
}

function AnoCard({ href, titulo }: { href: string; titulo: string }) {
  return (
    <Link
      href={href}
      style={{
        display: "block",
        background: "white",
        color: "#172033",
        border: "1px solid #d8c7a1",
        borderRadius: 28,
        padding: 30,
        textDecoration: "none",
        boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
      }}
    >
      <p
        style={{
          margin: 0,
          color: "#a6782a",
          fontWeight: 800,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          fontSize: 13,
        }}
      >
        Ano escolar
      </p>

      <h2 style={{ margin: "16px 0 0", fontSize: 34 }}>{titulo}</h2>
    </Link>
  );
}