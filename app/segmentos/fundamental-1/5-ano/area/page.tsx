import AreaAcesso from "@/app/components/area/AreaAcesso";

export default function AreaProfessor5Page() {
  return (
    <AreaAcesso
      codigo="F1-5ANO"
      nome="5º Ano — Ensino Fundamental 1"
      tipo="professor"
      voltarHref="/segmentos/fundamental-1/5-ano"
      voltarLabel="Voltar para 5º Ano"
    />
  );
}
