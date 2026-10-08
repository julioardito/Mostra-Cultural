/*
 * CONECTAR — perguntas do formulário dos alunos (7º, 8º e 9º ano)
 * --------------------------------------------------------------------------
 * Fonte única: o formulário, o motor de afinidades e as frases de explicação
 * leem daqui. Para mudar uma opção, mude só aqui.
 *
 * Os itens são escritos como aparecem NO MEIO de uma frase
 * ("Vocês dois gostam de desenhar e se interessam por Egito Antigo"); a tela
 * capitaliza a primeira letra ao mostrar como botão.
 *
 * ATENÇÃO: mudar o texto de um item depois que os alunos responderem faz as
 * respostas antigas deixarem de "bater" com a nova opção.
 */

/**
 * Séries participantes. As turmas seguem a página dos Anos Finais
 * (app/segmentos/fundamental-2/page.tsx). Cada série tem sua própria estação:
 * um aluno do 8º ano só recebe indicações de colegas do 8º ano.
 */
export const ANOS = [
  { id: "7-ano", nome: "7º ano", cor: "#059669", turmas: ["7º A", "7º B", "7º C"] },
  { id: "8-ano", nome: "8º ano", cor: "#d97706", turmas: ["8º A", "8º B", "8º C", "8º D"] },
  { id: "9-ano", nome: "9º ano", cor: "#7c3aed", turmas: ["9º A", "9º B", "9º C", "9º D"] },
];

export type Ano = (typeof ANOS)[number];

export const TODAS_TURMAS = ANOS.flatMap((a) => a.turmas);

export function buscarAno(id: string): Ano | undefined {
  return ANOS.find((a) => a.id === id);
}

export function anoDaTurma(turma: string): Ano | undefined {
  return ANOS.find((a) => a.turmas.includes(turma));
}

/** Máximo de escolhas por categoria — força o aluno a escolher o que mais gosta. */
export const MAX_POR_CATEGORIA = 5;

/** Mínimo de escolhas no total para o formulário ser aceito. */
export const MIN_ESCOLHAS = 6;

export type Categoria = {
  id: string;
  titulo: string;
  ajuda: string;
  /** Peso na comparação: história e curiosidades valem mais que gosto musical. */
  peso: number;
  /** Verbo para "Vocês dois ___" e para "Fulano também ___". */
  nos: string;
  ele: string;
  /** Pergunta para puxar conversa a partir de um item em comum. */
  conversa: (item: string) => string;
  itens: string[];
};

