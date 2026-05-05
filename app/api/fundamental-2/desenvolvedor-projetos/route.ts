import { GoogleGenAI } from "@google/genai";

type Acao =
  | "gerar_duas_propostas"
  | "gerar_outra_versao"
  | "comparar_propostas"
  | "plano_de_aula"
  | "checklist_mostra"
  | "roteiro_fala";

const MARCADOR_FINAL = "<<<FIM_DA_RESPOSTA>>>";

const apiKeys = [
  { nome: "PAGA", key: process.env.GEMINI_API_KEY_PAGA },
  { nome: "GRATUITA", key: process.env.GEMINI_API_KEY_GRATUITA },
].filter((item) => item.key) as { nome: string; key: string }[];

const modelos = ["gemini-2.5-flash", "gemini-2.5-flash-lite"];

function propostaOffline(ano: string, tema: string) {
  const temaFinal = tema || "Socioecologia e Resiliência";
  return `
AVISO
O assistente está temporariamente instável. Abaixo segue uma versão gerada pelo modo seguro da plataforma.

PROPOSTA A — INVESTIGAÇÃO CIENTÍFICA E ANÁLISE CRÍTICA

1. Título do projeto
${temaFinal}: um olhar crítico da ciência

2. Público-alvo
${ano} do Ensino Fundamental 2.

3. Pergunta norteadora
Como a ciência pode nos ajudar a compreender e enfrentar os desafios socioambientais da nossa realidade?

4. Problema real ou situação disparadora
Estudantes do Fundamental 2 têm capacidade crescente de análise crítica, mas frequentemente não conectam o conhecimento científico com problemas reais de sua comunidade.

5. Justificativa pedagógica
O projeto articula investigação científica, pensamento crítico e protagonismo estudantil, estimulando os alunos a produzirem conhecimento com impacto real.

6. Objetivos de aprendizagem
- Investigar questões socioambientais com rigor científico.
- Coletar, organizar e interpretar dados.
- Propor soluções fundamentadas em evidências.
- Comunicar resultados com clareza e argumentação.

7. Componentes curriculares envolvidos
Ciências, Geografia, Matemática (estatística), Língua Portuguesa e Arte.

8. Etapas do projeto
1. Levantamento de hipóteses sobre o tema.
2. Pesquisa e coleta de dados (campo e fontes).
3. Análise crítica dos dados coletados.
4. Construção do produto final.
5. Ensaio da apresentação.
6. Apresentação na Mostra Cultural.

9. Produto final para a Mostra Cultural
Painel de dados, infográfico ou experimento interativo com resultados da investigação.

10. Aplicação real ou interação com visitantes
Visitantes participam de uma pergunta-problema e recebem os dados coletados pelos alunos.

11. Como os alunos participam ativamente
Pesquisam, analisam, debatem, produzem e apresentam para o público.

12. Como envolver as famílias
Famílias contribuem com relatos e experiências sobre o tema investigado.

13. Materiais necessários
Computadores ou tablets, cartolinas, materiais de laboratório, câmeras, planilhas.

14. Registros do processo
Diário de bordo, gráficos, fotografias, relatório final e portfólio digital.

15. Critérios de avaliação
Rigor investigativo, capacidade de argumentação, colaboração, comunicação e impacto da proposta.

16. Cuidados pedagógicos e de segurança
Orientar sobre fontes confiáveis de pesquisa e segurança em atividades de campo.

17. Sugestão de fala dos alunos
"Investigamos esse problema porque acreditamos que dados reais são o ponto de partida para mudanças reais."

18. Possível desdobramento após a Mostra
Publicar os resultados em mural digital da escola ou encaminhar à comunidade.

<<<FIM_DA_RESPOSTA>>>`;
}

function maxTokensPorAcao(acao: Acao) {
  if (acao === "gerar_duas_propostas") return 14000;
  if (acao === "gerar_outra_versao") return 8000;
  if (acao === "comparar_propostas") return 7000;
  if (acao === "plano_de_aula") return 9000;
  if (acao === "checklist_mostra") return 5000;
  if (acao === "roteiro_fala") return 5000;
  return 9000;
}

