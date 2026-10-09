import Link from "next/link";
import Constelacao from "./_componentes/Constelacao";
import { BASE } from "./_componentes/rotas";
import { ANOS } from "@/lib/conectar/perguntas";

export default function ConectarHub() {
  return (
    <main className="cx-wrap" style={{ maxWidth: 1080 }}>
      <Link href="/segmentos/fundamental-2" className="cx-back">
        ← Voltar para Anos Finais
      </Link>

      <header className="cx-hero">
        <div>
          <p className="cx-eyebrow">Anos Finais · 6º ao 9º ano</p>
          <h1 className="cx-title">CONECTAR</h1>
          <p className="cx-lead">
            Uma estação que cruza as curiosidades dos alunos e sugere conversas e encontros
            inesperados. Não é teste de personalidade nem garantia de amizade — é um convite para
            puxar papo.
          </p>
        </div>
        <Constelacao />
      </header>

      <div className="cx-cards cx-cards-anos">
        {ANOS.map((ano) => (
          <section key={ano.id} className="cx-card cx-card-ano" style={{ ["--ano" as string]: ano.cor }}>
            <span className="cx-card-tag">{ano.turmas.join(" · ")}</span>
            <h2>{ano.nome}</h2>
            <p>Indicações sempre de colegas da mesma série.</p>
            <Link href={`${BASE}/${ano.id}/aluno`} className="cx-btn cx-btn-ano">
              Responder questionário
            </Link>
            <Link href={`${BASE}/${ano.id}/estacao`} className="cx-card-go">
              Estação do dia →
            </Link>
          </section>
        ))}
      </div>

      <Link href={`${BASE}/pais`} className="cx-card cx-card-largo">
        <span className="cx-card-tag">Para as famílias</span>
        <h2>Formulário dos pais</h2>
        <p>O que as famílias curtiam na época da escola — e o que têm em comum com os filhos.</p>
        <span className="cx-card-go">Abrir →</span>
      </Link>

      <section className="cx-como">
        <h2>Como a estação escolhe os colegas</h2>
        <ol>
          <li>Cada resposta vira uma lista de pistas: “Egito Antigo”, “desenhar”, “Cleópatra”…</li>
          <li>Pistas raras valem mais: ter “vikings” em comum diz mais do que ter “Minecraft”.</li>
          <li>O computador mede o quanto as pistas de duas pessoas se parecem e escolhe as cinco mais próximas da mesma série.</li>
          <li>Pelo menos duas sugestões vêm de outras turmas — para conhecer gente nova.</li>
        </ol>
      </section>

      <p className="cx-note" style={{ marginTop: 28 }}>
        Professores: <Link href={`${BASE}/painel`} className="cx-back">painel de respostas</Link>
      </p>
    </main>
  );
}
