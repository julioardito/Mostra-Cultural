import Link from "next/link";

export default function AnoPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#f7f4ef", padding: 48 }}>
      <Link href="/segmentos/fundamental-1">← Voltar</Link>

      <h1 style={{ marginTop: 32, fontSize: 48 }}>2º Ano</h1>

      <p style={{ fontSize: 20, color: "#4b5563" }}>
        Página em construção para os projetos do 28pxº ano.
      </p>
    </main>
  );
}