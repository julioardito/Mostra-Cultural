/*
 * CONECTAR — motor de afinidades
 * --------------------------------------------------------------------------
 * Como funciona (dá para explicar aos alunos — é a "IA" da estação):
 *
 * 1. Cada resposta vira uma lista de "pistas": categoria + item escolhido
 *    (ex.: "epocas|Egito Antigo", "atividades|desenhar").
 * 2. Pistas RARAS valem mais que pistas comuns. Se 80% da série joga
 *    Minecraft, ter isso em comum diz pouco; se só 4 alunos escolheram
 *    "vikings", quem tem isso em comum provavelmente tem assunto para
 *    conversar. É o TF-IDF, a mesma ideia usada em buscadores.
 * 3. Cada categoria tem um peso (história e curiosidades valem mais que
 *    gosto musical — ver perguntas.ts).
 * 4. A semelhança entre dois alunos é o cosseno entre os dois vetores de
 *    pistas: 1 = idênticos, 0 = nada em comum. Assim quem marcou muitas
 *    opções não "ganha" de quem marcou poucas.
 * 5. Só entram colegas da mesma série (7º com 7º, 8º com 8º, 9º com 9º).
 *    Das cinco indicações, pelo menos duas vêm de OUTRAS turmas quando
 *    possível — a ideia é provocar encontros inesperados.
 *
 * Tudo é calculado em memória, sem internet: para ~200 alunos leva poucos
 * milissegundos por busca.
 */

import {
  CATEGORIAS,
  VIAGEM_NO_TEMPO,
  listar,
  normalizar,
  primeiroNome,
  type Categoria,
  type RespostaAluno,
} from "./perguntas";

export type Indicacao = {
  nome: string;
  turma: string;
  /** Quantas pistas em comum (não é nota — só para a tela). */
  emComum: number;
  /** "Vocês se interessam por Egito Antigo e gostam de desenhar." */
  motivo: string;
  /** Algo que o colega curte e você não marcou. */
  novidade: string | null;
  /** Dica para puxar conversa. */
  conversa: string;
};

const QUANTIDADE = 5;
const MIN_OUTRAS_TURMAS = 2;

const CATEGORIA_POR_ID = new Map(CATEGORIAS.map((c) => [c.id, c]));
const VIAGEM = "viagem";

type Pista = { chave: string; categoria: string; item: string };

function pistasDe(aluno: RespostaAluno): Pista[] {
  const pistas: Pista[] = [];
  for (const cat of CATEGORIAS) {
    for (const item of aluno.interesses[cat.id] ?? []) {
      // Ignora itens que saíram do formulário depois da resposta.
      if (cat.itens.includes(item)) {
        pistas.push({ chave: `${cat.id}|${item}`, categoria: cat.id, item });
      }
    }
  }
  if (VIAGEM_NO_TEMPO.opcoes.includes(aluno.viagem)) {
    pistas.push({ chave: `${VIAGEM}|${aluno.viagem}`, categoria: VIAGEM, item: aluno.viagem });
  }
  return pistas;
}

function pesoCategoria(categoria: string) {
  return categoria === VIAGEM ? VIAGEM_NO_TEMPO.peso : CATEGORIA_POR_ID.get(categoria)?.peso ?? 1;
}

/** Hash estável para desempatar sem favorecer sempre os mesmos nomes. */
function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

type Perfil = {
  aluno: RespostaAluno;
  pistas: Pista[];
  vetor: Map<string, number>;
  norma: number;
};

function montarPerfis(todos: RespostaAluno[]) {
  const pistasPorAluno = todos.map(pistasDe);

  // Em quantos alunos cada pista aparece.
  const frequencia = new Map<string, number>();
  for (const pistas of pistasPorAluno) {
    for (const p of pistas) frequencia.set(p.chave, (frequencia.get(p.chave) ?? 0) + 1);
  }

  const n = todos.length;
  const pesoPista = (p: Pista) =>
    pesoCategoria(p.categoria) * (Math.log((n + 1) / ((frequencia.get(p.chave) ?? 0) + 1)) + 1);

  const perfis: Perfil[] = todos.map((aluno, i) => {
    const vetor = new Map<string, number>();
    for (const p of pistasPorAluno[i]) vetor.set(p.chave, pesoPista(p));
    let soma = 0;
    for (const v of vetor.values()) soma += v * v;
    return { aluno, pistas: pistasPorAluno[i], vetor, norma: Math.sqrt(soma) };
  });

  return { perfis, pesoPista };
}

