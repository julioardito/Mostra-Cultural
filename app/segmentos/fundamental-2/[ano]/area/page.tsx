import AreaAcesso from "@/app/components/area/AreaAcesso";

type Props = { params: Promise<{ ano: string }> };

const anoInfo: Record<string, string> = {
  "6-ano": "6º Ano — Ensino Fundamental 2",
  "7-ano": "7º Ano — Ensino Fundamental 2",
  "8-ano": "8º Ano — Ensino Fundamental 2",
  "9-ano": "9º Ano — Ensino Fundamental 2",
};

const anoTitulo: Record<string, string> = {
  "6-ano": "6º Ano",
  "7-ano": "7º Ano",
  "8-ano": "8º Ano",
  "9-ano": "9º Ano",
};

// F2-6ANO, F2-7ANO, etc.
function codigoDeAno(ano: string) {
  return `F2-${ano.replace("-ano", "").toUpperCase()}ANO`;
}

export default async function AreaAlunoF2Page({ params }: Props) {
  const { ano } = await params;
  const codigo = codigoDeAno(ano);
  const nome = anoInfo[ano] ?? ano;
  const titulo = anoTitulo[ano] ?? ano;

  return (
    <AreaAcesso
      codigo={codigo}
      nome={nome}
      tipo="aluno"
      voltarHref={`/segmentos/fundamental-2/${ano}`}
      voltarLabel={`Voltar para ${titulo}`}
    />
  );
}
