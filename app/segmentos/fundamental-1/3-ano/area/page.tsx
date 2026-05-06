import AreaAcesso from "@/app/components/area/AreaAcesso";

export default function AreaProfessor3Page() {
  return (
    <AreaAcesso
      codigo="F1-3ANO"
      nome="3º Ano — Ensino Fundamental 1"
      tipo="professor"
      voltarHref="/segmentos/fundamental-1/3-ano"
      voltarLabel="Voltar para 3º Ano"
    />
  );
}
