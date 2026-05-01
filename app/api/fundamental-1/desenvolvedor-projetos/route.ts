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
  {
    nome: "PAGA",
    key: process.env.GEMINI_API_KEY_PAGA,
  },
  {
    nome: "GRATUITA",
    key: process.env.GEMINI_API_KEY_GRATUITA,
  },
].filter((item) => item.key) as { nome: string; key: string }[];

/*
  Como seu terminal mostrou muitos erros nos modelos 2.0,
  vamos começar pelos modelos 2.5.
*/
const modelos = ["gemini-2.5-flash", "gemini-2.5-flash-lite"];

function propostaOffline(ano: string, tema: string, contexto: string) {
  const temaFinal = tema || "Socioecologia e Resiliência";

  return `
AVISO
O assistente está temporariamente instável. Abaixo segue uma versão gerada pelo modo seguro da plataforma.

PROPOSTA A — INVESTIGAÇÃO CIENTÍFICA E OBSERVAÇÃO

1. Título do projeto
Água, cuidado e futuro sustentável

2. Público-alvo
${ano} do Ensino Fundamental 1.

3. Pergunta norteadora
Como podemos usar a água de forma consciente na escola e em casa?

4. Problema real ou situação disparadora
Muitas vezes usamos água sem perceber desperdícios em torneiras, banheiros, limpeza, alimentação e brincadeiras.

5. Justificativa pedagógica
O projeto aproxima os estudantes do tema da Mostra Cultural 2026, estimulando observação, investigação, linguagem oral, registros visuais e atitudes sustentáveis.

6. Objetivos de aprendizagem
- Reconhecer a importância da água para a vida.
- Identificar situações de desperdício.
- Registrar observações com desenhos, frases, fotos ou tabelas simples.
- Propor atitudes de cuidado.

7. Componentes curriculares envolvidos
Ciências, Geografia, Língua Portuguesa, Arte e Matemática.

8. Etapas do projeto
1. Roda de conversa sobre usos da água.
2. Caminhada investigativa pela escola.
3. Registro das descobertas.
4. Criação de cartazes e maquetes.
5. Ensaio da explicação dos alunos.
6. Apresentação na Mostra Cultural.

9. Produto final para a Mostra Cultural
Exposição interativa com cartazes, maquetes, dicas de economia e painel de compromissos sustentáveis.

10. Aplicação real ou interação com visitantes
Visitantes deixam uma atitude concreta para economizar água em casa.

11. Como os alunos participam ativamente
Observam, desenham, registram, constroem materiais e explicam o projeto.

12. Como envolver as famílias
As famílias podem enviar exemplos de economia de água e materiais recicláveis.

13. Materiais necessários
Cartolina, papel kraft, materiais recicláveis, cola, tesoura sem ponta, lápis de cor e imagens.

14. Registros do processo
Fotos, desenhos, frases coletivas, mural de descobertas e portfólio.

15. Critérios de avaliação
Participação, colaboração, criatividade, comunicação oral e compreensão do tema.

16. Cuidados pedagógicos e de segurança
Usar materiais seguros e linguagem adequada à faixa etária.

17. Sugestão de fala dos alunos
“Olá! Nosso projeto mostra por que a água é importante e como pequenas atitudes ajudam a evitar desperdício.”

18. Possível desdobramento após a Mostra
Criar uma campanha permanente de economia de água na escola.

PROPOSTA B — ARTE, COMUNIDADE E INTERVENÇÃO

1. Título do projeto
A gotinha que queria mudar o mundo

2. Público-alvo
${ano} do Ensino Fundamental 1.

3. Pergunta norteadora
Como a arte pode nos ajudar a ensinar outras pessoas a cuidar da água?

4. Problema real ou situação disparadora
Muitas pessoas sabem que a água é importante, mas nem sempre transformam esse conhecimento em atitudes.

5. Justificativa pedagógica
A proposta une arte, ciência, oralidade e participação comunitária, permitindo que as crianças comuniquem uma mensagem socioambiental de forma lúdica.

6. Objetivos de aprendizagem
- Criar narrativas sobre cuidado ambiental.
- Expressar ideias por desenhos, personagens e dramatizações.
- Participar de uma apresentação coletiva.
- Relacionar atitudes individuais ao bem comum.

7. Componentes curriculares envolvidos
Arte, Língua Portuguesa, Ciências, Geografia e Projeto de Vida.

8. Etapas do projeto
1. Criação de uma personagem: a gotinha.
2. Produção coletiva de uma história.
3. Construção de painéis, fantoches ou maquetes.
4. Preparação de uma pequena apresentação.
5. Montagem do espaço da Mostra.
6. Interação com visitantes.

9. Produto final para a Mostra Cultural
Instalação artística com história, desenhos, personagens e convite à ação.

10. Aplicação real ou interação com visitantes
Visitantes recebem uma “missão da gotinha” para praticar em casa.

11. Como os alunos participam ativamente
Criam personagens, desenham, ensaiam falas, montam a exposição e interagem com visitantes.

12. Como envolver as famílias
As famílias ajudam a registrar atitudes sustentáveis e podem visitar o mural de compromissos.

13. Materiais necessários
Papel, tecidos, tinta, papelão, materiais recicláveis, imagens e cartões.

14. Registros do processo
Fotos, desenhos, roteiro da história, painel de compromissos e vídeos curtos.

15. Critérios de avaliação
Criatividade, participação, expressão oral, cooperação e relação com o tema.

16. Cuidados pedagógicos e de segurança
Evitar materiais pequenos para crianças menores e garantir que todos tenham participação.

17. Sugestão de fala dos alunos
“Nós criamos uma história para mostrar que cuidar da água é cuidar da vida.”

18. Possível desdobramento após a Mostra
Transformar a personagem criada em campanha interna da turma.

Tema desejado:
${temaFinal}

Contexto informado:
${contexto || "Não informado."}
`;
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
Você é um agente pedagógico especialista em Ensino Fundamental 1, Aprendizagem Baseada em Projetos, educação diferenciada, interdisciplinaridade, socioecologia, educação ambiental crítica, arte, ciência, cultura escolar, educação rizomática e Mostras Culturais escolares.

CONTEXTO DO EVENTO
Mostra Cultural 2026.

Tema geral:
“Socioecologia e Resiliência: como a Arte e a Ciência podem ajudar a moldar um amanhã sustentável”.

ANO ESCOLAR
${ano}

TEMA OU EIXO DESEJADO
${temaFinal}

CONTEXTO INFORMADO PELO PROFESSOR
${contexto || "Não informado"}

PRINCÍPIOS PEDAGÓGICOS
- Partir de uma pergunta norteadora significativa.
- Conectar o projeto a um problema real e próximo das crianças.
- Propor investigação, criação, colaboração e apresentação pública.
- Valorizar protagonismo infantil.
- Envolver escola, família, território, natureza, cultura e comunidade.
- Criar produto final bonito, viável, interativo e funcional para a Mostra Cultural.
- Evitar propostas apenas decorativas.
- Priorizar projetos que possam ser explicados pelas próprias crianças.

REGRAS DE FORMATAÇÃO
- Responda em português do Brasil.
- Não use Markdown.
- Não use símbolos como ###, **, --- ou listas com asterisco.
- Use títulos em texto simples.
- Separe seções com linhas em branco.
- Seja específico, aplicável e adequado para crianças do ${ano}.
- Não invente dados administrativos da escola.
- Evite atividades perigosas.
- Termine obrigatoriamente a resposta com o marcador: ${MARCADOR_FINAL}
`;

  if (acao === "gerar_duas_propostas") {
    return `
${base}

TAREFA
Gere DUAS propostas completas e diferentes.

A primeira deve ser:
PROPOSTA A — INVESTIGAÇÃO CIENTÍFICA E OBSERVAÇÃO

A segunda deve ser:
PROPOSTA B — ARTE, COMUNIDADE E INTERVENÇÃO

Para cada proposta, use exatamente esta estrutura:

1. Título do projeto
2. Público-alvo
3. Pergunta norteadora
4. Problema real ou situação disparadora
5. Justificativa pedagógica
6. Objetivos de aprendizagem
7. Componentes curriculares envolvidos
8. Etapas do projeto em passo a passo
9. Produto final para a Mostra Cultural
10. Aplicação real ou interação com visitantes
11. Como os alunos participam ativamente
12. Como envolver as famílias
13. Materiais necessários
14. Registros do processo
15. Critérios de avaliação
16. Cuidados pedagógicos e de segurança
17. Sugestão de fala dos alunos para apresentar aos visitantes
18. Possível desdobramento após a Mostra

As duas propostas devem ser completas, mas objetivas. Não escreva introdução conversacional. Comece diretamente por PROPOSTA A.
`;
  }

  if (acao === "gerar_outra_versao") {
    return `
${base}

TAREFA
Gere uma nova versão, diferente da anterior, mais prática, criativa e aplicável.

CONTEÚDO ANTERIOR
${conteudoAtual || "Não informado"}

Use esta estrutura:

1. Título
2. Pergunta norteadora
3. Problema real
4. Justificativa
5. Etapas
6. Produto final
7. Interação com visitantes
8. Papel dos alunos
9. Papel das famílias
10. Materiais
11. Avaliação
12. Roteiro curto de apresentação
`;
  }

  if (acao === "comparar_propostas") {
    return `
${base}

TAREFA
Compare criticamente o conteúdo abaixo.

CONTEÚDO A COMPARAR
${conteudoAtual || "Não informado"}

Organize em:

1. Proposta mais investigativa
2. Proposta mais artística
3. Maior protagonismo infantil
4. Maior viabilidade para a Mostra
5. Melhor envolvimento das famílias
6. Conexão com socioecologia e resiliência
7. Pontos fortes
8. Pontos frágeis
9. Recomendação final
10. Proposta híbrida ideal
`;
  }

  if (acao === "plano_de_aula") {
    return `
${base}

TAREFA
Transforme o conteúdo abaixo em plano de aula ou sequência didática.

CONTEÚDO BASE
${conteudoAtual || "Não informado"}

Organize em:

1. Título
2. Duração
3. Objetivo geral
4. Objetivos específicos
5. Encontros ou aulas
6. Atividades por encontro
7. Materiais
8. Mediação do professor
9. Produções dos alunos
10. Avaliação formativa
11. Preparação para a Mostra
`;
  }

  if (acao === "checklist_mostra") {
    return `
${base}

TAREFA
Crie um checklist operacional para executar o projeto na Mostra Cultural.

CONTEÚDO BASE
${conteudoAtual || "Não informado"}

Organize em:

1. Checklist pedagógico
2. Checklist de materiais
3. Checklist de montagem do espaço
4. Checklist de segurança
5. Checklist de falas dos alunos
6. Checklist de interação com visitantes
7. Checklist de registro fotográfico/documental
8. Checklist pós-Mostra
`;
  }

  return `
${base}

TAREFA
Crie um roteiro de fala dos alunos para apresentar o projeto aos visitantes.

CONTEÚDO BASE
${conteudoAtual || "Não informado"}

Organize em:

1. Fala de abertura
2. Explicação do problema
3. O que investigamos
4. O que construímos
5. O que aprendemos
6. Pergunta para o visitante
7. Convite para interação
8. Mensagem final

Use linguagem simples e adequada para crianças do ${ano}.
`;
}

function limparResposta(texto: string) {
  return texto
    .replace(MARCADOR_FINAL, "")
    .replace(/```/g, "")
    .trim();
}

