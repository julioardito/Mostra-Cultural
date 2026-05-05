"use client";

import { useState } from "react";
import Link from "next/link";

type Acao =
  | "gerar_duas_propostas"
  | "gerar_outra_versao"
  | "comparar_propostas"
  | "plano_de_aula"
  | "checklist_mostra"
  | "roteiro_fala";

export default function DesenvolvedorProjetosF2() {
  const [ano, setAno] = useState("6º Ano");
  const [tema, setTema] = useState("");
  const [contexto, setContexto] = useState("");
  const [projeto, setProjeto] = useState("");
  const [tipoAtual, setTipoAtual] = useState("Proposta Pedagógica");
  const [carregando, setCarregando] = useState(false);

  async function executarAcao(acao: Acao, tipoLabel: string) {
    setCarregando(true);
    try {
      const res = await fetch("/api/fundamental-2/desenvolvedor-projetos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ano, tema, contexto, acao, conteudoAtual: projeto }),
      });
      const data = await res.json();
      setProjeto(
        data.resposta || data.erro || "Não foi possível gerar a proposta. Tente novamente."
      );
      setTipoAtual(tipoLabel);
    } catch {
      setProjeto("Erro ao chamar o assistente. Verifique a conexão da plataforma e tente novamente.");
      setTipoAtual("Erro");
    }
    setCarregando(false);
  }

  return (
    <main style={{ minHeight: "100vh", background: "#f7f4ef", color: "#172033", padding: 40 }}>
      <style>{`
        @media print {
          body { background: white !important; }
          .no-print { display: none !important; }
          .print-area { box-shadow: none !important; border: none !important; margin: 0 !important; padding: 0 !important; }
          .avoid-break { break-inside: avoid; page-break-inside: avoid; }
        }
      `}</style>

      {/* Formulário */}
      <section
        className="no-print"
        style={{
          maxWidth: 1100,
          margin: "0 auto 32px",
          background: "white",
          border: "1px solid #d8c7a1",
          borderRadius: 24,
          padding: 32,
          boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
        }}
      >
        <Link href="/segmentos/fundamental-2" style={{ color: "#173d5c", fontWeight: 700, textDecoration: "none" }}>
          ← Voltar para Fundamental 2
        </Link>

        <p style={smallGold}>Agente pedagógico com IA</p>

        <h1 style={{ fontSize: 44, fontWeight: 800, margin: "12px 0 0" }}>
          Desenvolvedor de Projetos
        </h1>

        <p style={{ fontSize: 18, color: "#4b5563", maxWidth: 900 }}>
          Gere propostas pedagógicas para o Ensino Fundamental 2, compare versões,
          transforme ideias em plano de aula, crie checklist da Mostra e roteiro
          de fala dos alunos.
        </p>

        <div style={{ display: "grid", gap: 20, marginTop: 32 }}>
          <div>
            <label style={label}>Ano escolar</label>
            <select value={ano} onChange={(e) => setAno(e.target.value)} style={campo}>
              <option>6º Ano</option>
              <option>7º Ano</option>
              <option>8º Ano</option>
              <option>9º Ano</option>
            </select>
          </div>

          <div>
            <label style={label}>Tema ou eixo desejado</label>
            <input
              value={tema}
              onChange={(e) => setTema(e.target.value)}
              placeholder="Ex: Impacto das mudanças climáticas na biodiversidade local"
              style={campo}
            />
          </div>

          <div>
            <label style={label}>Contexto da turma ou ideia inicial</label>
            <textarea
              value={contexto}
              onChange={(e) => setContexto(e.target.value)}
              rows={6}
              placeholder="Descreva a ideia do projeto, recursos disponíveis, perfil da turma ou objetivos dos professores."
              style={{ ...campo, resize: "vertical" }}
            />
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 4 }}>
            <button type="button" onClick={() => executarAcao("gerar_duas_propostas", "Duas propostas")} disabled={carregando} style={botaoAzul}>
              Gerar 2 propostas
            </button>
            <button type="button" onClick={() => executarAcao("gerar_outra_versao", "Outra versão")} disabled={carregando || !projeto} style={botaoSecundario}>
              Gerar outra versão
            </button>
            <button type="button" onClick={() => executarAcao("comparar_propostas", "Comparação das propostas")} disabled={carregando || !projeto} style={botaoSecundario}>
              Comparar propostas
            </button>
            <button type="button" onClick={() => executarAcao("plano_de_aula", "Plano de aula")} disabled={carregando || !projeto} style={botaoSecundario}>
              Transformar em plano de aula
            </button>
            <button type="button" onClick={() => executarAcao("checklist_mostra", "Checklist da Mostra")} disabled={carregando || !projeto} style={botaoSecundario}>
              Gerar checklist da Mostra
            </button>
            <button type="button" onClick={() => executarAcao("roteiro_fala", "Roteiro de fala dos alunos")} disabled={carregando || !projeto} style={botaoSecundario}>
              Gerar roteiro de fala
            </button>
          </div>

          {carregando && (
            <p style={{ color: "#173d5c", fontWeight: 700 }}>
              Gerando com IA... aguarde alguns segundos.
            </p>
          )}
        </div>
      </section>

      {/* Resultado */}
      {projeto && (
        <section style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="no-print" style={{ marginBottom: 20, display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
            <button type="button" onClick={() => window.print()} style={botaoDourado}>
              Salvar como PDF
            </button>
          </div>

          <article
            className="print-area"
            style={{ background: "white", border: "1px solid #d8c7a1", borderRadius: 24, padding: 40, boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }}
          >
            <header style={{ display: "flex", justifyContent: "space-between", gap: 24, borderBottom: "2px solid #d8c7a1", paddingBottom: 24, marginBottom: 28 }}>
              <div>
                <p style={smallGold}>Mostra Cultural e de Itinerários Formativos 2026</p>
                <h1 style={{ fontSize: 34, lineHeight: 1.2, margin: "10px 0 0" }}>{tipoAtual}</h1>
                <p style={{ color: "#4b5563", fontSize: 16 }}>Ensino Fundamental 2 · {ano}</p>
              </div>
              <img src="/logo-benjamin.png" alt="Logo do Colégio Benjamin Constant" style={{ width: 150, height: "auto", objectFit: "contain" }} />
            </header>

            <FluxoProposta />
            <TextoFormatado texto={projeto} />
          </article>
        </section>
      )}
    </main>
  );
}

