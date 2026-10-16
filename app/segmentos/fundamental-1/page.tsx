import Link from "next/link";

const grupo1 = [
  { href: "/segmentos/fundamental-1/1-ano", titulo: "1º Ano", cor: "#2563eb" },
  { href: "/segmentos/fundamental-1/2-ano", titulo: "2º Ano", cor: "#059669" },
];

const grupo2 = [
  { href: "/segmentos/fundamental-1/3-ano", titulo: "3º Ano", cor: "#d97706" },
  { href: "/segmentos/fundamental-1/4-ano", titulo: "4º Ano", cor: "#7c3aed" },
  { href: "/segmentos/fundamental-1/5-ano", titulo: "5º Ano", cor: "#dc2626" },
];

export default function FundamentalAnosIniciaisPage() {
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
            <Link href="/" style={{ color: "#173d5c", fontWeight: 700, textDecoration: "none" }}>
              ← Voltar para a página inicial
            </Link>
            <p style={{ marginTop: 24, color: "#a6782a", fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase", fontSize: 13 }}>
              Mostra Cultural e de Itinerários Formativos 2026
            </p>
            <h1 className="text-3xl sm:text-5xl" style={{ margin: "10px 0 0", fontWeight: 800, lineHeight: 1.05 }}>
              Ensino Fundamental (Anos Iniciais)
            </h1>
            <p className="text-base sm:text-lg" style={{ margin: "12px 0 0", maxWidth: 780, lineHeight: 1.5 }}>
              Projetos do 1º ao 5º ano — Socioecologia e Resiliência.
            </p>
          </div>
          <div className="hidden sm:block" style={{ background: "white", borderRadius: 20, padding: 14, boxShadow: "0 10px 24px rgba(0,0,0,0.12)", flexShrink: 0 }}>
            <img src="/logo-benjamin.png" alt="Logo do Colégio Benjamin Constant" style={{ width: 200, height: "auto", display: "block" }} />
          </div>
        </div>
      </header>

      <section className="page-section" style={{ maxWidth: 1280, margin: "0 auto" }}>

        {/* IA Pedagógica */}
        <Link
          href="/segmentos/fundamental-1/desenvolvedor-projetos"
          style={{ display: "block", background: "#173d5c", color: "white", borderRadius: 24, padding: "22px 26px", textDecoration: "none", boxShadow: "0 10px 24px rgba(0,0,0,0.14)", marginBottom: 32 }}
        >
          <p style={{ margin: 0, color: "#f4d28c", fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", fontSize: 12 }}>IA Pedagógica</p>
          <h2 style={{ margin: "12px 0 0", fontSize: 26, fontWeight: 800, color: "white" }}>Desenvolvedor de Projetos</h2>
          <p style={{ marginTop: 10, lineHeight: 1.5, color: "#d8ecf7", fontSize: 15 }}>
            Assistente inteligente para criar propostas pedagógicas e planos de aula para a Mostra Cultural.
          </p>
        </Link>

        {/* 1º e 2º anos */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ marginBottom: 16 }}>
            <p style={{ margin: 0, color: "#a6782a", fontSize: 13, fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase" }}>
              Ensino Fundamental — Anos Iniciais
            </p>
            <h2 className="text-2xl sm:text-3xl" style={{ margin: "6px 0 0", fontWeight: 800 }}>
              1º e 2º anos
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {grupo1.map((ano) => (
              <AnoCard key={ano.titulo} {...ano} />
            ))}
          </div>
        </div>

        {/* Projeto "Sabores que Nutrem e Transformam" — 1º e 2º anos */}
        <article
          style={{
            background: "white",
            border: "1px solid #d8c7a1",
            borderRadius: 24,
            padding: "28px 28px 32px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
            marginBottom: 32,
          }}
        >
          <p style={{ margin: 0, color: "#a6782a", fontSize: 13, fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase" }}>
            Projeto dos 1º e 2º anos
          </p>
          <h2
            className="text-2xl sm:text-4xl"
            style={{ margin: "8px 0 6px", fontWeight: 800, lineHeight: 1.1, color: "#172033" }}
          >
            Sabores que Nutrem e Transformam
          </h2>
          <p style={{ margin: 0, fontSize: 16, color: "#4b5563", lineHeight: 1.55, fontStyle: "italic" }}>
            Pequenas escolhas, grandes transformações!
          </p>

          <div style={{ marginTop: 20, display: "grid", gap: 14 }}>
            <p style={{ margin: 0, fontSize: 15.5, lineHeight: 1.7, color: "#374151" }}>
              Você já parou para pensar em quantas descobertas cabem em um alimento?
            </p>
            <p style={{ margin: 0, fontSize: 15.5, lineHeight: 1.7, color: "#374151" }}>
              Foi a partir dessa curiosidade que os alunos dos <strong>1º e 2º anos</strong> embarcaram
              no projeto <strong>“Sabores que Nutrem e Transformam”</strong>, explorando o universo
              da alimentação por meio de histórias, pesquisas, conversas e experiências práticas.
            </p>
            <p style={{ margin: 0, fontSize: 15.5, lineHeight: 1.7, color: "#374151" }}>
              Ao longo dessa jornada, as crianças descobriram que os alimentos nutrem o corpo,
              que nossas escolhas influenciam a saúde e que até aquilo que parece não ter mais
              utilidade pode ganhar um novo destino.
            </p>
            <p style={{ margin: 0, fontSize: 15.5, lineHeight: 1.7, color: "#374151" }}>
              Entre descobertas e experimentações, refletimos sobre{" "}
              <strong>alimentação saudável, aproveitamento dos alimentos e redução do
              desperdício</strong>, ampliando nosso olhar para o cuidado com o meio ambiente.
            </p>
            <p style={{ margin: 0, fontSize: 15.5, lineHeight: 1.7, color: "#374151" }}>
              Afinal, aprender a se alimentar também é aprender a escolher, cuidar e
              transformar! E são essas pequenas descobertas, levadas para além da escola, que
              podem inspirar grandes mudanças.
            </p>
          </div>

          <div style={{ marginTop: 22 }}>
            <p style={{ margin: 0, color: "#a6782a", fontSize: 12, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase" }}>
              Vivências do projeto
            </p>
            <ul
              style={{
                margin: "10px 0 0",
                padding: 0,
                listStyle: "none",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 10,
              }}
            >
              {[
                "Construção do semáforo",
                "Palestra com a Dra. Priscila Teivelis",
                "Confecção do mascote",
                "Piquenique",
                "De onde vêm os alimentos?",
                "Reaproveitamento de alimentos",
              ].map((item) => (
                <li
                  key={item}
                  style={{
                    padding: "10px 14px",
                    background: "#fbf9f5",
                    border: "1px solid #efe4c9",
                    borderRadius: 12,
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#172033",
                  }}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </article>

        {/* 3º, 4º e 5º anos */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ marginBottom: 16 }}>
            <p style={{ margin: 0, color: "#a6782a", fontSize: 13, fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase" }}>
              Ensino Fundamental — Anos Iniciais
            </p>
            <h2 className="text-2xl sm:text-3xl" style={{ margin: "6px 0 0", fontWeight: 800 }}>
              3º, 4º e 5º anos
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {grupo2.map((ano) => (
              <AnoCard key={ano.titulo} {...ano} />
            ))}
          </div>
        </div>

        {/* Mapa */}
        <div
          style={{
            background: "white",
            border: "1px solid #d8c7a1",
            borderRadius: 24,
            padding: "24px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
          }}
        >
          <p style={{ margin: "0 0 4px", color: "#a6782a", fontSize: 13, fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase" }}>
            Espaço
          </p>
          <h2 className="text-2xl sm:text-3xl" style={{ margin: "0 0 20px", fontWeight: 800 }}>
            Mapa do Ensino Fundamental (Anos Iniciais)
          </h2>
          <div style={{ background: "#f7f4ef", borderRadius: 16, padding: "16px", display: "flex", justifyContent: "center" }}>
            <img
              src="/fund1.png"
              alt="Mapa do espaço do Ensino Fundamental Anos Iniciais na Mostra Cultural"
              style={{ width: "100%", maxWidth: 860, height: "auto", borderRadius: 12, border: "1px solid #d8c7a1" }}
            />
          </div>
        </div>

      </section>
    </main>
  );
}

function AnoCard({ href, titulo, cor }: { href: string; titulo: string; cor: string }) {
  return (
    <div style={{ background: "white", border: "1px solid #d8c7a1", borderRadius: 24, padding: "20px 22px", boxShadow: "0 8px 22px rgba(0,0,0,0.06)" }}>
      <div style={{ height: 6, borderRadius: 999, background: cor, marginBottom: 16 }} />
      <p style={{ margin: 0, color: "#a6782a", fontSize: 12, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase" }}>
        Ensino Fundamental — Anos Iniciais
      </p>
      <h3 className="text-3xl sm:text-4xl" style={{ margin: "10px 0 14px", fontWeight: 800, lineHeight: 1.1 }}>
        {titulo}
      </h3>
      <Link
        href={href}
        style={{ background: "#173d5c", color: "white", borderRadius: 999, padding: "10px 20px", textDecoration: "none", fontWeight: 800, fontSize: 14, display: "inline-block" }}
      >
        Ver turma
      </Link>
    </div>
  );
}
