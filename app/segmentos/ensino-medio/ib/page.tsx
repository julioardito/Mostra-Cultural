import Link from "next/link";

export default function IBPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#f7f4ef", color: "#172033" }}>
      <header
        className="page-header"
        style={{ background: "#0f766e", borderBottom: "1px solid #0b5a54" }}
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
            <Link
              href="/segmentos/ensino-medio"
              style={{ color: "#9ce8df", textDecoration: "none", fontWeight: 700 }}
            >
              ← Voltar para Ensino Médio
            </Link>
            <p
              style={{
                margin: "24px 0 0",
                color: "#9ce8df",
                fontSize: 13,
                fontWeight: 800,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
              }}
            >
              Programa Internacional
            </p>
            <h1
              className="text-3xl sm:text-5xl"
              style={{ margin: "10px 0 0", lineHeight: 1.05, fontWeight: 800, color: "white" }}
            >
              IB — International Baccalaureate
            </h1>
            <p
              className="text-base sm:text-lg"
              style={{ margin: "12px 0 0", maxWidth: 780, lineHeight: 1.5, color: "#cdeee9" }}
            >
              Programa do Diploma na Mostra Cultural e de Itinerários Formativos 2026.
            </p>
          </div>

          <div
            className="hidden sm:block"
            style={{
              background: "white",
              borderRadius: 20,
              padding: 14,
              boxShadow: "0 12px 30px rgba(0,0,0,0.2)",
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
        <div
          style={{
            background: "white",
            border: "1px solid #d8c7a1",
            borderRadius: 24,
            padding: "32px 28px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
            textAlign: "center",
          }}
        >
          <span style={{ fontSize: 48 }}>🌍</span>
          <h2 style={{ margin: "16px 0 8px", fontSize: 26, fontWeight: 800, color: "#172033" }}>
            Em construção
          </h2>
          <p style={{ margin: "0 auto", maxWidth: 620, fontSize: 16, lineHeight: 1.6, color: "#6b7280" }}>
            As informações sobre o itinerário do International Baccalaureate na
            Mostra Cultural serão divulgadas em breve nesta página.
          </p>
        </div>
      </section>
    </main>
  );
}
