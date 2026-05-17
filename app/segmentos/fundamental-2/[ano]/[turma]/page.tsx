import AreaAcesso from "@/app/components/area/AreaAcesso";

type Props = { params: Promise<{ ano: string; turma: string }> };

const anoTitulo: Record<string, string> = {
  "6-ano": "6º",
  "7-ano": "7º",
  "8-ano": "8º",
  "9-ano": "9º",
};

export default async function TurmaAreaPage({ params }: Props) {
  const { ano, turma } = await params;

  const num = ano.replace("-ano", "");          // "6"
  const letra = turma.toUpperCase();             // "A"
  const codigo = `F2-${num}ANO${letra}`;         // "F2-6ANOA"
  const titulo = `${anoTitulo[ano] ?? num + "º"} Ano ${letra}`; // "6º Ano A"

  return (
    <AreaAcesso
      codigo={codigo}
      nome={`${titulo} — Ensino Fundamental (Anos Finais)`}
      tipo="aluno"
      voltarHref="/segmentos/fundamental-2"
      voltarLabel="Voltar para Anos Finais"
    />
  );
}
