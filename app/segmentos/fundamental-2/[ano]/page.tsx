import Link from "next/link";

type Props = { params: Promise<{ ano: string }> };

const anoInfo: Record<string, { titulo: string; cor: string }> = {
  "6-ano": { titulo: "6º Ano", cor: "#2563eb" },
  "7-ano": { titulo: "7º Ano", cor: "#059669" },
  "8-ano": { titulo: "8º Ano", cor: "#d97706" },
  "9-ano": { titulo: "9º Ano", cor: "#7c3aed" },
};

export default async function F2AnoPage({ params }: Props) {
  const { ano } = await params;
  const info = anoInfo[ano] ?? { titulo: ano.replace("-", "º ").replace("ano", "Ano"), cor: "#173d5c" };

  return (
    <main style={{ minHeight: "100vh", background: "#f7f4ef", color: "#172033" }}>
      <header className="page-header" style={{ background: "#d8ecf7", borderBottom: "1px solid #d8c7a1" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 24 }}>
          <div>
            <Link href="/segmentos/fundamental-2" style={{ color: "#173d5c", fontWeight: 700, textDecoration: "none" }}>
              ← Voltar para Fundamental 2
            </Link>
            <p style={{ margin: "24px 0 0", color: "#a6782a", fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase", fontSize: 13 }}>
              Ensino Fundamental 2
            </p>
            <h1 className="text-3xl sm:text-5xl" style={{ margin: "10px 0 0", fontWeight: 800, lineHeight: 1.05 }}>
              {info.titulo}
            </h1>
            <div style={{ width: 80, height: 5, background: info.cor, borderRadius: 999, margin: "14px 0" }} />
            <p className="text-base sm:text-lg" style={{ margin: "0 0 20px", lineHeight: 1.5, color: "#4b5563" }}>
              Projetos interdisciplinares da turma do {info.titulo} — Mostra Cultural e de Itinerários Formativos 2026.
            </p>
            <Link
              href={`/segmentos/fundamental-2/${ano}/area`}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#a6782a", color: "white", borderRadius: 999, padding: "10px 22px", textDecoration: "none", fontWeight: 800, fontSize: 14 }}
            >
              🎒 Área do Aluno
            </Link>
          </div>
          <div className="hidden sm:block" style={{ background: "white", borderRadius: 18, padding: 14, boxShadow: "0 12px 30px rgba(0,0,0,0.12)", flexShrink: 0 }}>
            <img src="/logo-benjamin.png" alt="Logo do Colégio Benjamin Constant" style={{ width: 180, height: "auto", display: "block" }} />
          </div>
        </div>
      </header>

      <section className="page-section" style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ background: "white", border: "1px solid #d8c7a1", borderRadius: 22, padding: "24px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
          <p style={{ color: "#a6782a", textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 800, fontSize: 12, margin: "0 0 8px" }}>Turma</p>
          <h2 className="text-2xl sm:text-3xl" style={{ margin: "0 0 12px", fontWeight: 800 }}>
            Projetos do {info.titulo}
          </h2>
          <p style={{ color: "#6b7280", lineHeight: 1.6 }}>
            Espaço da turma do {info.titulo} na Mostra Cultural e de Itinerários Formativos 2026.
            Alunos podem acessar a Área do Aluno para editar informações do projeto e consultar o quadro de tarefas.
          </p>
        </div>
      </section>
    </main>
  );
}
