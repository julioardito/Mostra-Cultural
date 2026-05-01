import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

export default async function ProjetosDashboardPage() {
  const { data: projetos, error } = await supabase
    .from("projetos")
    .select(`
      *,
      itinerario:itinerarios!projetos_itinerario_id_fkey(nome, sigla),
      turma:turmas!projetos_turma_id_fkey(nome),
      espaco:espacos!projetos_espaco_id_fkey(nome)
    `)
    .order("criado_em", { ascending: false });

  if (error) {
    return <main className="p-10">Erro: {error.message}</main>;
  }

  return (
    <main className="min-h-screen p-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">Projetos cadastrados</h1>
          <p className="mt-2 text-gray-600">
            Área interna para acompanhar os projetos da Mostra.
          </p>
        </div>

        <Link
          href="/dashboard/projetos/novo"
          className="rounded bg-black px-5 py-2 text-white"
        >
          Novo projeto
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border">
        <table className="w-full border-collapse text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Título</th>
              <th className="p-3">Itinerário</th>
              <th className="p-3">Turma</th>
              <th className="p-3">Espaço</th>
              <th className="p-3">Status</th>
              <th className="p-3">Publicado</th>
              <th className="p-3">Ações</th>
            </tr>
          </thead>

          <tbody>
            {projetos?.map((proj) => (
              <tr key={proj.id} className="border-t">
                <td className="p-3 font-semibold">{proj.titulo}</td>

                <td className="p-3">
                  {proj.itinerario?.nome} ({proj.itinerario?.sigla})
                </td>

                <td className="p-3">{proj.turma?.nome}</td>

                <td className="p-3">{proj.espaco?.nome}</td>

                <td className="p-3">{proj.status}</td>

                <td className="p-3">
                  {proj.publicado ? "Sim" : "Não"}
                </td>

                <td className="p-3">
                  <Link
                    href={`/dashboard/projetos/${proj.id}/editar`}
                    className="text-blue-600 hover:underline"
                  >
                    Editar
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}