import Link from "next/link";

export default function EducacaoBasicaPage() {
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
              Educação Infantil
            </h1>
            <p
              className="text-base sm:text-lg"
              style={{ margin: "12px 0 0", maxWidth: 780, lineHeight: 1.5, color: "#111827" }}
            >
              Projetos do Minimaternal ao Pré — Socioecologia e Resiliência.
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

        {/* Projeto UNESCO 2026 — Educação Infantil */}
        <article
          style={{
            background: "white",
            border: "1px solid #d8c7a1",
            borderRadius: 24,
            padding: "32px 28px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
            marginBottom: 24,
          }}
        >
          <p style={{ margin: 0, color: "#a6782a", fontSize: 13, fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase" }}>
            Educação Infantil — Projeto UNESCO 2026
          </p>
          <h2
            className="text-2xl sm:text-4xl"
            style={{ margin: "8px 0 6px", fontWeight: 800, lineHeight: 1.1, color: "#172033" }}
          >
            Pequenos voluntários, ações que transformam
          </h2>
          <p style={{ margin: "0 0 20px", fontSize: 16, color: "#4b5563", lineHeight: 1.55 }}>
            Pequenas atitudes hoje, grandes transformações amanhã.
          </p>

          <div style={{ display: "grid", gap: 18 }}>
            <Secao numero="1" titulo="Introdução">
              O projeto <strong>“Pequenos voluntários, ações que transformam”</strong> foi
              desenvolvido com a Educação Infantil, do Minimaternal ao Pré, com o
              objetivo de incentivar atitudes de cuidado, cooperação, responsabilidade
              e respeito ao próximo e ao meio ambiente. Por meio de vivências do
              cotidiano escolar, as crianças compreenderam que pequenas ações podem
              gerar grandes transformações.
            </Secao>

            <Secao numero="2" titulo="Minimaternal e Maternal">
              A partir da história <strong>“Os Três Porquinhos”</strong>, as crianças do
              Minimaternal e Maternal exploraram os <strong>3Rs — reduzir, reutilizar e
              reciclar</strong>. Por meio de brincadeiras, conversas e construções,
              materiais como rolinhos, gravetos, caixas e outros elementos ganharam
              novos significados, estimulando a criatividade, a imaginação e o
              desenvolvimento da coordenação motora. A turma também confeccionou
              um livro coletivo, recontando a história e registrando momentos
              importantes da narrativa.
            </Secao>

            <Secao numero="3" titulo="Jardim">
              Nas turmas do Jardim, a <strong>horta vertical</strong> e a <strong>composteira
              </strong> transformaram o cuidado com a natureza em uma experiência prática e
              significativa. Com <strong>garrafas PET</strong> e resíduos orgânicos coletados
              no momento do lanche, as crianças aprenderam sobre redução de resíduos,
              sustentabilidade e preservação ambiental.
            </Secao>

            <Secao numero="4" titulo="Pré">
              As turmas do Pré participaram de uma campanha de <strong>arrecadação de
              tampinhas plásticas</strong>, refletindo sobre cooperação, responsabilidade e
              cuidado com o meio ambiente. Ao longo do projeto, as crianças participaram
              da divulgação da campanha e descobriram que materiais que seriam
              descartados podem ganhar novos usos. As tampinhas foram transformadas em
              <strong> jogos pedagógicos</strong>, promovendo criatividade, aprendizagem e
              trabalho em equipe. Ao final da iniciativa, as tampinhas arrecadadas serão
              destinadas à doação, contribuindo para uma ação social.
            </Secao>

            <Secao numero="5" titulo="Resultados e considerações finais">
              Ao longo do projeto, as crianças participaram de experiências que
              favoreceram a criatividade, a cooperação, a socialização e a consciência
              ambiental. As propostas mostraram, de forma prática e significativa, que
              pequenas atitudes de cuidado, reutilização e responsabilidade podem
              contribuir para um ambiente mais sustentável e para a construção de
              valores de cidadania.
            </Secao>
          </div>

          <div
            style={{
              marginTop: 24,
              padding: "14px 18px",
              borderRadius: 16,
              background: "#eafbe0",
              color: "#166534",
              fontWeight: 800,
              fontSize: 15,
              textAlign: "center",
              border: "1px solid #bbf7d0",
            }}
          >
            Pequenas atitudes hoje, grandes transformações amanhã.
            <span style={{ display: "block", marginTop: 4, color: "#065f46", fontWeight: 600, fontSize: 13 }}>
              📅 Duração do projeto: abril a outubro
            </span>
          </div>
        </article>

        {/* Corrente do Bemjá */}
        <article
          style={{
            background: "white",
            border: "1px solid #d8c7a1",
            borderRadius: 24,
            padding: "28px 28px 32px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", gap: 20 }}>
            <div style={{ flex: "1 1 320px", minWidth: 260 }}>
              <p style={{ margin: 0, color: "#a6782a", fontSize: 13, fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase" }}>
                Corrente do Bemjá
              </p>
              <h2
                className="text-2xl sm:text-3xl"
                style={{ margin: "8px 0 10px", fontWeight: 800, lineHeight: 1.1, color: "#1e40af" }}
              >
                Sua doação faz a diferença!
              </h2>
              <p style={{ margin: 0, fontSize: 16, color: "#374151", lineHeight: 1.6 }}>
                Faça parte da <strong>Corrente do Bemjá</strong>! Estamos recebendo doações de{" "}
                <strong style={{ color: "#059669" }}>
                  alimentos, produtos de higiene, roupas, calçados, materiais escolares e brinquedos.
                </strong>
              </p>

              <p
                style={{
                  margin: "16px 0 0",
                  padding: "12px 16px",
                  background: "#fff5f5",
                  border: "1px solid #fecaca",
                  borderRadius: 12,
                  fontSize: 13,
                  lineHeight: 1.55,
                  color: "#991b1b",
                }}
              >
                <strong>Não serão aceitos:</strong> sal, açúcar, livros com nome de instituições
                de ensino, livros didáticos, apostilas, revistas ou jornais; roupas íntimas; e
                brinquedos danificados ou sem condições de uso.
              </p>

              <p
                style={{
                  margin: "12px 0 0",
                  padding: "10px 14px",
                  background: "#ecfdf5",
                  border: "1px solid #a7f3d0",
                  borderRadius: 12,
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#065f46",
                }}
              >
                📅 Até dia 02 de outubro.
              </p>
            </div>
          </div>
        </article>

      </section>
    </main>
  );
}

function Secao({
  numero,
  titulo,
  children,
}: {
  numero: string;
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        padding: "18px 20px",
        background: "#fbf9f5",
        border: "1px solid #efe4c9",
        borderRadius: 16,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
        <span
          aria-hidden="true"
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "#f4d28c",
            color: "#172033",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            fontSize: 15,
            flexShrink: 0,
          }}
        >
          {numero}
        </span>
        <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#172033" }}>{titulo}</h3>
      </div>
      <p style={{ margin: 0, fontSize: 15, lineHeight: 1.65, color: "#374151" }}>{children}</p>
    </div>
  );
}
