import { PinInvalido, apagarAluno, lerBanco, modoArmazenamento, pinDaRequisicao } from "@/lib/conectar/store";

function falha(erro: unknown) {
  if (erro instanceof PinInvalido) return Response.json({ erro: "PIN inválido" }, { status: 401 });
  console.error("[conectar] falha no painel", erro);
  return Response.json({ erro: "Banco de dados indisponível." }, { status: 503 });
}

/** Painel dos professores: todas as respostas. Exige PIN. */
export async function GET(request: Request) {
  try {
    const banco = await lerBanco(pinDaRequisicao(request));
    return Response.json({ modo: modoArmazenamento(), ...banco });
  } catch (erro) {
    return falha(erro);
  }
}

/** Remove uma resposta de aluno (teste, duplicada ou texto inadequado). */
export async function DELETE(request: Request) {
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return Response.json({ erro: "Faltou o id." }, { status: 400 });
  try {
    await apagarAluno(pinDaRequisicao(request), id);
    return Response.json({ ok: true });
  } catch (erro) {
    return falha(erro);
  }
}