function similaridade(a: Perfil, b: Perfil) {
  if (!a.norma || !b.norma) return 0;
  let produto = 0;
  for (const [chave, v] of a.vetor) {
    const w = b.vetor.get(chave);
    if (w) produto += v * w;
  }
  return produto / (a.norma * b.norma);
}

/* ---------- Frases ---------- */

function frase(categoria: string, itens: string[], sujeito: "nos" | "ele") {
  if (categoria === VIAGEM) {
    return sujeito === "nos"
      ? `viajariam no tempo para o mesmo lugar: ${itens[0]}`
      : `viajaria no tempo para ${itens[0]}`;
  }
  const cat = CATEGORIA_POR_ID.get(categoria) as Categoria;
  return `${cat[sujeito]} ${listar(itens)}`;
}

/** Agrupa por categoria mantendo a ordem de importância. */
function agrupar(pistas: Pista[]) {
  const grupos = new Map<string, string[]>();
  for (const p of pistas) {
    const lista = grupos.get(p.categoria) ?? [];
    lista.push(p.item);
    grupos.set(p.categoria, lista);
  }
  return [...grupos];
}

function explicar(alvo: Perfil, colega: Perfil, pesoPista: (p: Pista) => number): Indicacao {
  const doAlvo = new Set(alvo.pistas.map((p) => p.chave));
  const porImportancia = (a: Pista, b: Pista) => pesoPista(b) - pesoPista(a);

  const comuns = colega.pistas.filter((p) => doAlvo.has(p.chave)).sort(porImportancia);
  // Até 3 pistas na frase, no máximo 2 da mesma categoria (frase mais variada).
  const porCategoria = new Map<string, number>();
  const destaque = comuns.filter((p) => {
    const n = porCategoria.get(p.categoria) ?? 0;
    porCategoria.set(p.categoria, n + 1);
    return n < 2;
  }).slice(0, 3);

  const motivo = destaque.length
    ? `Vocês ${listar(agrupar(destaque).map(([cat, itens]) => frase(cat, itens, "nos")))}.`
    : "Vocês têm gostos bem diferentes — uma ótima chance de descobrir algo novo.";

  const nome = primeiroNome(colega.aluno.nome);

  const diferente = colega.pistas
    .filter((p) => !doAlvo.has(p.chave) && p.categoria !== VIAGEM)
    .sort(porImportancia)[0];
  const novidade = diferente ? `${nome} ${frase(diferente.categoria, [diferente.item], "ele")}.` : null;

  let conversa: string;
  if (colega.aluno.possoEnsinar.trim()) {
    conversa = `${nome} disse que pode ensinar: “${colega.aluno.possoEnsinar.trim()}”.`;
  } else {
    const gancho = comuns.find((p) => p.categoria !== VIAGEM);
    conversa = gancho
      ? (CATEGORIA_POR_ID.get(gancho.categoria) as Categoria).conversa(gancho.item)
      : `Pergunte a ${nome} qual foi a melhor descoberta dele(a) este ano.`;
  }

  return {
    nome: colega.aluno.nome,
    turma: colega.aluno.turma,
    emComum: comuns.length,
    motivo,
    novidade,
    conversa,
  };
}

/* ---------- API do módulo ---------- */

