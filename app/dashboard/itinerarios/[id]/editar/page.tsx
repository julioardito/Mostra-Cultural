import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

type Props = {
  params: Promise<{ id: string }>;
};

async function atualizarItinerario(formData: FormData) {
  "use server";

  const id = String(formData.get("id"));

  const { error } = await supabase
    .from("itinerarios")
    .update({
      nome: String(formData.get("nome")),
      sigla: String(formData.get("sigla")),
      descricao: String(formData.get("descricao")),
      professores_responsaveis: String(formData.get("professores_responsaveis")),
      descricao_mostra: String(formData.get("descricao_mostra")),
      localizacao: String(formData.get("localizacao")),
      mapa_url: String(formData.get("mapa_url")),
      cor_hex: String(formData.get("cor_hex")),
      icone: String(formData.get("icone")),
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  redirect("/");
}

export default async function EditarItinerarioPage({ params }: Props) {
  const { id } = await params;

  const { data: itinerario, error } = await supabase
    .from("itinerarios")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !itinerario) {
    return <main className="p-10">Itinerário não encontrado.</main>;
  }

  return (
    <main className="min-h-screen bg-[#f7f4ef] p-10 text-[#172033]">
      <h1 className="mb-6 text-4xl font-bold">Editar Itinerário</h1>

      <form
        action={atualizarItinerario}
        className="max-w-3xl space-y-5 rounded-2xl border border-[#d8c7a1] bg-white p-6 shadow-sm"
      >
        <input type="hidden" name="id" value={itinerario.id} />

        <div>
          <label className="mb-1 block font-semibold">Nome do Itinerário</label>
          <input name="nome" defaultValue={itinerario.nome} className="w-full rounded border p-2" />
        </div>

        <div>
          <label className="mb-1 block font-semibold">Sigla</label>
          <input name="sigla" defaultValue={itinerario.sigla} className="w-full rounded border p-2" />
        </div>

        <div>
          <label className="mb-1 block font-semibold">Professores Responsáveis</label>
          <input
            name="professores_responsaveis"
            defaultValue={itinerario.professores_responsaveis || ""}
            className="w-full rounded border p-2"
            placeholder="Ex.: Prof. João, Profª Maria"
          />
        </div>

        <div>
          <label className="mb-1 block font-semibold">
            Descrição do Projeto na Mostra Cultural 2026
          </label>
          <textarea
            name="descricao_mostra"
            defaultValue={itinerario.descricao_mostra || ""}
            rows={6}
            className="w-full rounded border p-2"
          />
        </div>

        <div>
          <label className="mb-1 block font-semibold">Localização</label>
          <input
            name="localizacao"
            defaultValue={itinerario.localizacao || ""}
            className="w-full rounded border p-2"
            placeholder="Ex.: Sala 3, corredor azul, laboratório etc."
          />
        </div>

        <div>
          <label className="mb-1 block font-semibold">URL da imagem do mapa</label>
          <input
            name="mapa_url"
            defaultValue={itinerario.mapa_url || ""}
            className="w-full rounded border p-2"
            placeholder="Ex.: /mapas/ema3.png"
          />
          <p className="mt-1 text-sm text-gray-500">
            Por enquanto, coloque imagens na pasta public/mapas e use caminhos como /mapas/ema1.png.
          </p>
        </div>

        <div>
          <label className="mb-1 block font-semibold">Descrição curta do card</label>
          <textarea
            name="descricao"
            defaultValue={itinerario.descricao || ""}
            rows={4}
            className="w-full rounded border p-2"
          />
        </div>

        <div>
          <label className="mb-1 block font-semibold">Cor hexadecimal</label>
          <input name="cor_hex" defaultValue={itinerario.cor_hex || ""} className="w-full rounded border p-2" />
        </div>

        <div>
          <label className="mb-1 block font-semibold">Ícone</label>
          <input name="icone" defaultValue={itinerario.icone || ""} className="w-full rounded border p-2" />
        </div>

        <button className="rounded-full bg-[#0f2f4a] px-5 py-2 text-white">
          Salvar alterações
        </button>
      </form>
    </main>
  );
}