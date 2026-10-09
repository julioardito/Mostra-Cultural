import type { Metadata } from "next";
import "./conectar.css";

export const metadata: Metadata = {
  title: "CONECTAR · Mostra Cultural",
  description:
    "Estação CONECTAR do 6º ao 9º ano — descubra colegas com curiosidades parecidas com as suas.",
};

export default function ConectarLayout({ children }: { children: React.ReactNode }) {
  return <div className="cx">{children}</div>;
}
