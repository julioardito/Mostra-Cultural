import AreaAcesso from "@/app/components/area/AreaAcesso";

export default function AreaProfessor1Page() {
  return (
    <AreaAcesso
      codigo="F1-1ANO"
      nome="1º Ano — Ensino Fundamental 1"
      tipo="professor"
      voltarHref="/segmentos/fundamental-1/1-ano"
      voltarLabel="Voltar para 1º Ano"
    />
  );
}
