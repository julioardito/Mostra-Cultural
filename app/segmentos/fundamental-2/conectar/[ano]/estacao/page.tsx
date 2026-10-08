import { notFound } from "next/navigation";
import Estacao from "../../_componentes/Estacao";
import { buscarAno } from "@/lib/conectar/perguntas";

type Props = { params: Promise<{ ano: string }> };

export default async function EstacaoPage({ params }: Props) {
  const { ano } = await params;
  if (!buscarAno(ano)) notFound();
  return <Estacao anoId={ano} />;
}
