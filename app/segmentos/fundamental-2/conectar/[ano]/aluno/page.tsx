import { notFound } from "next/navigation";
import FormularioAluno from "../../_componentes/FormularioAluno";
import { buscarAno } from "@/lib/conectar/perguntas";

type Props = { params: Promise<{ ano: string }> };

export default async function QuestionarioPage({ params }: Props) {
  const { ano } = await params;
  if (!buscarAno(ano)) notFound();
  return <FormularioAluno anoId={ano} />;
}
