import { supabase } from "@/lib/supabase/client";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ sigla: string }> }
) {
  const { sigla } = await params;
  const { senha } = await req.json();

  if (!senha?.trim()) {
    return Response.json({ erro: "Senha não informada." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("itinerarios")
    .select("senha_alunos")
    .eq("sigla", sigla)
    .single();

  if (error || !data) {
    return Response.json({ erro: "Itinerário não encontrado." }, { status: 404 });
  }

  if (!data.senha_alunos) {
    return Response.json({ erro: "Área do aluno não configurada para este itinerário." }, { status: 403 });
  }

  if (data.senha_alunos !== senha.trim()) {
    return Response.json({ erro: "Senha incorreta. Verifique com seu professor." }, { status: 401 });
  }

  return Response.json({ ok: true });
}
