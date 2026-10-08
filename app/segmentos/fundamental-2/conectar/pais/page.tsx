"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import BlocoEscolhas from "../_componentes/BlocoEscolhas";
import Constelacao from "../_componentes/Constelacao";
import { BASE } from "../_componentes/rotas";
import { ANOS, CATEGORIAS, CATEGORIAS_PAIS } from "@/lib/conectar/perguntas";

const CATS = CATEGORIAS.filter((c) => CATEGORIAS_PAIS.includes(c.id));
const vazio = () => Object.fromEntries(CATS.map((c) => [c.id, [] as string[]]));

/** Depois de enviar, a tela volta sozinha ao início para a próxima família. */
const VOLTA_EM_MS = 40_000;

export default function FormularioPais() {
  const [nomeResponsavel, setNomeResponsavel] = useState("");
  const [nomeAluno, setNomeAluno] = useState("");
  const [turma, setTurma] = useState("");
  const [interesses, setInteresses] = useState<Record<string, string[]>>(vazio);
  const [avaliacao, setAvaliacao] = useState(0);
  const [mensagem, setMensagem] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");
  const [enviado, setEnviado] = useState<{ familia: string | null } | null>(null);

  const total = Object.values(interesses).reduce((n, l) => n + l.length, 0);
  const pronto = total > 0 || avaliacao > 0 || mensagem.trim();

  function recomecar() {
    setNomeResponsavel("");
    setNomeAluno("");
    setTurma("");
    setInteresses(vazio());
    setAvaliacao(0);
    setMensagem("");
    setEnviado(null);
    window.scrollTo({ top: 0 });
  }

  useEffect(() => {
    if (!enviado) return;
    const t = setTimeout(recomecar, VOLTA_EM_MS);
    return () => clearTimeout(t);
  }, [enviado]);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (!pronto) return;
    setEnviando(true);
    setErro("");
    try {
      const r = await fetch("/api/conectar/pais", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nomeResponsavel, nomeAluno, turma, interesses, avaliacao, mensagem }),
      });
      const dados = await r.json();
      if (!r.ok) throw new Error(dados.erro ?? "Não foi possível salvar.");
      setEnviado({ familia: dados.familia });
      window.scrollTo({ top: 0 });
    } catch (falha) {
      setErro((falha as Error).message);
    } finally {
      setEnviando(false);
    }
  }

  if (enviado) {
    return (
      <main className="cx-wrap">
        <div className="cx-sucesso">
          <Constelacao />
          <h2>Obrigado pela visita!</h2>
          {enviado.familia ? (
            <>
              <p>Encontramos afinidades em família:</p>
              <p className="cx-familia">{enviado.familia}</p>
            </>
          ) : (
            <p>Sua resposta foi registrada e vai ajudar os alunos a avaliar o projeto.</p>
          )}
          <button type="button" className="cx-btn" style={{ marginTop: 28 }} onClick={recomecar}>
            Próxima família
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="cx-wrap">
      <Link href={BASE} className="cx-back">
        ← CONECTAR
      </Link>
      <p className="cx-eyebrow" style={{ marginTop: 28 }}>
        Formulário das famílias
      </p>
      <h1 className="cx-title">E na sua época de escola?</h1>
      <p className="cx-lead">
        Os alunos do 7º, 8º e 9º ano contaram o que desperta a curiosidade deles. Agora é a sua vez: o que
        você curtia na idade deles? Se informar o nome do seu filho ou filha, mostramos o que vocês
        têm em comum.
      </p>

      <form className="cx-form" onSubmit={enviar}>
        <section className="cx-bloco">
          <div className="cx-campos">
            <div>
              <label className="cx-label" htmlFor="resp">
                Seu nome (opcional)
              </label>
              <input
                id="resp"
                className="cx-input"
                value={nomeResponsavel}
                onChange={(e) => setNomeResponsavel(e.target.value)}
                autoComplete="off"
                maxLength={80}
              />
            </div>
            <div>
              <label className="cx-label" htmlFor="filho">
                Nome do(a) aluno(a) (opcional)
              </label>
              <input
                id="filho"
                className="cx-input"
                value={nomeAluno}
                onChange={(e) => setNomeAluno(e.target.value)}
                autoComplete="off"
                maxLength={80}
              />
            </div>
          </div>
          <span className="cx-label" style={{ marginTop: 18 }}>
            Turma do(a) aluno(a)
          </span>
          <div className="cx-turmas-grupos">
            {ANOS.map((ano) => (
              <div key={ano.id} className="cx-chips">
                {ano.turmas.map((t) => (
                  <button
                    key={t}
                    type="button"
                    className="cx-chip"
                    aria-pressed={turma === t}
                    onClick={() => setTurma(turma === t ? "" : t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </section>

        {CATS.map((cat) => (
          <BlocoEscolhas
            key={cat.id}
            id={cat.id}
            titulo={cat.titulo}
            ajuda={cat.id === "atividades" ? "O que você gostava de fazer quando tinha 12 ou 13 anos?" : cat.ajuda}
            itens={cat.itens}
            escolhidos={interesses[cat.id]}
            onChange={(lista) => setInteresses((atual) => ({ ...atual, [cat.id]: lista }))}
          />
        ))}

        <section className="cx-bloco">
          <span className="cx-label">O que achou da estação CONECTAR?</span>
          <div className="cx-estrelas" role="group" aria-label="Avaliação de 1 a 5">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                className="cx-estrela"
                aria-pressed={n <= avaliacao}
                aria-label={`${n} de 5`}
                onClick={() => setAvaliacao(n === avaliacao ? 0 : n)}
              >
                ★
              </button>
            ))}
          </div>

          <label className="cx-label" htmlFor="msg" style={{ marginTop: 22 }}>
            Deixe uma mensagem para os alunos (opcional)
          </label>
          <textarea
            id="msg"
            className="cx-input"
            value={mensagem}
            onChange={(e) => setMensagem(e.target.value)}
            maxLength={500}
          />
        </section>

        {erro && <p className="cx-erro">{erro}</p>}

        <div className="cx-rodape-form">
          <span className="cx-note">Leva menos de dois minutos.</span>
          <button type="submit" className="cx-btn" disabled={!pronto || enviando}>
            {enviando ? "Enviando…" : "Enviar"}
          </button>
        </div>
      </form>
    </main>
  );
}
