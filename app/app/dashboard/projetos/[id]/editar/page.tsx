import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

type Props = {
  params: Promise<{ id: string }>;
};

async function atualizarProjeto(formData: FormData) {
  "use server";

  const id = String(formData.get("id"));

  const { error } = await supabase
    .from("projetos")
    .update({
      titulo: formData.get("titulo"),
      resumo_curto: formData.get("resumo_curto"),
      descricao_completa: formData.get("descricao_completa"),
      status: formData.get("status"),
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  redirect("/dashboard/projetos");
}

export default async function EditarProjeto({ params }: Props) {
  const { id } = await params;

  const { data: projeto } = await supabase
    .from("projetos")
    .select("*")
    .eq("id", id)
    .single();

  return (
    <main className="min-h-screen p-10">
      <h1 className="mb-6 text-4xl font-bold">Editar Projeto</h1>

      <form
        action={atualizarProjeto}
        className="max-w-3xl space-y-5 border p-6 rounded-xl"
      >
        <input type="hidden" name="id" value={projeto.id} />

        <input
          name="titulo"
          defaultValue={projeto.titulo}
          className="w-full border p-2"
        />

        <textarea
          name="resumo_curto"
          defaultValue={projeto.resumo_curto}
          className="w-full border p-2"
        />

        <textarea
          name="descricao_completa"
          defaultValue={projeto.descricao_completa}
          className="w-full border p-2"
        />

        <select name="status" defaultValue={projeto.status}>
          <option value="ideia_inicial">Ideia</option>
          <option value="em_desenvolvimento">Em desenvolvimento</option>
          <option value="aprovado">Aprovado</option>
        </select>

        <button className="bg-black text-white px-4 py-2 rounded">
          Salvar
        </button>
      </form>
    </main>
  );
}