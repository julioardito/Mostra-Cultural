/*
 * CONECTAR — onde as respostas ficam guardadas (só roda no servidor)
 * --------------------------------------------------------------------------
 * Dois modos:
 *
 * 1. SUPABASE (padrão, e o único no site publicado) — tabelas e funções de
 *    supabase/conectar.sql. O site usa a mesma chave pública do resto da
 *    Mostra; as respostas só saem do banco com o PIN dos professores, que
 *    fica guardado no próprio Supabase.
 *
 * 2. ARQUIVO LOCAL — data/conectar.json, para testar no computador sem
 *    internet: rode com CONECTAR_ARMAZENAMENTO=arquivo. O PIN, nesse modo,
 *    vem de CONECTAR_PIN (sem ele, tudo fica aberto).
 *
 * As respostas ficam alguns segundos em memória, então cada busca na
 * estação responde rápido mesmo com muitos computadores ao mesmo tempo.
 */

import { promises as fs } from "fs";
import path from "path";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import {
  anoDaTurma,
  chaveAluno,
  normalizar,
  type RespostaAluno,
  type RespostaPais,
} from "./perguntas";

export type Banco = { alunos: RespostaAluno[]; pais: RespostaPais[] };

export class PinInvalido extends Error {
  constructor() {
    super("PIN inválido");
  }
}

const ARQUIVO = path.join(process.cwd(), "data", "conectar.json");
const VALIDADE_CACHE_MS = 15_000;

let cache: { banco: Banco; pin: string; em: number } | null = null;
let fila: Promise<unknown> = Promise.resolve();

let cliente: SupabaseClient | null = null;
function supabase(): SupabaseClient | null {
  if (process.env.CONECTAR_ARMAZENAMENTO === "arquivo") return null;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const chave = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !chave) return null;
  cliente ??= createClient(url, chave, { auth: { persistSession: false } });
  return cliente;
}

export function modoArmazenamento() {
  return supabase() ? "supabase" : "arquivo";
}

function erroDoBanco(erro: { message: string }): Error {
  return erro.message.includes("PIN_INVALIDO") ? new PinInvalido() : new Error(erro.message);
}

/* ---------- Conversão Supabase <-> app ---------- */

type LinhaAluno = {
  id: string;
  nome: string;
  turma: string;
  ano: string;
  interesses: Record<string, string[]>;
  viagem: string;
  posso_ensinar: string;
  aparecer: boolean;
  criado_em: string;
};

type LinhaPais = {
  id: string;
  nome_responsavel: string;
  nome_aluno: string;
  turma: string;
  interesses: Record<string, string[]>;
  avaliacao: number;
  mensagem: string;
  criado_em: string;
};

function deLinhaAluno(l: LinhaAluno): RespostaAluno {
  return {
    id: l.id,
    nome: l.nome,
    turma: l.turma,
    ano: l.ano,
    interesses: l.interesses,
    viagem: l.viagem,
    possoEnsinar: l.posso_ensinar,
    aparecer: l.aparecer,
    criadoEm: l.criado_em,
  };
}

function deLinhaPais(l: LinhaPais): RespostaPais {
  return {
    id: l.id,
    nomeResponsavel: l.nome_responsavel,
    nomeAluno: l.nome_aluno,
    turma: l.turma,
    interesses: l.interesses,
    avaliacao: l.avaliacao,
    mensagem: l.mensagem,
    criadoEm: l.criado_em,
  };
}

/* ---------- Leitura (exige PIN) ---------- */

async function lerArquivo(): Promise<Banco> {
  try {
    const banco = JSON.parse(await fs.readFile(ARQUIVO, "utf8")) as Partial<Banco>;
    return { alunos: banco.alunos ?? [], pais: banco.pais ?? [] };
  } catch (erro) {
    if ((erro as NodeJS.ErrnoException).code === "ENOENT") return { alunos: [], pais: [] };
    throw erro;
  }
}

/** Todas as respostas. Lança PinInvalido se o PIN não confere. */
export async function lerBanco(pin: string): Promise<Banco> {
  if (cache && cache.pin === pin && Date.now() - cache.em < VALIDADE_CACHE_MS) return cache.banco;

  const db = supabase();
  let banco: Banco;
  if (db) {
    const { data, error } = await db.rpc("conectar_dados", { p_pin: pin });
    if (error) throw erroDoBanco(error);
    const bruto = data as { alunos: LinhaAluno[]; pais: LinhaPais[] };
    banco = { alunos: bruto.alunos.map(deLinhaAluno), pais: bruto.pais.map(deLinhaPais) };
  } else {
    const esperado = process.env.CONECTAR_PIN;
    if (esperado && pin !== esperado) throw new PinInvalido();
    banco = await lerArquivo();
  }
  cache = { banco, pin, em: Date.now() };
  return banco;
}

/* ---------- Escrita (aberta: formulários) ---------- */

