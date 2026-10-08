import { afinidadesEmFamilia } from "@/lib/conectar/afinidades";
import { CATEGORIAS, CATEGORIAS_PAIS, TODAS_TURMAS } from "@/lib/conectar/perguntas";
import { salvarPais } from "@/lib/conectar/store";

/** Formulário dos pais. Devolve as "afinidades em família" se o filho(a) respondeu. */
export async function POST(request: Request) {
  const corpo = await request.json().catch(() => null);
  if (!corpo) return Response.json({ erro: "Formulário vazio." }, { status: 400 });

  const texto = (v: unknown, max: number) => String(v ?? "").replace(/\s+/g, " ").trim().slice(0, max);
  const turma = TODAS_TURMAS.includes(corpo.turma) ? corpo.turma : "";

  const interesses: Record<string, string[]> = {};
  for (const cat of CATEGORIAS.filter((c) => CATEGORIAS_PAIS.includes(c.id))) {
    const recebidos: unknown[] = Array.isArray(corpo.interesses?.[cat.id]) ? corpo.interesses[cat.id] : [];
    interesses[cat.id] = [...new Set(recebidos.filter((i): i is string => cat.itens.includes(i as string)))];
  }

  try {
    const filho = await salvarPais({
      nomeResponsavel: texto(corpo.nomeResponsavel, 80),
      nomeAluno: texto(corpo.nomeAluno, 80),
      turma,
      interesses,
      avaliacao: Math.min(5, Math.max(0, Math.round(Number(corpo.avaliacao) || 0))),
      mensagem: texto(corpo.mensagem, 500),
    });
    return Response.json({ ok: true, familia: filho ? afinidadesEmFamilia(filho.nome, filho.comuns) : null });
  } catch (erro) {
    console.error("[conectar] falha ao salvar pais", erro);
    return Response.json({ erro: "Não foi possível salvar agora. Tente de novo em instantes." }, { status: 500 });
  }
}
