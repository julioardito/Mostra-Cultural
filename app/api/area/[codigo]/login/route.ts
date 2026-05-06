import { supabaseServer as supabase } from "@/lib/supabase/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ codigo: string }> }
) {
  const { codigo } = await params;
  const { senha } = await req.json();

  if (!senha?.trim()) {
    return Response.json({ erro: "Senha não informada." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("area_acesso")
    .select("senha")
    .eq("codigo", codigo)
    .single();

  if (error || !data) {
    return Response.json({ erro: "Área não configurada para esta turma." }, { status: 404 });
  }

  if (data.senha !== senha.trim()) {
    return Response.json({ erro: "Senha incorreta. Verifique com seu professor." }, { status: 401 });
  }

  return Response.json({ ok: true });
}
