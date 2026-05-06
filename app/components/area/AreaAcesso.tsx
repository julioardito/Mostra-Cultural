"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import KanbanBoard from "@/app/components/kanban/KanbanBoard";

type Projeto = {
  titulo: string;
  descricao: string;
  integrantes: string;
  link_portfolio: string;
};

type Props = {
  codigo: string;          // identificador único: "F1-1ANO", "F2-6ANO", etc.
  nome: string;            // nome de exibição: "1º Ano — Fundamental 1"
  tipo: "aluno" | "professor";
  voltarHref: string;
  voltarLabel: string;
};

export default function AreaAcesso({ codigo, nome, tipo, voltarHref, voltarLabel }: Props) {
  const SESSAO_KEY = `area_auth_${codigo}`;
  const labelArea = tipo === "professor" ? "Área do Professor" : "Área do Aluno";
  const iconArea = tipo === "professor" ? "👩‍🏫" : "🎒";

  const [autenticado, setAutenticado] = useState(false);
  const [iniciando, setIniciando] = useState(true);
  const [senha, setSenha] = useState("");
  const [erroLogin, setErroLogin] = useState("");
  const [carregandoLogin, setCarregandoLogin] = useState(false);

  const [projeto, setProjeto] = useState<Projeto>({
    titulo: "", descricao: "", integrantes: "", link_portfolio: "",
  });
  const [projetoOriginal, setProjetoOriginal] = useState<Projeto | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [mensagemSalvo, setMensagemSalvo] = useState("");
  const [aba, setAba] = useState<"projeto" | "kanban">("projeto");

  // ── Sessão ────────────────────────────────────────────────
  useEffect(() => {
    if (sessionStorage.getItem(SESSAO_KEY) === "ok") {
      setAutenticado(true);
      carregarProjeto();
    }
    setIniciando(false);
  }, [codigo]);

  // ── Login ─────────────────────────────────────────────────
  async function fazerLogin(e: React.FormEvent) {
    e.preventDefault();
    setErroLogin("");
    setCarregandoLogin(true);
    try {
      const res = await fetch(`/api/area/${codigo}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senha }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErroLogin(data.erro || "Erro ao autenticar.");
      } else {
        sessionStorage.setItem(SESSAO_KEY, "ok");
        setAutenticado(true);
        carregarProjeto();
      }
    } catch {
      setErroLogin("Erro de conexão. Tente novamente.");
    }
    setCarregandoLogin(false);
  }

  function sair() {
    sessionStorage.removeItem(SESSAO_KEY);
    setAutenticado(false);
    setSenha("");
    setProjeto({ titulo: "", descricao: "", integrantes: "", link_portfolio: "" });
    setProjetoOriginal(null);
  }

  // ── Projeto editável ──────────────────────────────────────
  async function carregarProjeto() {
    const { data } = await supabase
      .from("aluno_projetos")
      .select("titulo, descricao, integrantes, link_portfolio")
      .eq("itinerario_sigla", codigo)
      .single();
    if (data) {
      const p: Projeto = {
        titulo: data.titulo || "",
        descricao: data.descricao || "",
        integrantes: data.integrantes || "",
        link_portfolio: data.link_portfolio || "",
      };
      setProjeto(p);
      setProjetoOriginal(p);
    }
  }

  async function salvarProjeto(e: React.FormEvent) {
    e.preventDefault();
    setSalvando(true);
    setMensagemSalvo("");
    const { error } = await supabase.from("aluno_projetos").upsert({
      itinerario_sigla: codigo,
      ...projeto,
      updated_at: new Date().toISOString(),
    });
    if (!error) {
      setProjetoOriginal(projeto);
      setMensagemSalvo("Salvo com sucesso! ✓");
      setTimeout(() => setMensagemSalvo(""), 3000);
    } else {
      setMensagemSalvo("Erro ao salvar. Tente novamente.");
    }
    setSalvando(false);
  }

  const projetoAlterado =
    projetoOriginal &&
    (projeto.titulo !== projetoOriginal.titulo ||
      projeto.descricao !== projetoOriginal.descricao ||
      projeto.integrantes !== projetoOriginal.integrantes ||
      projeto.link_portfolio !== projetoOriginal.link_portfolio);

  // ── Loading ───────────────────────────────────────────────
  if (iniciando) {
    return (
      <main style={{ minHeight: "100vh", background: "#f7f4ef", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#6b7280", fontSize: 18 }}>Carregando...</p>
      </main>
    );
  }

  // ── Tela de login ─────────────────────────────────────────
  if (!autenticado) {
    return (
      <main style={{ minHeight: "100vh", background: "#f7f4ef", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px 16px" }}>
        <Link href={voltarHref} style={{ color: "#173d5c", fontWeight: 700, textDecoration: "none", alignSelf: "flex-start", maxWidth: 420, width: "100%", marginBottom: 24 }}>
          ← {voltarLabel}
        </Link>

        <div style={{ background: "white", border: "1px solid #d8c7a1", borderRadius: 24, padding: "36px 32px", width: "100%", maxWidth: 420, boxShadow: "0 12px 36px rgba(0,0,0,0.10)" }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <img src="/logo-benjamin.png" alt="Logo" style={{ width: 72, height: "auto", margin: "0 auto 16px", display: "block" }} />
            <p style={{ margin: 0, color: "#a6782a", fontSize: 12, fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase" }}>
              Mostra Cultural e de Itinerários Formativos 2026
            </p>
            <h1 style={{ margin: "12px 0 4px", fontSize: 26, fontWeight: 800, color: "#172033" }}>
              {iconArea} {labelArea}
            </h1>
            <p style={{ margin: 0, fontSize: 15, color: "#4b5563", fontWeight: 600 }}>{nome}</p>
            <p style={{ margin: "8px 0 0", fontSize: 13, color: "#9ca3af" }}>
              {tipo === "professor"
                ? "Acesso exclusivo para professores da turma."
                : "Entre com a senha fornecida pelo seu professor."}
            </p>
          </div>

          <form onSubmit={fazerLogin} style={{ display: "grid", gap: 16 }}>
            <div>
              <label style={lbl}>Senha {tipo === "professor" ? "do professor" : "da turma"}</label>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                style={inp}
              />
            </div>

            {erroLogin && (
              <p style={{ margin: 0, padding: "10px 14px", background: "#fff0f0", border: "1px solid #fca5a5", borderRadius: 10, color: "#dc2626", fontSize: 14, fontWeight: 600 }}>
                {erroLogin}
              </p>
            )}

            <button
              type="submit"
              disabled={carregandoLogin}
              style={{ background: "#173d5c", color: "white", border: 0, borderRadius: 999, padding: "14px", fontWeight: 800, fontSize: 16, cursor: carregandoLogin ? "wait" : "pointer", opacity: carregandoLogin ? 0.7 : 1 }}
            >
              {carregandoLogin ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>
      </main>
    );
  }

  // ── Área autenticada ──────────────────────────────────────
  return (
    <main style={{ minHeight: "100vh", background: "#f7f4ef", color: "#172033" }}>
      {/* Header */}
      <header className="page-header" style={{ background: "#173d5c", borderBottom: "1px solid #0f2a40" }}>
        <div style={{ maxWidth: 1800, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div>
            <Link href={voltarHref} style={{ color: "#d8ecf7", fontWeight: 700, textDecoration: "none", fontSize: 14 }}>
              ← {voltarLabel}
            </Link>
            <p style={{ margin: "16px 0 0", color: "#f4d28c", fontSize: 12, fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase" }}>
              Mostra Cultural e de Itinerários Formativos 2026
            </p>
            <h1 style={{ margin: "8px 0 2px", fontSize: 26, fontWeight: 800, color: "white", lineHeight: 1.1 }}>
              {iconArea} {labelArea}
            </h1>
            <p style={{ margin: 0, fontSize: 15, color: "#d8ecf7" }}>{nome}</p>
          </div>
          <button onClick={sair} style={{ background: "transparent", color: "#d8ecf7", border: "1.5px solid #4a7a9b", borderRadius: 999, padding: "8px 20px", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
            Sair
          </button>
        </div>

        {/* Abas */}
        <div style={{ maxWidth: 1800, margin: "20px auto 0", display: "flex", gap: 4 }}>
          {(["projeto", "kanban"] as const).map((a) => (
            <button
              key={a}
              onClick={() => setAba(a)}
              style={{ background: aba === a ? "white" : "transparent", color: aba === a ? "#173d5c" : "#d8ecf7", border: "none", borderRadius: "12px 12px 0 0", padding: "10px 22px", fontWeight: 800, fontSize: 14, cursor: "pointer", transition: "all 0.15s" }}
            >
              {a === "projeto" ? (tipo === "professor" ? "📝 Nosso Projeto" : "📝 Nosso Projeto") : "📋 Quadro de Tarefas"}
            </button>
          ))}
        </div>
      </header>

      {/* Aba Projeto */}
      {aba === "projeto" && (
        <section style={{ padding: "28px 16px", maxWidth: 860, margin: "0 auto" }}>
          <div style={{ background: "white", border: "1px solid #d8c7a1", borderRadius: 24, padding: "28px 28px 24px", boxShadow: "0 4px 16px rgba(0,0,0,0.06)" }}>
            <p style={{ margin: "0 0 4px", color: "#a6782a", fontSize: 12, fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase" }}>
              Informações do Projeto
            </p>
            <h2 style={{ margin: "0 0 24px", fontSize: 22, fontWeight: 800, color: "#172033" }}>
              Editar dados da turma
            </h2>

            <form onSubmit={salvarProjeto} style={{ display: "grid", gap: 18 }}>
              <div>
                <label style={lbl}>Título do projeto</label>
                <input value={projeto.titulo} onChange={(e) => setProjeto({ ...projeto, titulo: e.target.value })} placeholder="Ex: Bioeconomia e sustentabilidade" style={inp} />
              </div>

              <div>
                <label style={lbl}>Integrantes da turma</label>
                <textarea value={projeto.integrantes} onChange={(e) => setProjeto({ ...projeto, integrantes: e.target.value })} placeholder="Um nome por linha ou separados por vírgula" rows={4} style={{ ...inp, resize: "vertical" }} />
              </div>

              <div>
                <label style={lbl}>Descrição / resumo do projeto</label>
                <textarea value={projeto.descricao} onChange={(e) => setProjeto({ ...projeto, descricao: e.target.value })} placeholder="Descreva o projeto, objetivos e o que será apresentado na Mostra" rows={5} style={{ ...inp, resize: "vertical" }} />
              </div>

              <div>
                <label style={lbl}>Link do portfólio ou apresentação (opcional)</label>
                <input value={projeto.link_portfolio} onChange={(e) => setProjeto({ ...projeto, link_portfolio: e.target.value })} placeholder="https://..." type="url" style={inp} />
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", paddingTop: 4 }}>
                <button
                  type="submit"
                  disabled={salvando || !projetoAlterado}
                  style={{ background: projetoAlterado ? "#173d5c" : "#e5e7eb", color: projetoAlterado ? "white" : "#9ca3af", border: 0, borderRadius: 999, padding: "12px 28px", fontWeight: 800, fontSize: 15, cursor: projetoAlterado && !salvando ? "pointer" : "default", transition: "all 0.2s" }}
                >
                  {salvando ? "Salvando..." : "Salvar alterações"}
                </button>
                {mensagemSalvo && (
                  <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: mensagemSalvo.includes("Erro") ? "#dc2626" : "#059669" }}>
                    {mensagemSalvo}
                  </p>
                )}
              </div>
            </form>
          </div>
        </section>
      )}

      {/* Aba Kanban */}
      {aba === "kanban" && (
        <div style={{ padding: "24px 16px", maxWidth: 1800, margin: "0 auto" }}>
          <KanbanBoard sigla={codigo} />
        </div>
      )}
    </main>
  );
}

const lbl: React.CSSProperties = { display: "block", fontWeight: 700, fontSize: 13, color: "#173d5c", marginBottom: 6, textAlign: "left" };
const inp: React.CSSProperties = { width: "100%", border: "1px solid #d8c7a1", borderRadius: 10, padding: "10px 14px", fontSize: 15, boxSizing: "border-box", background: "white" };