function montarPrompt(
  acao: Acao,
  ano: string,
  tema: string,
  contexto: string,
  conteudoAtual: string
) {
  const temaFinal = tema || "Socioecologia e Resiliência";

  const base = `
Você é um agente pedagógico especialista em Ensino Fundamental 2 (6º ao 9º ano), Aprendizagem Baseada em Projetos, pensamento crítico, interdisciplinaridade, socioecologia, educação ambiental crítica, arte, ciência, cultura escolar e Mostras Culturais escolares.

Os alunos do Ensino Fundamental 2 têm entre 11 e 15 anos. Eles são capazes de raciocínio abstrato, investigação autônoma, debate argumentativo e produção com maior complexidade do que os anos iniciais.

CONTEXTO DO EVENTO
Mostra Cultural e de Itinerários Formativos 2026.

Tema geral:
"Socioecologia e Resiliência: como a Arte e a Ciência podem ajudar a moldar um amanhã sustentável".

ANO ESCOLAR
${ano}

TEMA OU EIXO DESEJADO
${temaFinal}

CONTEXTO INFORMADO PELO PROFESSOR
${contexto || "Não informado"}

INSTRUÇÕES PARA GERAÇÃO
- Use linguagem profissional e pedagógica adequada para professores de Ensino Fundamental 2.
- Projetos devem ter complexidade e profundidade adequadas à faixa etária (11-15 anos).
- Estimule pensamento crítico, investigação autônoma e protagonismo estudantil real.
- Integre habilidades da BNCC para o Ensino Fundamental 2.
- Não use Markdown, asteriscos ou símbolos de formatação.
- Escreva tudo em português brasileiro.
- Separe seções com linha em branco.
- Ao final, escreva exatamente: ${MARCADOR_FINAL}
`;

  if (acao === "gerar_duas_propostas") {
    return (
      base +
      `
TAREFA
Gere DUAS propostas pedagógicas completas e distintas para a Mostra Cultural e de Itinerários Formativos 2026, adaptadas ao ${ano} do Ensino Fundamental 2.

PROPOSTA A deve ser orientada à Investigação Científica e Análise Crítica.
PROPOSTA B deve ser orientada à Arte, Expressão Cultural e Intervenção Comunitária.

Para cada proposta, desenvolva todos os itens abaixo:

1. Título do projeto
2. Público-alvo
3. Pergunta norteadora
4. Problema real ou situação disparadora
5. Justificativa pedagógica
6. Objetivos de aprendizagem
7. Componentes curriculares envolvidos (com habilidades BNCC)
8. Etapas do projeto
9. Produto final para a Mostra Cultural
10. Aplicação real ou interação com visitantes
11. Como os alunos participam ativamente
12. Como envolver as famílias
13. Materiais necessários
14. Registros do processo
15. Critérios de avaliação
16. Cuidados pedagógicos
17. Sugestão de fala dos alunos na Mostra
18. Possível desdobramento após a Mostra
`
    );
  }

  if (acao === "gerar_outra_versao") {
    return (
      base +
      `
TAREFA
Gere uma versão alternativa e criativa da proposta abaixo, mantendo o tema mas explorando uma abordagem diferente.

PROPOSTA ATUAL:
${conteudoAtual}
`
    );
  }

  if (acao === "comparar_propostas") {
    return (
      base +
      `
TAREFA
Compare as duas propostas abaixo de forma analítica. Avalie: complexidade, potencial de engajamento dos alunos do ${ano}, viabilidade operacional, impacto na Mostra e interdisciplinaridade. Conclua com uma recomendação fundamentada.

PROPOSTAS:
${conteudoAtual}
`
    );
  }

  if (acao === "plano_de_aula") {
    return (
      base +
      `
TAREFA
Transforme a proposta abaixo em uma sequência didática completa com pelo menos 8 aulas para o ${ano} do Ensino Fundamental 2. Para cada aula, descreva: objetivo, atividade central, recursos, avaliação formativa e conexão com a BNCC.

PROPOSTA:
${conteudoAtual}
`
    );
  }

  if (acao === "checklist_mostra") {
    return (
      base +
      `
TAREFA
Crie um checklist operacional completo para a participação do ${ano} na Mostra Cultural. Organize por fases: preparação (30, 15 e 7 dias antes), dia do evento (manhã, durante, encerramento) e pós-evento. Inclua responsáveis para cada item.

PROPOSTA DO PROJETO:
${conteudoAtual}
`
    );
  }

  if (acao === "roteiro_fala") {
    return (
      base +
      `
TAREFA
Crie um roteiro de fala para os alunos do ${ano} apresentarem o projeto na Mostra Cultural. O roteiro deve ter abertura impactante, desenvolvimento argumentativo (adequado à faixa etária de 11-15 anos), momento de interação com visitantes e encerramento. Duração: 3 a 5 minutos.

PROPOSTA DO PROJETO:
${conteudoAtual}
`
    );
  }

  return base;
}

export async function POST(req: Request) {
  const { ano, tema, contexto, acao, conteudoAtual } = await req.json();

  const prompt = montarPrompt(acao, ano, tema, contexto, conteudoAtual);
  const maxTokens = maxTokensPorAcao(acao);

  for (const apiKey of apiKeys) {
    for (const modelo of modelos) {
      try {
        const genAI = new GoogleGenAI({ apiKey: apiKey.key });

        const result = await genAI.models.generateContent({
          model: modelo,
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          config: { maxOutputTokens: maxTokens, temperature: 0.8 },
        });

        const texto = result.text ?? "";
        const razao = result.candidates?.[0]?.finishReason ?? "desconhecido";

        console.log(`[F2-IA] chave=${apiKey.nome} modelo=${modelo} fim=${razao} chars=${texto.length}`);

        if (texto.length > 200 && texto.includes(MARCADOR_FINAL)) {
          return Response.json({
            resposta: texto.replace(MARCADOR_FINAL, "").trim(),
          });
        }
      } catch (err) {
        console.error(`[F2-IA] Erro chave=${apiKey.nome} modelo=${modelo}:`, err);
      }
    }
  }

  return Response.json({ resposta: propostaOffline(ano, tema) });
}
