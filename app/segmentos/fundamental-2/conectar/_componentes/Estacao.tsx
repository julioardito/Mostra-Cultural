"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Constelacao from "./Constelacao";
import { comPin, guardarPin, lerPin } from "./pin";
import type { Indicacao } from "@/lib/conectar/afinidades";
import { buscarAno, normalizar, primeiroNome } from "@/lib/conectar/perguntas";

/** Tempo que o resultado fica na tela antes de voltar ao início. */
const RESULTADO_MS = 90_000;
/** Pausa curta com a animação — dá tempo de o aluno "ver a máquina pensar". */
const SUSPENSE_MS = 1200;

type Nome = { nome: string; turma: string };
type Estado =
  | { tela: "verificando" }
  | { tela: "bloqueado"; erro?: string }
  | { tela: "busca"; aviso?: string; sugestoes?: Nome[] }
  | { tela: "carregando" }
  | { tela: "resultado"; aluno: Nome; indicacoes: Indicacao[] };

function iniciais(nome: string) {
  const partes = nome.trim().split(/\s+/);
  return (partes[0][0] + (partes.length > 1 ? partes[partes.length - 1][0] : "")).toUpperCase();
}

export default function Estacao({ anoId }: { anoId: string }) {
  const ano = buscarAno(anoId)!;
  const [estado, setEstado] = useState<Estado>({ tela: "verificando" });
  const [pin, setPin] = useState("");
  /** PIN aceito pelo servidor (o campo acima é só o que está sendo digitado). */
  const pinAtivo = useRef("");
  const [nomes, setNomes] = useState<Nome[]>([]);
  const [turma, setTurma] = useState("");
  const [nome, setNome] = useState("");
  const [cicloTempo, setCicloTempo] = useState(0);
  const campoNome = useRef<HTMLInputElement>(null);

  const carregarNomes = useCallback(async (p: string) => {
    const r = await fetch(`/api/conectar/alunos?ano=${anoId}`, comPin(p));
    if (r.status === 401) return false;
    if (!r.ok) throw new Error("Servidor indisponível");
    setNomes((await r.json()).nomes);
    return true;
  }, [anoId]);

  // Ao abrir: tenta o PIN guardado neste computador.
  useEffect(() => {
    pinAtivo.current = lerPin();
    carregarNomes(pinAtivo.current)
      .then((ok) => setEstado(ok ? { tela: "busca" } : { tela: "bloqueado" }))
      .catch(() => setEstado({ tela: "bloqueado", erro: "Não foi possível falar com o servidor." }));
  }, [carregarNomes]);

  const novaBusca = useCallback(() => {
    setTurma("");
    setNome("");
    setEstado({ tela: "busca" });
    carregarNomes(pinAtivo.current).catch(() => undefined); // atualiza quem respondeu depois
  }, [carregarNomes]);

  // Resultado volta sozinho ao início; tocar na tela dá mais tempo.
  useEffect(() => {
    if (estado.tela !== "resultado") return;
    const t = setTimeout(novaBusca, RESULTADO_MS);
    return () => clearTimeout(t);
  }, [estado, cicloTempo, novaBusca]);

  async function desbloquear(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (await carregarNomes(pin)) {
        pinAtivo.current = pin;
        guardarPin(pin);
        setEstado({ tela: "busca" });
      } else {
        setEstado({ tela: "bloqueado", erro: "PIN incorreto." });
      }
    } catch {
      setEstado({ tela: "bloqueado", erro: "Não foi possível falar com o servidor." });
    }
  }

  async function buscar(nomeBusca: string, turmaBusca: string) {
    setEstado({ tela: "carregando" });
    try {
      const [r] = await Promise.all([
        fetch("/api/conectar/afinidades", comPin(pinAtivo.current, {
          method: "POST",
          body: JSON.stringify({ ano: anoId, nome: nomeBusca, turma: turmaBusca }),
        })),
        new Promise((ok) => setTimeout(ok, SUSPENSE_MS)),
      ]);
      if (r.status === 401) return setEstado({ tela: "bloqueado", erro: "O PIN mudou. Chame um professor." });
      const dados = await r.json();
      if (dados.tipo === "encontrado") {
        setEstado({ tela: "resultado", aluno: dados.aluno, indicacoes: dados.indicacoes });
      } else if (dados.tipo === "sugestoes") {
        setEstado({ tela: "busca", aviso: "Você é uma destas pessoas? Toque no seu nome:", sugestoes: dados.nomes });
      } else {
        setEstado({
          tela: "busca",
          aviso: "Não encontramos esse nome. Confira a turma — ou talvez você ainda não tenha respondido o formulário.",
        });
      }
    } catch {
      setEstado({ tela: "busca", aviso: "Algo deu errado na conexão. Tente de novo." });
    }
  }

  /* ---------- Telas ---------- */

  if (estado.tela === "verificando") {
    return <div className="cx-estacao" />;
  }

  if (estado.tela === "bloqueado") {
    return (
      <div className="cx-estacao">
        <main className="cx-estacao-main">
          <form className="cx-busca" onSubmit={desbloquear}>
            <Constelacao />
            <p className="cx-eyebrow" style={{ marginTop: 24 }}>Preparar estação</p>
            <h1 className="cx-title" style={{ fontSize: 40 }}>PIN dos professores</h1>
            <p className="cx-lead">Digite uma vez neste computador. Ele fica guardado para o dia todo.</p>
            <div className="cx-nome-linha" style={{ marginTop: 28 }}>
              <input
                className="cx-input"
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                autoFocus
                aria-label="PIN"
              />
              <button className="cx-btn" type="submit">Liberar</button>
            </div>
            {estado.erro && <p className="cx-erro" style={{ marginTop: 16 }}>{estado.erro}</p>}
          </form>
        </main>
      </div>
    );
  }

  if (estado.tela === "carregando") {
    return (
      <div className="cx-estacao">
        <main className="cx-estacao-main">
          <div className="cx-carregando" role="status">
            <Constelacao />
            Procurando conexões…
          </div>
        </main>
      </div>
    );
  }

  if (estado.tela === "resultado") {
    return (
      <div className="cx-estacao cx-estacao-resultado" onPointerDown={() => setCicloTempo((n) => n + 1)}>
        <div className="cx-tempo" aria-hidden="true">
          <span key={cicloTempo} style={{ animationDuration: `${RESULTADO_MS}ms` }} />
        </div>
        <main className="cx-estacao-main">
          <div className="cx-resultado-topo">
            <div>
              <p className="cx-eyebrow">Estação CONECTAR · {ano.nome}</p>
              <h1 className="cx-title">
                {primeiroNome(estado.aluno.nome)}, conheça estas pessoas
              </h1>
              <p className="cx-lead">Cinco colegas com curiosidades parecidas com as suas — e um motivo para puxar papo.</p>
            </div>
            <button type="button" className="cx-btn" onClick={novaBusca}>Nova busca</button>
          </div>

          <div className="cx-indicacoes">
            {estado.indicacoes.map((ind, i) => (
              <article key={ind.nome} className="cx-indicacao" style={{ animationDelay: `${i * 120}ms` }}>
                <div className="cx-indicacao-head">
                  <div className="cx-avatar" aria-hidden="true">{iniciais(ind.nome)}</div>
                  <div>
                    <h3>{ind.nome}</h3>
                    <div className="cx-indicacao-turma">{ind.turma}</div>
                  </div>
                </div>
                <p className="cx-motivo">{ind.motivo}</p>
                {ind.novidade && (
                  <p className="cx-extra"><strong>Algo novo:</strong> {ind.novidade}</p>
                )}
                <p className="cx-extra"><strong>Puxe papo:</strong> {ind.conversa}</p>
              </article>
            ))}
          </div>

          {estado.indicacoes.length === 0 && (
            <p className="cx-lead">Ainda há poucas respostas para comparar. Volte daqui a pouco!</p>
          )}

          <p className="cx-aviso">
            As sugestões vêm só das respostas do formulário. Não são um teste de personalidade nem
            garantia de amizade — são um convite para conversar com alguém que você talvez ainda não conheça.
          </p>
        </main>
      </div>
    );
  }

  // Tela de busca
  const chave = normalizar(nome);
  const daTurma = nomes.filter((n) => n.turma === turma);
  const autocompletar =
    chave.length >= 2
      ? daTurma
          .filter((n) => normalizar(n.nome).split(" ").some((parte) => parte.startsWith(chave)) || normalizar(n.nome).startsWith(chave))
          .slice(0, 6)
      : [];
  const sugestoes = estado.sugestoes ?? autocompletar;

  return (
    <div className="cx-estacao">
      <main className="cx-estacao-main">
        <form
          className="cx-busca"
          onSubmit={(e) => {
            e.preventDefault();
            if (turma && nome.trim()) buscar(nome, turma);
          }}
        >
          <Constelacao />
          <p className="cx-eyebrow" style={{ marginTop: 20 }}>Mostra Cultural · {ano.nome}</p>
          <h1 className="cx-title">Quem tem curiosidades parecidas com as suas?</h1>
          <p className="cx-lead">Escolha sua turma, digite seu nome e descubra cinco colegas para conhecer.</p>

          <div className="cx-passo">
            <div className="cx-passo-titulo"><span className="cx-passo-num">1</span>Sua turma</div>
            <div className="cx-turmas">
              {ano.turmas.map((t) => (
                <button
                  key={t}
                  type="button"
                  className="cx-turma"
                  aria-pressed={turma === t}
                  onClick={() => {
                    setTurma(t);
                    setEstado({ tela: "busca" });
                    setTimeout(() => campoNome.current?.focus(), 0);
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="cx-passo" style={{ opacity: turma ? 1 : 0.4 }}>
            <div className="cx-passo-titulo"><span className="cx-passo-num">2</span>Seu nome</div>
            <div className="cx-nome-linha">
              <input
                ref={campoNome}
                className="cx-input"
                value={nome}
                disabled={!turma}
                onChange={(e) => {
                  setNome(e.target.value);
                  if (estado.aviso) setEstado({ tela: "busca" });
                }}
                autoComplete="off"
                spellCheck={false}
                placeholder="Nome e sobrenome"
                aria-label="Seu nome"
              />
              <button type="submit" className="cx-btn" disabled={!turma || !nome.trim()}>
                Conectar
              </button>
            </div>

            {estado.aviso && <p className="cx-note" style={{ marginTop: 14, fontSize: 18 }}>{estado.aviso}</p>}
            {sugestoes.length > 0 && (
              <div className="cx-sugestoes">
                {sugestoes.map((s) => (
                  <button
                    key={s.turma + s.nome}
                    type="button"
                    className="cx-chip"
                    onClick={() => {
                      setNome(s.nome);
                      buscar(s.nome, s.turma);
                    }}
                  >
                    {s.nome}
                    {s.turma !== turma ? ` · ${s.turma}` : ""}
                  </button>
                ))}
              </div>
            )}
          </div>
        </form>
      </main>
    </div>
  );
}
