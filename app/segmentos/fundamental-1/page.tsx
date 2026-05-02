import Link from "next/link";

export default function Fundamental1Page() {
  return (
    <main style={{ minHeight: "100vh", background: "#f7f4ef", color: "#172033" }}>
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
          <div>
            <Link href="/" style={{ color: "#173d5c", fontWeight: 700, textDecoration: "none" }}>
              ← Voltar para a página inicial
            </Link>

            <p
              style={{
                marginTop: 24,
                color: "#a6782a",
                fontWeight: 800,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                fontSize: 13,
              }}
            >
              Mostra Cultural e de Itinerários Formativos 2026
            </p>

            <h1
              className="text-3xl sm:text-5xl"
              style={{ margin: "10px 0 0", fontWeight: 800, lineHeight: 1.05 }}
            >
              Ensino Fundamental 1
            </h1>

            <p
              className="text-base sm:text-lg"
              style={{ margin: "12px 0 0", maxWidth: 780, lineHeight: 1.5 }}
            >
              Espaço dedicado aos projetos do 1º ao 5º ano na Mostra Cultural.
            </p>
          </div>

          <div
            className="hidden sm:block"
            style={{
              background: "white",
              borderRadius: 20,
              padding: 14,
              boxShadow: "0 10px 24px rgba(0,0,0,0.12)",
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

      <section className="page-section" style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* 2 cols mobile, 3 cols desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6">
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
              borderRadius: 22,
              padding: "18px 16px",
              textDecoration: "none",
              boxShadow: "0 10px 24px rgba(0,0,0,0.14)",
            }}
          >
            <p
              style={{
                margin: 0,
                color: "#f4d28c",
                fontWeight: 800,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                fontSize: 11,
              }}
            >
              IA Pedagógica
            </p>
            <h2 className="text-lg sm:text-2xl" style={{ margin: "10px 0 0", fontWeight: 800 }}>
              Desenvolvedor de Projetos
            </h2>
            <p className="hidden sm:block" style={{ marginTop: 10, lineHeight: 1.5, fontSize: 15 }}>
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
        borderRadius: 22,
        padding: "18px 16px",
        textDecoration: "none",
        boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
      }}
    >
      <p
        style={{
          margin: 0,
          color: "#a6782a",
          fontWeight: 800,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          fontSize: 11,
        }}
      >
        Ano escolar
      </p>
      <h2 className="text-2xl sm:text-3xl" style={{ margin: "10px 0 0", fontWeight: 800 }}>
        {titulo}
      </h2>
    </Link>
  );
}
