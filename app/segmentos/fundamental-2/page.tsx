import Link from "next/link";

export default function Fundamental2Page() {
  return (
    <main className="min-h-screen bg-[#f7f4ef] p-10 text-[#172033]">
      <Link href="/" className="text-[#173d5c] hover:underline">
        ← Voltar
      </Link>

      <h1 className="mt-8 text-5xl font-extrabold">
        Ensino Fundamental 2
      </h1>

      <p className="mt-4 text-xl text-gray-600">
        Página em construção para os projetos do 6º ao 9º ano.
      </p>
    </main>
  );
}