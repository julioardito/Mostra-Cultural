import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

function gerarSlug(texto: string) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

async function salvarProjeto(formData: FormData) {
  "use server";

  const titulo = String(formData.get("titulo"));
  const resumo_curto = String(formData.get("resumo_curto"));
  const descricao_completa = String(formData.get("descricao_completa"));
  const itinerario_id = String(formData.get("itinerario_id"));
  const turma_id = String(formData.get("turma_id"));
  const espaco_id = String(formData.get("espaco_id"));

  const slug = gerarSlug(titulo);

  const { error } = await supabase.from("projetos").insert({
    titulo,
    slug,
    resumo_curto,
    descricao_completa,
    itinerario_id,
    turma_id,
    espaco_id,
    status: "em_desenvolvimento",
    publicado: true,
  });

  if (error) {
    throw new Error(error.message);
  }

  redirect("/");
}

export default async function NovoProjetoPage() {
  const { data: itinerarios } = await supabase.from("itinerarios").select("*");
  const { data: turmas } = await supabase.from("turmas").select("*");
  const { data: espacos } = await supabase.from("espacos").select("*");

  return (
    <main className="min-h-screen p-10">
      <h1 className="mb-6 text-4xl font-bold">Novo Projeto</h1>

      <form
        action={salvarProjeto}
        className="max-w-3xl space-y-5 rounded-xl border p-6 shadow-sm"
      >
        <div>
          <label className="mb-1 block font-semibold">Título</label>
          <input
            name="titulo"
            required
            className="w-full rounded border p-2"
          />
        </div>

        <div>
          <label className="mb-1 block font-semibold">Resumo curto</label>
          <textarea
            name="resumo_curto"
            required
            className="w-full rounded border p-2"
          />
        </div>

        <div>
          <label className="mb-1 block font-semibold">Descrição completa</label>
          <textarea
            name="descricao_completa"
            required
            className="w-full rounded border p-2"
            rows={4}
          />
        </div>

        <div>
          <label className="mb-1 block font-semibold">Itinerário</label>
          <select
            name="itinerario_id"
            required
            className="w-full rounded border p-2"
          >
            {itinerarios?.map((item) => (
              <option key={item.id} value={item.id}>
                {item.nome} ({item.sigla})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block font-semibold">Turma</label>
          <select
            name="turma_id"
            required
            className="w-full rounded border p-2"
          >
            {turmas?.map((item) => (
              <option key={item.id} value={item.id}>
                {item.nome}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block font-semibold">Espaço</label>
          <select
            name="espaco_id"
            required
            className="w-full rounded border p-2"
          >
            {espacos?.map((item) => (
              <option key={item.id} value={item.id}>
                {item.nome}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="rounded bg-black px-5 py-2 text-white">
          Salvar projeto
        </button>
      </form>
    </main>
  );
}