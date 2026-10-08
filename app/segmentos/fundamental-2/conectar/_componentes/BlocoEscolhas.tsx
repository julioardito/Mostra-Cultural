"use client";

import { maiuscula } from "@/lib/conectar/perguntas";

type Props = {
  id: string;
  titulo: string;
  ajuda: string;
  itens: string[];
  escolhidos: string[];
  onChange: (escolhidos: string[]) => void;
  /** Sem limite = undefined. Com limite 1 vira escolha única. */
  max?: number;
};

/** Um bloco de perguntas com botões de múltipla escolha, na cor da categoria. */
export default function BlocoEscolhas({ id, titulo, ajuda, itens, escolhidos, onChange, max }: Props) {
  const unica = max === 1;
  const cheio = max !== undefined && !unica && escolhidos.length >= max;

  function alternar(item: string) {
    if (escolhidos.includes(item)) onChange(escolhidos.filter((i) => i !== item));
    else if (unica) onChange([item]);
    else if (!cheio) onChange([...escolhidos, item]);
  }

  return (
    <section className="cx-bloco" style={{ ["--cat" as string]: `var(--${id})` }} aria-labelledby={`bloco-${id}`}>
      <div className="cx-bloco-head">
        <h2 id={`bloco-${id}`}>{titulo}</h2>
        {max && !unica && (
          <span className="cx-contador">
            {escolhidos.length} de {max}
          </span>
        )}
      </div>
      <p className="cx-bloco-ajuda">{ajuda}</p>
      <div className="cx-chips">
        {itens.map((item) => {
          const marcado = escolhidos.includes(item);
          return (
            <button
              key={item}
              type="button"
              className="cx-chip"
              aria-pressed={marcado}
              disabled={!marcado && cheio}
              onClick={() => alternar(item)}
            >
              {maiuscula(item)}
            </button>
          );
        })}
      </div>
    </section>
  );
}
