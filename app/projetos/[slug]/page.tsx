import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProjetoPage({ params }: PageProps) {
  const { slug } = await params;

  const { data: projeto, error } = await supabase
    .from("projetos")
    .select(`
      *,
      itinerario:itinerarios!projetos_itinerario_id_fkey(nome, sigla),
      turma:turmas!projetos_turma_id_fkey(nome),
      espaco:espacos!projetos_espaco_id_fkey(nome)
    `)
    .eq("slug", slug)
    .eq("publicado", true)
    .single();

  if (error || !projeto) {
    return <main className="p-10">Projeto não encontrado</main>;
  }

  return (
    <main className="min-h-screen p-10">
      <Link href="/" className="text-sm text-gray-500 hover:underline">
        ← Voltar para projetos
      </Link>

      <section className="mt-8 max-w-4xl">
        <p className="mb-3 text-sm font-semibold text-gray-500">
          {projeto.itinerario?.nome} ({projeto.itinerario?.sigla})
        </p>

        <h1 className="mb-4 text-4xl font-bold">{projeto.titulo}</h1>

        {projeto.subtitulo && (
          <h2 className="mb-4 text-2xl text-gray-600">{projeto.subtitulo}</h2>
        )}

        <p className="mb-8 text-xl text-gray-700">{projeto.resumo_curto}</p>

        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border p-4">
            <p className="text-sm text-gray-500">Turma</p>
            <p className="font-semibold">{projeto.turma?.nome}</p>
          </div>

          <div className="rounded-xl border p-4">
            <p className="text-sm text-gray-500">Espaço</p>
            <p className="font-semibold">{projeto.espaco?.nome}</p>
          </div>

          <div className="rounded-xl border p-4">
            <p className="text-sm text-gray-500">Status</p>
            <p className="font-semibold">{projeto.status}</p>
          </div>
        </div>

        <div className="space-y-6">
          {projeto.descricao_completa && (
            <section className="rounded-xl border p-6 shadow-sm">
              <h2 className="mb-3 text-2xl font-semibold">Descrição</h2>
              <p className="text-gray-700">{projeto.descricao_completa}</p>
            </section>
          )}

          {projeto.objetivos && (
            <section className="rounded-xl border p-6 shadow-sm">
              <h2 className="mb-3 text-2xl font-semibold">Objetivos</h2>
              <p className="text-gray-700">{projeto.objetivos}</p>
            </section>
          )}

          {projeto.justificativa && (
            <section className="rounded-xl border p-6 shadow-sm">
              <h2 className="mb-3 text-2xl font-semibold">Justificativa</h2>
              <p className="text-gray-700">{projeto.justificativa}</p>
            </section>
          )}

          {projeto.relacao_tema && (
            <section className="rounded-xl border p-6 shadow-sm">
              <h2 className="mb-3 text-2xl font-semibold">
                Relação com o tema da Mostra
              </h2>
              <p className="text-gray-700">{projeto.relacao_tema}</p>
            </section>
          )}

          {projeto.metodologia && (
            <section className="rounded-xl border p-6 shadow-sm">
              <h2 className="mb-3 text-2xl font-semibold">Metodologia</h2>
              <p className="text-gray-700">{projeto.metodologia}</p>
            </section>
          )}

          {projeto.produto_final && (
            <section className="rounded-xl border p-6 shadow-sm">
              <h2 className="mb-3 text-2xl font-semibold">Produto final</h2>
              <p className="text-gray-700">{projeto.produto_final}</p>
            </section>
          )}

          {projeto.materiais && (
            <section className="rounded-xl border p-6 shadow-sm">
              <h2 className="mb-3 text-2xl font-semibold">Materiais</h2>
              <p className="text-gray-700">{projeto.materiais}</p>
            </section>
          )}
        </div>
      </section>
    </main>
  );
}