import { calcularAfinidades, encontrarAluno } from "@/lib/conectar/afinidades";
import { buscarAno } from "@/lib/conectar/perguntas";
import { PinInvalido, lerBanco, pinDaRequisicao } from "@/lib/conectar/store";

/**
 * Busca da estação: { ano, nome, turma } -> cinco colegas da mesma série.
 * POST (e não GET) para o nome do aluno não ficar na URL nem em logs.
 */
export async function POST(request: Request) {
  const corpo = await request.json().catch(() => ({}));
  const ano = buscarAno(String(corpo.ano ?? ""));
  if (!ano) return Response.json({ erro: "Série inválida." }, { status: 400 });

  let alunos;
  try {
    alunos = (await lerBanco(pinDaRequisicao(request))).alunos.filter((a) => a.ano === ano.id);
  } catch (erro) {
    if (erro instanceof PinInvalido) return Response.json({ erro: "PIN inválido" }, { status: 401 });
    console.error("[conectar] falha ao ler respostas", erro);
    return Response.json({ erro: "Banco de dados indisponível." }, { status: 503 });
  }

  const busca = encontrarAluno(String(corpo.nome ?? ""), String(corpo.turma ?? ""), alunos);
  if (busca.tipo === "encontrado") {
    return Response.json({
      tipo: "encontrado",
      aluno: { nome: busca.aluno.nome, turma: busca.aluno.turma },
      indicacoes: calcularAfinidades(busca.aluno, alunos),
    });
  }
  return Response.json(busca);
}
