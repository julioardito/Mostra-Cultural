/*
 * CONECTAR — gera respostas FICTÍCIAS para testar a estação no computador.
 *
 *   node scripts/conectar-demo.mjs           cria 120 alunos de teste por série
 *   node scripts/conectar-demo.mjs --limpar  remove só os alunos de teste
 *
 * Os alunos de teste têm id começando com "demo-" e convivem com as respostas
 * reais sem apagá-las. Rode --limpar antes do dia da Mostra!
 * Só vale para o modo arquivo (data/conectar.json), ou seja, para rodar o site
 * localmente com CONECTAR_ARMAZENAMENTO=arquivo. Não mexe no Supabase.
 */

import { promises as fs } from "fs";
import path from "path";
import { ANOS, CATEGORIAS, VIAGEM_NO_TEMPO } from "../lib/conectar/perguntas.ts";

const ARQUIVO = path.join(process.cwd(), "data", "conectar.json");
const QUANTOS = 120;

const NOMES = ["Ana", "Bruno", "Clara", "Davi", "Elisa", "Felipe", "Giovana", "Heitor", "Isadora", "João",
  "Kauã", "Laura", "Miguel", "Nina", "Otávio", "Pietra", "Rafael", "Sofia", "Theo", "Valentina",
  "Yasmin", "Lucas", "Beatriz", "Enzo", "Lívia", "Arthur", "Helena", "Gael", "Manuela", "Samuel"];
const SOBRENOMES = ["Teste", "Exemplo", "Demo", "Ficção", "Simulado"];
const ENSINA = ["", "", "", "dobrar origami", "uma manobra de skate", "desenhar mangá", "um truque de cartas",
  "fazer brigadeiro", "acordes de violão", "atalhos no Minecraft"];

// Aleatório com semente: o mesmo comando gera sempre os mesmos dados.
let semente = 7;
const aleatorio = () => ((semente = (semente * 16807) % 2147483647) - 1) / 2147483646;
const um = (lista) => lista[Math.floor(aleatorio() * lista.length)];
const alguns = (lista, n) => [...lista].sort(() => aleatorio() - 0.5).slice(0, n);

async function ler() {
  try {
    return JSON.parse(await fs.readFile(ARQUIVO, "utf8"));
  } catch {
    return { alunos: [], pais: [] };
  }
}

const banco = await ler();
banco.alunos = banco.alunos.filter((a) => !a.id.startsWith("demo-"));

if (!process.argv.includes("--limpar")) {
  for (const ano of ANOS) for (let i = 0; i < QUANTOS; i++) {
    const interesses = {};
    for (const cat of CATEGORIAS) {
      // Cada aluno fictício tem um "gosto" mais forte nas primeiras opções, como na vida real.
      const preferidos = cat.itens.slice(0, Math.ceil(cat.itens.length / 2));
      const pool = aleatorio() < 0.6 ? preferidos : cat.itens;
      interesses[cat.id] = alguns(pool, Math.floor(aleatorio() * 4) + (aleatorio() < 0.8 ? 1 : 0));
    }
    banco.alunos.push({
      id: `demo-${ano.id}-${i}`,
      nome: `${NOMES[i % NOMES.length]} ${SOBRENOMES[Math.floor(i / NOMES.length)]}`,
      turma: ano.turmas[i % ano.turmas.length],
      ano: ano.id,
      interesses,
      viagem: um(VIAGEM_NO_TEMPO.opcoes),
      possoEnsinar: um(ENSINA),
      aparecer: aleatorio() > 0.05,
      criadoEm: new Date().toISOString(),
    });
  }
}

await fs.mkdir(path.dirname(ARQUIVO), { recursive: true });
await fs.writeFile(ARQUIVO, JSON.stringify(banco, null, 2), "utf8");
const demos = banco.alunos.filter((a) => a.id.startsWith("demo-")).length;
console.log(`Pronto: ${banco.alunos.length} alunos no arquivo (${demos} de teste). Reinicie o servidor.`);