export const CATEGORIAS: Categoria[] = [
  {
    id: "epocas",
    titulo: "Épocas e povos da história",
    ajuda: "Se você pudesse estudar só uma parte da história, qual seria?",
    peso: 1.4,
    nos: "se interessam por",
    ele: "se interessa por",
    conversa: (x) => `Se vocês pudessem visitar ${x} por um dia, o que iriam querer ver primeiro?`,
    itens: [
      "pré-história e dinossauros",
      "Egito Antigo",
      "Grécia Antiga",
      "Roma Antiga",
      "vikings",
      "Idade Média e castelos",
      "samurais e Japão antigo",
      "maias, astecas e incas",
      "povos indígenas do Brasil",
      "reinos africanos",
      "Grandes Navegações",
      "Brasil Colônia",
      "Revolução Francesa",
      "Independência do Brasil",
      "Revolução Industrial",
      "Guerras Mundiais",
      "Era Vargas",
      "Guerra Fria",
      "ditadura militar no Brasil",
      "corrida espacial",
    ],
  },
  {
    id: "personagens",
    titulo: "Personagens que despertam sua curiosidade",
    ajuda: "Pessoas reais da história, da ciência, da arte ou do esporte.",
    peso: 1.5,
    nos: "têm curiosidade sobre",
    ele: "tem curiosidade sobre",
    conversa: (x) => `Se vocês pudessem fazer uma pergunta para ${x}, qual seria?`,
    itens: [
      "Cleópatra",
      "Leonardo da Vinci",
      "Joana d'Arc",
      "Zumbi dos Palmares",
      "Dandara",
      "Dom Pedro II",
      "Santos Dumont",
      "Marie Curie",
      "Albert Einstein",
      "Frida Kahlo",
      "Napoleão",
      "Gengis Khan",
      "Machado de Assis",
      "Carolina Maria de Jesus",
      "Pelé",
      "Nelson Mandela",
      "Alexandre, o Grande",
      "Anne Frank",
      "Chiquinha Gonzaga",
      "Martin Luther King",
      "Malala Yousafzai",
    ],
  },
  {
    id: "curiosidades",
    titulo: "Assuntos que você adora descobrir",
    ajuda: "Aqueles temas que fazem você pesquisar até tarde.",
    peso: 1.3,
    nos: "querem saber mais sobre",
    ele: "quer saber mais sobre",
    conversa: (x) => `Qual é a coisa mais surpreendente que vocês já descobriram sobre ${x}?`,
    itens: [
      "o espaço",
      "animais",
      "mitologia",
      "mistérios e lendas",
      "robôs e tecnologia",
      "inteligência artificial",
      "o corpo humano",
      "meio ambiente",
      "arqueologia",
      "comidas de outros países",
      "outros idiomas",
      "moda",
      "arquitetura",
      "o fundo do mar",
      "vulcões e terremotos",
      "investigação de crimes",
    ],
  },
  {
    id: "atividades",
    titulo: "O que você gosta de fazer",
    ajuda: "No tempo livre, na escola ou com os amigos.",
    peso: 1.2,
    nos: "gostam de",
    ele: "gosta de",
    conversa: (x) => `Como cada um de vocês começou a ${x}?`,
    itens: [
      "desenhar",
      "ler",
      "escrever histórias",
      "jogar futebol",
      "jogar vôlei",
      "jogar basquete",
      "dançar",
      "cantar",
      "tocar um instrumento",
      "cozinhar",
      "andar de bike ou skate",
      "criar vídeos",
      "programar",
      "fotografar",
      "montar e construir coisas",
      "cuidar de animais",
      "nadar",
      "praticar lutas",
    ],
  },
  {
    id: "telas",
    titulo: "Filmes, séries e animes",
    ajuda: "Os gêneros que você mais assiste.",
    peso: 1.0,
    nos: "gostam de assistir",
    ele: "gosta de assistir",
    conversa: (x) => `Qual foi a última coisa de ${x} que vocês assistiram e recomendariam?`,
    itens: [
      "anime",
      "super-heróis",
      "terror",
      "comédia",
      "fantasia",
      "ficção científica",
      "documentários",
      "animações",
      "séries de mistério",
      "doramas e novelas",
      "reality shows",
      "filmes históricos",
    ],
  },
  {
    id: "jogos",
    titulo: "Jogos",
    ajuda: "Videogame, celular, tabuleiro ou cartas.",
    peso: 0.9,
    nos: "jogam",
    ele: "joga",
    conversa: (x) => `Quem ensina o melhor truque de ${x} para o outro?`,
    itens: [
      "Minecraft",
      "Roblox",
      "Free Fire",
      "Fortnite",
      "EA FC",
      "jogos de tabuleiro",
      "xadrez",
      "jogos de cartas",
      "jogos de corrida",
      "jogos de aventura",
    ],
  },
  {
    id: "musica",
    titulo: "Música",
    ajuda: "O que toca no seu fone.",
    peso: 0.8,
    nos: "curtem",
    ele: "curte",
    conversa: (x) => `Que música de ${x} vocês colocariam para tocar agora?`,
    itens: [
      "pop",
      "funk",
      "rock",
      "sertanejo",
      "rap e trap",
      "K-pop",
      "MPB",
      "samba e pagode",
      "música gospel",
      "música eletrônica",
      "trilhas de filmes e games",
      "música clássica",
      "forró",
    ],
  },
];

export const VIAGEM_NO_TEMPO = {
  titulo: "Se você pudesse viajar no tempo uma única vez, iria para…",
  peso: 0.7,
  opcoes: [
    "a Antiguidade",
    "a Idade Média",
    "a época das Grandes Navegações",
    "o Brasil Império",
    "os anos 1980",
    "daqui a 100 anos",
  ],
};

/* ---------- Tipos das respostas ---------- */

export type RespostaAluno = {
  id: string;
  nome: string;
  turma: string;
  /** "7-ano", "8-ano" ou "9-ano" — derivado da turma. */
  ano: string;
  /** categoria.id -> itens escolhidos */
  interesses: Record<string, string[]>;
  viagem: string;
  /** "Algo que você sabe fazer e poderia ensinar a um colega" (opcional). */
  possoEnsinar: string;
  /** Aceita aparecer como sugestão para os colegas. */
  aparecer: boolean;
  criadoEm: string;
};

export type RespostaPais = {
  id: string;
  nomeResponsavel: string;
  nomeAluno: string;
  turma: string;
  /** Mesmas categorias, mas "na sua época de escola". */
  interesses: Record<string, string[]>;
  avaliacao: number;
  mensagem: string;
  criadoEm: string;
};

/** Chave única do aluno: mesma turma + mesmo nome = mesma pessoa. */
export function chaveAluno(turma: string, nome: string) {
  return `${turma}|${normalizar(nome)}`;
}

/** Categorias que aparecem no formulário dos pais (menos gírias de 2026). */
export const CATEGORIAS_PAIS = ["epocas", "personagens", "curiosidades", "atividades"];

/* ---------- Utilidades de texto ---------- */

export function maiuscula(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** "Ana", "Ana e Bia", "Ana, Bia e Caio" */
export function listar(itens: string[]) {
  if (itens.length <= 1) return itens.join("");
  return `${itens.slice(0, -1).join(", ")} e ${itens[itens.length - 1]}`;
}

/** Chave para comparar nomes: sem acento, minúscula, espaços únicos. */
export function normalizar(s: string) {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function primeiroNome(nome: string) {
  return nome.trim().split(/\s+/)[0];
}
