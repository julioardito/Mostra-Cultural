import AreaAcesso from "@/app/components/area/AreaAcesso";

export default function AreaProfessor2Page() {
  return (
    <AreaAcesso
      codigo="F1-2ANO"
      nome="2º Ano — Ensino Fundamental 1"
      tipo="professor"
      voltarHref="/segmentos/fundamental-1/2-ano"
      voltarLabel="Voltar para 2º Ano"
    />
  );
}
