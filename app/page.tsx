import Link from "next/link";

export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f7f4ef",
        color: "#172033",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <header
        style={{
          background: "#d8ecf7",
          borderBottom: "1px solid #d8c7a1",
          padding: "36px 64px",
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 40,
          }}
        >
          <div style={{ maxWidth: 820 }}>
            <p
              style={{
                margin: 0,
                color: "#a6782a",
                fontSize: 14,
                fontWeight: 800,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
              }}
            >
              Colégio Benjamin Constant
            </p>

            <h1
              style={{
                margin: "12px 0 0",
                fontSize: 55,
                lineHeight: 1,
                color: "#111827",
                fontWeight: 800,
              }}
            >
              Mostra Cultural 2026 e de Itinerários Formativos
            </h1>

            <p
              style={{
                margin: "24px 0 0",
                maxWidth: 760,
                color: "#111827",
                fontSize: 22,
                lineHeight: 1.45,
                fontWeight: 500,
              }}
            >
              Socioecologia e Resiliência: como a Arte e a Ciência podem ajudar
              a moldar um amanhã sustentável.
            </p>
          </div>

          <div
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
              style={{
                width: 260,
                height: "auto",
                display: "block",
              }}
            />
          </div>
        </div>
      </header>

      <section style={{ padding: "48px 64px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div
            style={{
              background: "white",
              border: "1px solid #d8c7a1",
              borderRadius: 28,
              padding: 36,
              boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
              marginBottom: 36,
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
              Bem-vindos
            </p>

            <h2
              style={{
                margin: "14px 0 0",
                fontSize: 42,
                lineHeight: 1.15,
                fontWeight: 800,
              }}
            >
              Conhecer para transformar. Agir para preservar.
            </h2>

            <p
              style={{
                margin: "18px 0 0",
                maxWidth: 980,
                fontSize: 20,
                lineHeight: 1.55,
                color: "#4b5563",
              }}
            >
              A Mostra Cultural reúne projetos, pesquisas, experiências e
              produções dos estudantes, promovendo diálogo entre ciência, arte,
              cultura, sustentabilidade e protagonismo estudantil.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: 24,
              marginBottom: 40,
            }}
          >
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

          <section
            style={{
              overflow: "hidden",
              borderRadius: 32,
              border: "1px solid #d8c7a1",
              background: "white",
              boxShadow: "0 14px 34px rgba(0,0,0,0.12)",
            }}
          >
            <div
              style={{
                background: "#173d5c",
                color: "white",
                padding: "24px 36px",
              }}
            >
              <p
                style={{
                  margin: 0,
                  color: "#f4d28c",
                  fontSize: 14,
                  fontWeight: 800,
                  letterSpacing: "0.24em",
                  textTransform: "uppercase",
                }}
              >
                Registros da Mostra
              </p>

              <h2
                style={{
                  margin: "10px 0 0",
                  fontSize: 34,
                  lineHeight: 1.2,
                  fontWeight: 800,
                }}
              >
                Memórias, projetos e protagonismo estudantil
              </h2>
            </div>

            <img
              src="/fotos/painel_mostra_cultural_2026.png"
              alt="Painel da Mostra Cultural 2026"
              style={{
                width: "100%",
                display: "block",
              }}
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
      style={{
        display: "block",
        textDecoration: "none",
        color: "#172033",
        background: "white",
        border: "1px solid #d8c7a1",
        borderRadius: 28,
        padding: 30,
        boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
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
        Segmento
      </p>

      <h2
        style={{
          margin: "16px 0 0",
          fontSize: 34,
          lineHeight: 1.1,
          fontWeight: 800,
        }}
      >
        {title}
      </h2>

      <p
        style={{
          margin: "16px 0 0",
          fontSize: 18,
          color: "#4b5563",
        }}
      >
        {subtitle}
      </p>
    </Link>
  );
}