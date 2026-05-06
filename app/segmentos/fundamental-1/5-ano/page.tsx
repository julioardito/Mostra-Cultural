import Link from "next/link";

export default function Ano5Page() {
  return (
    <main style={{ minHeight: "100vh", background: "#f7f4ef", color: "#172033" }}>
      <header className="page-header" style={{ background: "#d8ecf7", borderBottom: "1px solid #d8c7a1" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 24 }}>
          <div>
            <Link href="/segmentos/fundamental-1" style={{ color: "#173d5c", fontWeight: 700, textDecoration: "none" }}>
              ← Voltar para Fundamental 1
            </Link>
            <p style={{ margin: "24px 0 0", color: "#a6782a", fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase", fontSize: 13 }}>
              Fundamental 1 · Anos Finais
            </p>
            <h1 className="text-3xl sm:text-5xl" style={{ margin: "10px 0 0", fontWeight: 800, lineHeight: 1.05 }}>5º Ano</h1>
            <p className="text-base sm:text-lg" style={{ margin: "12px 0 0", lineHeight: 1.5, color: "#4b5563" }}>
              Projetos interdisciplinares da turma do 5º ano — Mostra Cultural e de Itinerários Formativos 2026.
            </p>
            <div style={{ marginTop: 20 }}>
              <Link
                href="/segmentos/fundamental-1/5-ano/area"
                style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#a6782a", color: "white", borderRadius: 999, padding: "10px 22px", textDecoration: "none", fontWeight: 800, fontSize: 14 }}
              >
                👩‍🏫 Área do Professor
              </Link>
            </div>
          </div>
          <div className="hidden sm:block" style={{ background: "white", borderRadius: 18, padding: 14, boxShadow: "0 12px 30px rgba(0,0,0,0.12)", flexShrink: 0 }}>
            <img src="/logo-benjamin.png" alt="Logo do Colégio Benjamin Constant" style={{ width: 180, height: "auto", display: "block" }} />
          </div>
        </div>
      </header>

      <section className="page-section" style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ background: "white", border: "1px solid #d8c7a1", borderRadius: 22, padding: "24px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
          <p style={{ color: "#a6782a", textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 800, fontSize: 12, margin: "0 0 8px" }}>Turma</p>
          <h2 className="text-2xl sm:text-3xl" style={{ margin: "0 0 12px", fontWeight: 800 }}>Projetos do 5º Ano</h2>
          <p style={{ color: "#6b7280", lineHeight: 1.6 }}>
            Espaço da turma do 5º ano na Mostra Cultural e de Itinerários Formativos 2026.
            Professores podem acessar a Área do Professor para gerenciar o projeto e o quadro de tarefas.
          </p>
        </div>
      </section>
    </main>
  );
}
