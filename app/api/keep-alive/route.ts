import { supabase } from "@/lib/supabase/client";

// Rota chamada pelo cron do Vercel (definido em vercel.json)
// diariamente para manter o projeto Supabase acordado — o plano
// free do Supabase pausa projetos após 7 dias sem consultas.
export async function GET() {
  const { data, error } = await supabase
    .from("itinerarios")
    .select("sigla")
    .limit(1);

  if (error) {
    return Response.json(
      { ok: false, erro: error.message, timestamp: new Date().toISOString() },
      { status: 500 }
    );
  }

  return Response.json({
    ok: true,
    linhas: data?.length ?? 0,
    timestamp: new Date().toISOString(),
  });
}