export function calcularAfinidades(alvo: RespostaAluno, todos: RespostaAluno[]): Indicacao[] {
  // Mesma série apenas. O alvo entra no cálculo de raridade mesmo que não esteja na lista.
  const daSerie = todos.filter((a) => a.ano === alvo.ano);
  const base = daSerie.some((a) => a.id === alvo.id) ? daSerie : [...daSerie, alvo];
  const { perfis, pesoPista } = montarPerfis(base);
  const perfilAlvo = perfis.find((p) => p.aluno.id === alvo.id) as Perfil;
  const chaveAlvo = normalizar(alvo.nome);

  const candidatos = perfis
    .filter(
      (p) =>
        p.aluno.aparecer &&
        p.aluno.id !== alvo.id &&
        normalizar(p.aluno.nome) !== chaveAlvo,
    )
    .map((p) => ({ perfil: p, nota: similaridade(perfilAlvo, p), sorteio: hash(alvo.id + p.aluno.id) }))
    .sort((a, b) => b.nota - a.nota || a.sorteio - b.sorteio);

  const escolhidos = candidatos.slice(0, QUANTIDADE);

  // Garante colegas de outras turmas, trocando os mais fracos da mesma turma.
  const deOutraTurma = (c: (typeof candidatos)[number]) => c.perfil.aluno.turma !== alvo.turma;
  const reservas = candidatos.slice(QUANTIDADE).filter((c) => deOutraTurma(c) && c.nota > 0);
  let faltam = MIN_OUTRAS_TURMAS - escolhidos.filter(deOutraTurma).length;
  while (faltam > 0 && reservas.length) {
    const idxMesma = escolhidos.findLastIndex((c) => !deOutraTurma(c));
    if (idxMesma < 0) break;
    escolhidos[idxMesma] = reservas.shift()!;
    faltam--;
  }

  return escolhidos
    .sort((a, b) => b.nota - a.nota || a.sorteio - b.sorteio)
    .map((c) => explicar(perfilAlvo, c.perfil, pesoPista));
}

/** Frase das "afinidades em família", a partir só dos interesses em comum. */
export function afinidadesEmFamilia(nomeFilho: string, comunsPorCategoria: Record<string, string[]>): string | null {
  const comuns: Pista[] = [];
  for (const cat of CATEGORIAS) {
    for (const item of comunsPorCategoria[cat.id] ?? []) {
      if (cat.itens.includes(item)) comuns.push({ chave: `${cat.id}|${item}`, categoria: cat.id, item });
    }
  }
  if (!comuns.length) return null;
  const nome = primeiroNome(nomeFilho);
  return `Você e ${nome} ${listar(agrupar(comuns.slice(0, 4)).map(([cat, itens]) => frase(cat, itens, "nos")))}.`;
}

/* ---------- Encontrar o aluno pelo nome digitado ---------- */

function distancia(a: string, b: string) {
  const d = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let anterior = d[0];
    d[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const guardado = d[j];
      d[j] = Math.min(d[j] + 1, d[j - 1] + 1, anterior + (a[i - 1] === b[j - 1] ? 0 : 1));
      anterior = guardado;
    }
  }
  return d[b.length];
}

export type ResultadoBusca =
  | { tipo: "encontrado"; aluno: RespostaAluno }
  | { tipo: "sugestoes"; nomes: { nome: string; turma: string }[] }
  | { tipo: "nada" };

/**
 * Tolera acento esquecido, maiúscula e pequenos erros de digitação.
 * Se houver dúvida, devolve sugestões para o aluno tocar no nome certo.
 */
export function encontrarAluno(nome: string, turma: string, todos: RespostaAluno[]): ResultadoBusca {
  const chave = normalizar(nome);
  if (!chave) return { tipo: "nada" };

  const daTurma = todos.filter((a) => !turma || a.turma === turma);
  const exatos = daTurma.filter((a) => normalizar(a.nome) === chave);
  if (exatos.length === 1) return { tipo: "encontrado", aluno: exatos[0] };

  const parecidos = daTurma
    .map((a) => {
      const n = normalizar(a.nome);
      const pontos = n.startsWith(chave) || n.split(" ").includes(chave)
        ? 0
        : distancia(chave, n.slice(0, Math.max(chave.length, n.length)));
      return { a, pontos };
    })
    .filter((x) => x.pontos <= 2)
    .sort((x, y) => x.pontos - y.pontos)
    .slice(0, 6);

  if (parecidos.length === 1 && parecidos[0].pontos <= 2 && chave.includes(" ")) {
    return { tipo: "encontrado", aluno: parecidos[0].a };
  }
  if (parecidos.length) {
    return { tipo: "sugestoes", nomes: parecidos.map(({ a }) => ({ nome: a.nome, turma: a.turma })) };
  }
  // Turma errada? Procura nas outras, mas pede confirmação tocando no nome.
  if (turma) {
    const outras = encontrarAluno(nome, "", todos);
    if (outras.tipo === "encontrado") {
      return { tipo: "sugestoes", nomes: [{ nome: outras.aluno.nome, turma: outras.aluno.turma }] };
    }
    return outras;
  }
  return { tipo: "nada" };
}