/** Escritas locais em fila, para dois envios juntos não se atropelarem. */
function emFila<T>(tarefa: () => Promise<T>): Promise<T> {
  const proxima = fila.then(tarefa, tarefa);
  fila = proxima.catch(() => undefined);
  return proxima;
}

async function gravarArquivo(mudar: (banco: Banco) => Banco) {
  // Na Vercel o disco é temporário: respostas gravadas ali sumiriam.
  if (process.env.VERCEL) throw new Error("CONECTAR publicado sem Supabase configurado.");
  return emFila(async () => {
    const banco = mudar(await lerArquivo());
    await fs.mkdir(path.dirname(ARQUIVO), { recursive: true });
    const temporario = `${ARQUIVO}.tmp`;
    await fs.writeFile(temporario, JSON.stringify(banco, null, 2), "utf8");
    await fs.rename(temporario, ARQUIVO);
    cache = null;
    return banco;
  });
}

/** Mesmo nome + mesma turma = mesma pessoa: a resposta nova substitui a antiga. */
export async function salvarAluno(aluno: Omit<RespostaAluno, "id" | "criadoEm" | "ano">) {
  const chave = chaveAluno(aluno.turma, aluno.nome);
  const ano = anoDaTurma(aluno.turma)?.id ?? "";
  const db = supabase();
  if (db) {
    const { error } = await db.rpc("conectar_salvar_aluno", {
      p: {
        chave,
        nome: aluno.nome,
        turma: aluno.turma,
        ano,
        interesses: aluno.interesses,
        viagem: aluno.viagem,
        posso_ensinar: aluno.possoEnsinar,
        aparecer: aluno.aparecer,
      },
    });
    if (error) throw erroDoBanco(error);
    cache = null;
    return;
  }
  await gravarArquivo((banco) => {
    const existente = banco.alunos.find((a) => chaveAluno(a.turma, a.nome) === chave);
    const novo: RespostaAluno = {
      ...aluno,
      ano,
      id: existente?.id ?? crypto.randomUUID(),
      criadoEm: new Date().toISOString(),
    };
    return {
      ...banco,
      alunos: existente ? banco.alunos.map((a) => (a === existente ? novo : a)) : [...banco.alunos, novo],
    };
  });
}

/**
 * Salva a resposta da família. Se encontrar o(a) filho(a) pelo nome (um único
 * aluno da turma cujo nome começa com o digitado), devolve só os interesses
 * que os dois têm em comum — nunca as respostas completas do aluno.
 */
export async function salvarPais(
  resposta: Omit<RespostaPais, "id" | "criadoEm">,
): Promise<{ nome: string; comuns: Record<string, string[]> } | null> {
  const nomeNorm = normalizar(resposta.nomeAluno);
  const prefixo = resposta.turma && nomeNorm ? `${resposta.turma}|${nomeNorm}` : "";
  const db = supabase();
  if (db) {
    const { data, error } = await db.rpc("conectar_salvar_pais", {
      p: {
        nome_responsavel: resposta.nomeResponsavel,
        nome_aluno: resposta.nomeAluno,
        turma: resposta.turma,
        interesses: resposta.interesses,
        avaliacao: resposta.avaliacao,
        mensagem: resposta.mensagem,
        chave_prefixo: prefixo,
      },
    });
    if (error) throw erroDoBanco(error);
    cache = null;
    return (data as { nome: string; comuns: Record<string, string[]> } | null) ?? null;
  }

  const banco = await gravarArquivo((b) => ({
    ...b,
    pais: [...b.pais, { ...resposta, id: crypto.randomUUID(), criadoEm: new Date().toISOString() }],
  }));
  if (!prefixo) return null;
  const achados = banco.alunos.filter((a) => chaveAluno(a.turma, a.nome).startsWith(prefixo));
  if (achados.length !== 1) return null;
  const comuns: Record<string, string[]> = {};
  for (const [cat, itens] of Object.entries(achados[0].interesses)) {
    const dosPais = new Set(resposta.interesses[cat] ?? []);
    const iguais = itens.filter((i) => dosPais.has(i));
    if (iguais.length) comuns[cat] = iguais;
  }
  return { nome: achados[0].nome, comuns };
}

export async function apagarAluno(pin: string, id: string) {
  const db = supabase();
  if (db) {
    const { error } = await db.rpc("conectar_apagar_aluno", { p_pin: pin, p_id: id });
    if (error) throw erroDoBanco(error);
    cache = null;
    return;
  }
  await lerBanco(pin); // confere o PIN
  await gravarArquivo((banco) => ({ ...banco, alunos: banco.alunos.filter((a) => a.id !== id) }));
}

/** PIN enviado pela tela (cabeçalho x-conectar-pin). */
export function pinDaRequisicao(request: Request) {
  return request.headers.get("x-conectar-pin") ?? "";
}
