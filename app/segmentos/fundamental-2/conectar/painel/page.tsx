"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { comPin, guardarPin, lerPin } from "../_componentes/pin";
import { BASE } from "../_componentes/rotas";
import {
  ANOS,
  CATEGORIAS,
  anoDaTurma,
  maiuscula,
  type RespostaAluno,
  type RespostaPais,
} from "@/lib/conectar/perguntas";

type Dados = {
  modo: "arquivo" | "supabase";
  alunos: RespostaAluno[];
  pais: RespostaPais[];
};

const COR = new Map(CATEGORIAS.map((c) => [c.id, `var(--${c.id})`]));

export default function Painel() {
  const [pin, setPin] = useState("");
  /** PIN aceito pelo servidor (o campo acima é só o que está sendo digitado). */
  const pinAtivo = useRef("");
  const [dados, setDados] = useState<Dados | null>(null);
  const [bloqueado, setBloqueado] = useState(false);
  const [erro, setErro] = useState("");
  const [anoId, setAnoId] = useState(ANOS[0].id);

  const carregar = useCallback(async (p: string) => {
    const r = await fetch("/api/conectar/painel", comPin(p));
    if (r.status === 401) {
      setBloqueado(true);
      return false;
    }
    setDados(await r.json());
    setBloqueado(false);
    return true;
  }, []);

  useEffect(() => {
    pinAtivo.current = lerPin();
    carregar(pinAtivo.current).catch(() => setErro("Não foi possível falar com o servidor."));
  }, [carregar]);

  async function entrar(e: React.FormEvent) {
    e.preventDefault();
    if (await carregar(pin)) {
      pinAtivo.current = pin;
      guardarPin(pin);
    } else setErro("PIN incorreto.");
  }

  async function apagar(aluno: RespostaAluno) {
    if (!confirm(`Apagar a resposta de ${aluno.nome} (${aluno.turma})? Não dá para desfazer.`)) return;
    await fetch(`/api/conectar/painel?id=${encodeURIComponent(aluno.id)}`, comPin(pinAtivo.current, { method: "DELETE" }));
    carregar(pinAtivo.current);
  }

  function baixar() {
    const blob = new Blob([JSON.stringify(dados, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `conectar-respostas-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  if (bloqueado || !dados) {
    return (
      <main className="cx-wrap">
        <Link href={BASE} className="cx-back">← CONECTAR</Link>
        <h1 className="cx-title" style={{ marginTop: 28, fontSize: 40 }}>Painel dos professores</h1>
        {bloqueado && (
          <form onSubmit={entrar} className="cx-nome-linha" style={{ marginTop: 28, maxWidth: 480 }}>
            <input
              className="cx-input"
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="PIN"
              autoFocus
              aria-label="PIN"
            />
            <button className="cx-btn" type="submit">Entrar</button>
          </form>
        )}
        {erro && <p className="cx-erro" style={{ marginTop: 16 }}>{erro}</p>}
      </main>
    );
  }

  const ano = ANOS.find((a) => a.id === anoId)!;
  const alunos = dados.alunos.filter((a) => a.ano === anoId);
  const pais = dados.pais.filter((p) => !p.turma || anoDaTurma(p.turma)?.id === anoId);

  // Interesses mais escolhidos — bom ponto de partida para conversar com a turma.
  const contagem = new Map<string, { cat: string; item: string; n: number }>();
  for (const a of alunos) {
    for (const cat of CATEGORIAS) {
      for (const item of a.interesses[cat.id] ?? []) {
        const k = `${cat.id}|${item}`;
        const atual = contagem.get(k) ?? { cat: cat.id, item, n: 0 };
        atual.n++;
        contagem.set(k, atual);
      }
    }
  }
  const ranking = [...contagem.values()].sort((a, b) => b.n - a.n).slice(0, 12);

  const ordenados = [...alunos].sort(
    (a, b) => a.turma.localeCompare(b.turma) || a.nome.localeCompare(b.nome, "pt-BR"),
  );

  return (
    <main className="cx-wrap" style={{ maxWidth: 1180 }}>
      <Link href={BASE} className="cx-back">← CONECTAR</Link>
      <div className="cx-resultado-topo">
        <div>
          <p className="cx-eyebrow" style={{ marginTop: 20 }}>Painel dos professores</p>
          <h1 className="cx-title" style={{ fontSize: 40 }}>Respostas do CONECTAR</h1>
          <p className="cx-note">
            Guardadas em: {dados.modo === "arquivo" ? "arquivo local (data/conectar.json)" : "Supabase"}
            {" · "}famílias sem turma informada aparecem em todas as séries
          </p>
        </div>
        <button type="button" className="cx-btn cx-btn-sec" onClick={baixar}>Baixar cópia (JSON)</button>
      </div>

      <div className="cx-abas" role="group" aria-label="Série">
        {ANOS.map((a) => (
          <button
            key={a.id}
            type="button"
            className="cx-chip"
            aria-pressed={a.id === anoId}
            onClick={() => setAnoId(a.id)}
          >
            {a.nome} · {dados.alunos.filter((x) => x.ano === a.id).length}
          </button>
        ))}
      </div>

      <div className="cx-stats">
        <div className="cx-stat">
          <div className="cx-stat-num">{alunos.length}</div>
          <div className="cx-stat-label">alunos do {ano.nome} responderam</div>
        </div>
        {ano.turmas.map((t) => (
          <div className="cx-stat" key={t}>
            <div className="cx-stat-num">{alunos.filter((a) => a.turma === t).length}</div>
            <div className="cx-stat-label">{t}</div>
          </div>
        ))}
        <div className="cx-stat">
          <div className="cx-stat-num">{alunos.filter((a) => !a.aparecer).length}</div>
          <div className="cx-stat-label">preferem não aparecer</div>
        </div>
        <div className="cx-stat">
          <div className="cx-stat-num">{pais.length}</div>
          <div className="cx-stat-label">famílias responderam</div>
        </div>
      </div>

      {ranking.length > 0 && (
        <section className="cx-secao">
          <h2>Mais escolhidos pelo {ano.nome}</h2>
          <div className="cx-chips" style={{ marginTop: 14 }}>
            {ranking.map((r) => (
              <span
                key={r.cat + r.item}
                className="cx-chip"
                aria-pressed="true"
                style={{ ["--cat" as string]: COR.get(r.cat), cursor: "default" }}
              >
                {maiuscula(r.item)} · {r.n}
              </span>
            ))}
          </div>
        </section>
      )}

      <section className="cx-secao">
        <h2>Alunos</h2>
        <p className="cx-note">Confira o campo “pode ensinar” — ele aparece para os colegas na estação.</p>
        <div className="cx-tabela-wrap">
          <table className="cx-tabela">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Turma</th>
                <th>Escolhas</th>
                <th>Pode ensinar</th>
                <th>Aparece?</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {ordenados.map((a) => (
                <tr key={a.id}>
                  <td>{a.nome}</td>
                  <td>{a.turma}</td>
                  <td>{Object.values(a.interesses).reduce((n, l) => n + l.length, 0)}</td>
                  <td>{a.possoEnsinar || "—"}</td>
                  <td>{a.aparecer ? "Sim" : "Não"}</td>
                  <td>
                    <button type="button" className="cx-btn cx-btn-perigo" onClick={() => apagar(a)}>
                      Apagar
                    </button>
                  </td>
                </tr>
              ))}
              {!ordenados.length && (
                <tr><td colSpan={6}>Nenhuma resposta ainda.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="cx-secao">
        <h2>Famílias</h2>
        <div className="cx-tabela-wrap">
          <table className="cx-tabela">
            <thead>
              <tr>
                <th>Responsável</th>
                <th>Aluno(a)</th>
                <th>Nota</th>
                <th>Mensagem</th>
              </tr>
            </thead>
            <tbody>
              {pais.map((p) => (
                <tr key={p.id}>
                  <td>{p.nomeResponsavel || "—"}</td>
                  <td>{p.nomeAluno ? `${p.nomeAluno}${p.turma ? ` (${p.turma})` : ""}` : "—"}</td>
                  <td>{p.avaliacao ? "★".repeat(p.avaliacao) : "—"}</td>
                  <td>{p.mensagem || "—"}</td>
                </tr>
              ))}
              {!pais.length && (
                <tr><td colSpan={4}>Nenhuma resposta ainda.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
