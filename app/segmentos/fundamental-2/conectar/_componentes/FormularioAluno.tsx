"use client";

import Link from "next/link";
import { useState } from "react";
import BlocoEscolhas from "./BlocoEscolhas";
import Constelacao from "./Constelacao";
import { BASE } from "./rotas";
import {
  CATEGORIAS,
  MAX_POR_CATEGORIA,
  MIN_ESCOLHAS,
  VIAGEM_NO_TEMPO,
  buscarAno,
} from "@/lib/conectar/perguntas";

const vazio = () => Object.fromEntries(CATEGORIAS.map((c) => [c.id, [] as string[]]));

export default function FormularioAluno({ anoId }: { anoId: string }) {
  const ano = buscarAno(anoId)!;
  const [nome, setNome] = useState("");
  const [turma, setTurma] = useState("");
  const [interesses, setInteresses] = useState<Record<string, string[]>>(vazio);
  const [viagem, setViagem] = useState("");
  const [possoEnsinar, setPossoEnsinar] = useState("");
  const [aparecer, setAparecer] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");
  const [enviado, setEnviado] = useState(false);

  const total = Object.values(interesses).reduce((n, l) => n + l.length, 0);
  const faltam = Math.max(0, MIN_ESCOLHAS - total);
  const nomeOk = nome.trim().split(/\s+/).length >= 2;
  const pronto = nomeOk && turma && faltam === 0;

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (!pronto) return;
    setEnviando(true);
    setErro("");
    try {
      const r = await fetch("/api/conectar/alunos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, turma, interesses, viagem, possoEnsinar, aparecer }),
      });
      const dados = await r.json();
      if (!r.ok) throw new Error(dados.erro ?? "Não foi possível salvar.");
      setEnviado(true);
      window.scrollTo({ top: 0 });
    } catch (falha) {
      setErro((falha as Error).message);
    } finally {
      setEnviando(false);
    }
  }

  function recomecar() {
    setNome("");
    setTurma("");
    setInteresses(vazio());
    setViagem("");
    setPossoEnsinar("");
    setAparecer(true);
    setEnviado(false);
  }

  if (enviado) {
    return (
      <main className="cx-wrap">
        <div className="cx-sucesso">
          <Constelacao />
          <h2>Respostas guardadas!</h2>
          <p>
            No dia da Mostra Cultural, vá até a estação CONECTAR, digite seu nome e descubra quem
            tem curiosidades parecidas com as suas.
          </p>
          <p className="cx-note" style={{ marginTop: 16 }}>
            Quer mudar alguma coisa? É só responder de novo com o mesmo nome e turma.
          </p>
          <button type="button" className="cx-btn" style={{ marginTop: 28 }} onClick={recomecar}>
            Próximo aluno
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
        Questionário CONECTAR · {ano.nome}
      </p>
      <h1 className="cx-title">O que desperta a sua curiosidade?</h1>
      <p className="cx-lead">
        Escolha até {MAX_POR_CATEGORIA} opções em cada bloco — só o que você realmente curte. Não
        existe resposta certa; quanto mais sincero, melhores as conexões no dia da Mostra.
      </p>

      <form className="cx-form" onSubmit={enviar}>
        <section className="cx-bloco">
          <div className="cx-campos">
            <div>
              <label className="cx-label" htmlFor="nome">
                Nome e sobrenome
              </label>
              <input
                id="nome"
                className="cx-input"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                autoComplete="off"
                maxLength={80}
                placeholder="Como você vai digitar no dia"
              />
            </div>
            <div>
              <span className="cx-label">Turma</span>
              <div className="cx-chips">
                {ano.turmas.map((t) => (
                  <button
                    key={t}
                    type="button"
                    className="cx-chip"
                    aria-pressed={turma === t}
                    onClick={() => setTurma(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {CATEGORIAS.map((cat) => (
          <BlocoEscolhas
            key={cat.id}
            id={cat.id}
            titulo={cat.titulo}
            ajuda={cat.ajuda}
            itens={cat.itens}
            max={MAX_POR_CATEGORIA}
            escolhidos={interesses[cat.id]}
            onChange={(lista) => setInteresses((atual) => ({ ...atual, [cat.id]: lista }))}
          />
        ))}

        <BlocoEscolhas
          id="viagem"
          titulo="Viagem no tempo"
          ajuda={VIAGEM_NO_TEMPO.titulo}
          itens={VIAGEM_NO_TEMPO.opcoes}
          max={1}
          escolhidos={viagem ? [viagem] : []}
          onChange={(lista) => setViagem(lista[0] ?? "")}
        />

        <section className="cx-bloco">
          <label className="cx-label" htmlFor="ensinar">
            Algo que você sabe fazer e poderia ensinar a um colega (opcional)
          </label>
          <input
            id="ensinar"
            className="cx-input"
            value={possoEnsinar}
            onChange={(e) => setPossoEnsinar(e.target.value)}
            maxLength={120}
            placeholder="Ex.: dobrar origami, uma manobra de skate, um acorde no violão"
          />
          <p className="cx-note">Isso aparece para os colegas como dica para puxar conversa.</p>

          <label className="cx-check" style={{ marginTop: 18 }}>
            <input type="checkbox" checked={aparecer} onChange={(e) => setAparecer(e.target.checked)} />
            <span>
              Aceito aparecer como sugestão para outros colegas na estação (só nome, turma e os
              interesses em comum).
            </span>
          </label>
        </section>

        {erro && <p className="cx-erro">{erro}</p>}

        <div className="cx-rodape-form">
          <span className="cx-note">
            {!nomeOk
              ? "Escreva seu nome e sobrenome."
              : !turma
                ? "Escolha sua turma."
                : faltam
                  ? `Escolha mais ${faltam} ${faltam === 1 ? "opção" : "opções"}.`
                  : `${total} escolhas — tudo pronto!`}
          </span>
          <button type="submit" className="cx-btn" disabled={!pronto || enviando}>
            {enviando ? "Salvando…" : "Enviar respostas"}
          </button>
        </div>
      </form>
    </main>
  );
}
