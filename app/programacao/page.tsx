import Link from "next/link";

export default function ProgramacaoPage() {
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
                textAlign: "left",
              }}
            >
              Mostra Cultural e de Itinerários Formativos 2026
            </p>

            <h1
              className="text-3xl sm:text-5xl"
              style={{ margin: "10px 0 0", lineHeight: 1.05, fontWeight: 800, color: "#111827" }}
            >
              Programação do Evento
            </h1>

            <p
              className="text-base sm:text-lg"
              style={{ margin: "12px 0 0", maxWidth: 780, lineHeight: 1.5, color: "#111827" }}
            >
              Confira os horários, atrações e espaços da Mostra Cultural e de
              Itinerários Formativos 2026 do Colégio Benjamin Constant.
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

        {/* Em construção banner */}
        <div
          style={{
            background: "#fff8e8",
            border: "1px solid #d8c7a1",
            borderRadius: 20,
            padding: "20px 24px",
            marginBottom: 32,
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <span style={{ fontSize: 28 }}>🚧</span>
          <div>
            <p
              style={{
                margin: 0,
                fontWeight: 800,
                fontSize: 18,
                color: "#a6782a",
                textAlign: "left",
              }}
            >
              Em construção
            </p>
            <p style={{ margin: "4px 0 0", color: "#6b4e16", fontSize: 15 }}>
              A programação completa será publicada em breve. As informações
              abaixo são preliminares e podem ser atualizadas.
            </p>
          </div>
        </div>

        {/* Mapa da escola */}
        <div
          style={{
            background: "white",
            border: "1px solid #d8c7a1",
            borderRadius: 24,
            padding: "24px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
            marginBottom: 28,
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
              textAlign: "left",
            }}
          >
            Espaços
          </p>
          <h2
            className="text-2xl sm:text-3xl"
            style={{ margin: "0 0 20px", fontWeight: 800 }}
          >
            Mapa do Colégio Benjamin Constant
          </h2>
          <div
            style={{
              background: "#f7f4ef",
              borderRadius: 16,
              padding: "16px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <img
              src="/mapa-escola.png"
              alt="Mapa do Colégio Benjamin Constant com os espaços da Mostra Cultural 2026"
              style={{
                width: "100%",
                maxWidth: 860,
                height: "auto",
                borderRadius: 12,
                border: "1px solid #d8c7a1",
              }}
            />
          </div>
        </div>

        {/* Tabela de programação */}
        <div
          style={{
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
              textAlign: "left",
            }}
          >
            Horários
          </p>
          <h2
            className="text-2xl sm:text-3xl"
            style={{ margin: "0 0 20px", fontWeight: 800 }}
          >
            Grade de Programação
          </h2>
          <div
            style={{
              background: "#f7f4ef",
              borderRadius: 16,
              padding: "16px",
              display: "flex",
              justifyContent: "center",
              overflowX: "auto",
            }}
          >
            <img
              src="/programacao-evento.png"
              alt="Tabela de programação da Mostra Cultural e de Itinerários Formativos 2026"
              style={{
                width: "100%",
                maxWidth: 900,
                height: "auto",
                borderRadius: 12,
                border: "1px solid #d8c7a1",
              }}
            />
          </div>
          <p
            style={{
              marginTop: 14,
              color: "#6b7280",
              fontSize: 14,
              textAlign: "center",
            }}
          >
            Horários e atrações serão confirmados e atualizados até a data do evento.
          </p>
        </div>

      </section>
    </main>
  );
}
