import {
  CATEGORIAS,
  MAX_POR_CATEGORIA,
  MIN_ESCOLHAS,
  TODAS_TURMAS,
  VIAGEM_NO_TEMPO,
  buscarAno,
} from "@/lib/conectar/perguntas";
import { PinInvalido, lerBanco, pinDaRequisicao, salvarAluno } from "@/lib/conectar/store";

/** Nome + turma de quem respondeu, de uma série (autocompletar da estação). Exige PIN. */
export async function GET(request: Request) {
  const ano = buscarAno(new URL(request.url).searchParams.get("ano") ?? "");
  try {
    const { alunos } = await lerBanco(pinDaRequisicao(request));
    return Response.json({
      nomes: alunos
        .filter((a) => !ano || a.ano === ano.id)
        .map((a) => ({ nome: a.nome, turma: a.turma }))
        .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR")),
    });
  } catch (erro) {
    if (erro instanceof PinInvalido) return Response.json({ erro: "PIN inválido" }, { status: 401 });
    console.error("[conectar] falha ao listar alunos", erro);
    return Response.json({ erro: "Banco de dados indisponível." }, { status: 503 });
  }
}

/** Recebe o formulário do aluno. Aberto: os alunos respondem antes da Mostra. */
export async function POST(request: Request) {
  const corpo = await request.json().catch(() => null);
  if (!corpo) return Response.json({ erro: "Formulário vazio." }, { status: 400 });

  const nome = String(corpo.nome ?? "").replace(/\s+/g, " ").trim().slice(0, 80);
  const turma = String(corpo.turma ?? "");
  if (nome.split(" ").length < 2) {
    return Response.json({ erro: "Escreva seu nome e sobrenome." }, { status: 400 });
  }
  if (!TODAS_TURMAS.includes(turma)) return Response.json({ erro: "Escolha sua turma." }, { status: 400 });

  // Só aceita opções que existem no formulário.
  const interesses: Record<string, string[]> = {};
  let total = 0;
  for (const cat of CATEGORIAS) {
    const recebidos: unknown[] = Array.isArray(corpo.interesses?.[cat.id]) ? corpo.interesses[cat.id] : [];
    const validos = [...new Set(recebidos.filter((i): i is string => cat.itens.includes(i as string)))];
    interesses[cat.id] = validos.slice(0, MAX_POR_CATEGORIA);
    total += interesses[cat.id].length;
  }
  if (total < MIN_ESCOLHAS) {
    return Response.json({ erro: `Escolha pelo menos ${MIN_ESCOLHAS} opções no total.` }, { status: 400 });
  }

  const viagem = VIAGEM_NO_TEMPO.opcoes.includes(corpo.viagem) ? corpo.viagem : "";

  try {
    await salvarAluno({
      nome,
      turma,
      interesses,
      viagem,
      possoEnsinar: String(corpo.possoEnsinar ?? "").replace(/\s+/g, " ").trim().slice(0, 120),
      aparecer: corpo.aparecer !== false,
    });
  } catch (erro) {
    console.error("[conectar] falha ao salvar aluno", erro);
    return Response.json({ erro: "Não foi possível salvar agora. Tente de novo em instantes." }, { status: 500 });
  }
  return Response.json({ ok: true });
}