function TextoFormatado({ texto }: { texto: string }) {
  const blocos = texto.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
  return (
    <div style={{ display: "grid", gap: 18 }}>
      {blocos.map((bloco, index) => {
        const ehProposta = /^PROPOSTA\s+[A-Z]/i.test(bloco);
        const ehSecaoNumerada = /^\d+\.\s/.test(bloco);
        const ehAviso = /^AVISO/i.test(bloco);

        if (ehProposta) return (
          <section key={index} className="avoid-break" style={{ marginTop: index === 0 ? 10 : 34, padding: "18px 22px", borderRadius: 18, background: "#173d5c", color: "white" }}>
            <h2 style={{ margin: 0, fontSize: 24, lineHeight: 1.25, fontWeight: 800 }}>{bloco}</h2>
          </section>
        );

        if (ehAviso) return (
          <section key={index} className="avoid-break" style={{ padding: 18, borderRadius: 16, background: "#fff8e8", border: "1px solid #d8c7a1", color: "#6b4e16", fontWeight: 700 }}>
            {bloco}
          </section>
        );

        if (ehSecaoNumerada) {
          const linhas = bloco.split("\n").map((l) => l.trim()).filter(Boolean);
          return (
            <section key={index} className="avoid-break" style={{ border: "1px solid #eadfc8", borderRadius: 18, padding: 22, background: "#fffdf8" }}>
              <h3 style={{ margin: "0 0 12px", color: "#173d5c", fontSize: 20, fontWeight: 800 }}>{linhas[0]}</h3>
              <div style={{ display: "grid", gap: 8, color: "#374151", fontSize: 16.5, lineHeight: 1.65 }}>
                {linhas.slice(1).map((linha, i) => <p key={i} style={{ margin: 0 }}>{linha}</p>)}
              </div>
            </section>
          );
        }

        return <p key={index} style={{ margin: 0, fontSize: 17, lineHeight: 1.7, color: "#374151" }}>{bloco}</p>;
      })}
    </div>
  );
}

function FluxoProposta() {
  const passos = ["Ideia inicial", "Investigação", "Análise crítica", "Produto final", "Mostra Cultural", "Reflexão"];
  return (
    <section className="avoid-break" style={{ margin: "0 0 32px", padding: 24, borderRadius: 22, background: "#f7f4ef", border: "1px solid #d8c7a1" }}>
      <p style={{ margin: "0 0 16px", color: "#a6782a", fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", fontSize: 13 }}>
        Fluxo pedagógico da proposta
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, minmax(0, 1fr))", gap: 10, alignItems: "stretch" }}>
        {passos.map((passo, index) => (
          <div key={passo} style={{ position: "relative", background: "white", border: "1px solid #d8c7a1", borderRadius: 18, padding: "16px 12px", textAlign: "center", minHeight: 86, display: "flex", flexDirection: "column", justifyContent: "center", boxShadow: "0 4px 10px rgba(0,0,0,0.04)" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: index === 0 ? "#173d5c" : "#a6782a", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, margin: "0 auto 8px" }}>
              {index + 1}
            </div>
            <strong style={{ fontSize: 13, color: "#172033" }}>{passo}</strong>
            {index < passos.length - 1 && (
              <span style={{ position: "absolute", right: -10, top: "50%", transform: "translateY(-50%)", color: "#a6782a", fontWeight: 900, fontSize: 18, zIndex: 2 }}>→</span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

const label = { display: "block", fontWeight: 800, color: "#173d5c", marginBottom: 8 };
const campo = { width: "100%", border: "1px solid #d8c7a1", borderRadius: 14, padding: 14, fontSize: 16 };
const smallGold = { margin: "28px 0 0", color: "#a6782a", fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase" as const, fontSize: 13 };
const botaoAzul = { background: "#173d5c", color: "white", border: 0, borderRadius: 999, padding: "14px 22px", fontWeight: 800, fontSize: 15, cursor: "pointer" };
const botaoSecundario = { background: "white", color: "#173d5c", border: "1px solid #173d5c", borderRadius: 999, padding: "13px 18px", fontWeight: 800, fontSize: 14, cursor: "pointer" };
const botaoDourado = { background: "#a6782a", color: "white", border: 0, borderRadius: 999, padding: "13px 24px", fontWeight: 800, cursor: "pointer" };