async function gerarComChaveModelo(
  apiKey: string,
  modelo: string,
  prompt: string,
  maxOutputTokens: number
) {
  const ai = new GoogleGenAI({ apiKey });

  const response = await ai.models.generateContent({
    model: modelo,
    contents: prompt,
    config: {
      temperature: 0.65,
      maxOutputTokens,
    },
  });

  const texto = response.text || "";
  const finishReason =
    (response as any)?.candidates?.[0]?.finishReason || "DESCONHECIDO";

  return {
    texto,
    finishReason,
  };
}

export async function POST(req: Request) {
  const { ano, tema, contexto, acao, conteudoAtual } = await req.json();

  const acaoEscolhida: Acao = acao || "gerar_duas_propostas";
  const temaFinal = tema || "Socioecologia e Resiliência";

  if (!apiKeys.length) {
    return Response.json({
      resposta: propostaOffline(ano, temaFinal, contexto),
      origem: "offline",
    });
  }

  const prompt = montarPrompt(
    acaoEscolhida,
    ano,
    temaFinal,
    contexto,
    conteudoAtual || ""
  );

  const maxOutputTokens = maxTokensPorAcao(acaoEscolhida);

  for (const apiKey of apiKeys) {
    for (const modelo of modelos) {
      try {
        const { texto, finishReason } = await gerarComChaveModelo(
          apiKey.key,
          modelo,
          prompt,
          maxOutputTokens
        );

        const respostaCompleta = texto.includes(MARCADOR_FINAL);
        const textoLimpo = limparResposta(texto);

        if (!respostaCompleta) {
          console.error(
            `Resposta incompleta | chave ${apiKey.nome} | modelo ${modelo} | finishReason ${finishReason} | tamanho ${textoLimpo.length}`
          );

          continue;
        }

        if (textoLimpo.length > 200) {
          console.log(
            `✅ IA gerou com sucesso | chave ${apiKey.nome} | modelo ${modelo} | finishReason ${finishReason} | tamanho ${textoLimpo.length}`
          );

          return Response.json({
            resposta: textoLimpo,
            origem: "online",
            chave: apiKey.nome,
            modelo,
            finishReason,
          });
        }
      } catch (error: any) {
        const mensagem = String(error?.message || error);

        console.error(
          `Falha IA | chave ${apiKey.nome} | modelo ${modelo}:`,
          mensagem
        );
      }
    }
  }

  return Response.json({
    resposta:
      "Aviso: o assistente está temporariamente instável. Abaixo segue uma versão gerada pelo modo seguro da plataforma.\n\n" +
      propostaOffline(ano, temaFinal, contexto),
    origem: "offline",
  });
}