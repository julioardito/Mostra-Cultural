import Link from "next/link";

export default function Home() {
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
            alignItems: "center",
            justifyContent: "space-between",
            gap: 24,
          }}
        >
          <div style={{ maxWidth: 820, textAlign: "center", margin: "0 auto" }}>
            <p
              style={{
                margin: 0,
                color: "#a6782a",
                fontSize: 13,
                fontWeight: 800,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                textAlign: "center",
              }}
            >
              Colégio Benjamin Constant
            </p>

            <h1
              className="text-3xl sm:text-5xl"
              style={{ margin: "10px 0 0", lineHeight: 1.05, color: "#111827", fontWeight: 800, textAlign: "center" }}
            >
              Mostra Cultural e de Itinerários Formativos 2026
            </h1>
          </div>

          <div
            className="hidden sm:block"
            style={{
              background: "white",
              borderRadius: 20,
              padding: 16,
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

      <section className="page-section">
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          {/* Welcome card */}
          <div
            style={{
              background: "white",
              border: "1px solid #d8c7a1",
              borderRadius: 24,
              padding: "28px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
              marginBottom: 24,
              textAlign: "center",
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
                textAlign: "center",
              }}
            >
              Tema deste ano
            </p>

            <h2
              className="text-xl sm:text-2xl"
              style={{ margin: "14px auto 0", lineHeight: 1.3, fontWeight: 800, maxWidth: 820, textAlign: "center" }}
            >
              Socioecologia e Resiliência: como a Arte e a Ciência podem ajudar
              a moldar um amanhã sustentável.
            </h2>

            <p
              className="text-base sm:text-lg"
              style={{ margin: "16px auto 0", maxWidth: 880, lineHeight: 1.55, color: "#4b5563", textAlign: "center" }}
            >
              A Mostra Cultural reúne projetos, pesquisas, experiências e produções
              dos estudantes, promovendo diálogo entre ciência, arte, cultura,
              sustentabilidade e protagonismo estudantil.
            </p>
          </div>

          {/* Segment cards — 1 col mobile, 2 cols desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
            <SegmentCard
              href="/segmentos/educacao-basica"
              title="Educação Básica"
              subtitle="Educação Infantil"
            />
            <SegmentCard
              href="/segmentos/fundamental-1"
              title="Ensino Fundamental 1"
              subtitle="1º ao 5º ano"
            />
            <SegmentCard
              href="/segmentos/fundamental-2"
              title="Ensino Fundamental 2"
              subtitle="6º ao 9º ano"
            />
            <SegmentCard
              href="/segmentos/ensino-medio"
              title="Ensino Médio"
              subtitle="Itinerários Formativos"
            />
          </div>

          {/* Programação do Evento — full width */}
          <Link
            href="/programacao"
            style={{
              display: "block",
              background: "#a6782a",
              color: "white",
              borderRadius: 24,
              padding: "20px 28px",
              textDecoration: "none",
              fontWeight: 800,
              fontSize: 20,
              textAlign: "center",
              boxShadow: "0 8px 24px rgba(0,0,0,0.14)",
              marginBottom: 24,
              letterSpacing: "0.01em",
            }}
          >
            Programação do Evento
          </Link>

          {/* Photo panel */}
          <section
            style={{
              overflow: "hidden",
              borderRadius: 24,
              border: "1px solid #d8c7a1",
              background: "white",
              boxShadow: "0 14px 34px rgba(0,0,0,0.12)",
            }}
          >
            <div style={{ background: "#173d5c", color: "white", padding: "20px 28px", textAlign: "center" }}>
              <p
                style={{
                  margin: 0,
                  color: "#f4d28c",
                  fontSize: 13,
                  fontWeight: 800,
                  letterSpacing: "0.24em",
                  textTransform: "uppercase",
                  textAlign: "center",
                }}
              >
                Registros da Mostra
              </p>
              <h2
                className="text-xl sm:text-3xl"
                style={{ margin: "8px 0 0", lineHeight: 1.2, fontWeight: 800, textAlign: "center" }}
              >
                Memórias, projetos e protagonismo estudantil
              </h2>
            </div>
            <img
              src="/fotos/painel_mostra_cultural_2026.png"
              alt="Painel da Mostra Cultural e de Itinerários Formativos 2026"
              style={{ width: "100%", display: "block" }}
            />
          </section>
        </div>
      </section>
    </main>
  );
}

function SegmentCard({
  href,
  title,
  subtitle,
}: {
  href: string;
  title: string;
  subtitle: string;
}) {
  return (
    <Link
      href={href}
      className="transition-all duration-200 hover:shadow-xl hover:-translate-y-1"
      style={{
        display: "block",
        textDecoration: "none",
        color: "#172033",
        background: "white",
        border: "1px solid #d8c7a1",
        borderRadius: 24,
        padding: "22px 24px",
        boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
        textAlign: "center",
      }}
    >
      <p
        style={{
          margin: 0,
          color: "#a6782a",
          fontSize: 12,
          fontWeight: 800,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          textAlign: "center",
        }}
      >
        Segmento
      </p>

      <h2
        className="text-xl sm:text-2xl"
        style={{ margin: "10px 0 0", lineHeight: 1.15, fontWeight: 800, textAlign: "center" }}
      >
        {title}
      </h2>

      <p style={{ margin: "8px 0 0", fontSize: 15, color: "#4b5563", textAlign: "center" }}>
        {subtitle}
      </p>
    </Link>
  );
}
