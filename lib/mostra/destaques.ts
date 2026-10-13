// Conteúdo fixo da Mostra Cultural 2026 exibido nas páginas dos itinerários.
// As imagens ficam em public/mostra/<sigla>/.

export type Empresa = {
  nome: string;
  logo: string;
  descricao?: string;
};

export type Foto = {
  src: string;
  legenda: string;
};

export type Destaque = {
  titulo: string;
  texto: string;
  empresas?: Empresa[];
  galeria?: Foto[];
};

export const destaques: Record<string, Destaque> = {
  ECC1: {
    titulo: "Rede rizomática de empresas colaborativas",
    texto:
      "O ECC1 foi formado por uma rede rizomática de empresas colaborativas, representando a economia colaborativa. Os estudantes apresentaram suas empresas na Mostra Cultural, no dia 17/10.",
    empresas: [
      { nome: "Eat & Save", logo: "/mostra/ecc1/eat-save.jpg" },
      { nome: "Ateliê Liberum Form", logo: "/mostra/ecc1/atelie-liberum-form.jpg" },
      { nome: "Fit & Freeze", logo: "/mostra/ecc1/fit-freeze.jpg", descricao: "Healthy ice cream" },
      { nome: "Luméa", logo: "/mostra/ecc1/lumea.jpg", descricao: "Diário de nutrição" },
      { nome: "Raízes Verdes", logo: "/mostra/ecc1/raizes-verdes.jpg", descricao: "Hortas sustentáveis" },
    ],
  },
  ECC2: {
    titulo: "Duas empresas criadas pelos estudantes",
    texto:
      "Os alunos montaram duas empresas: uma de alimentação, a Panineria Pienza, e outra de perfumes, a Parfumum Botica. Os produtos das duas empresas foram apresentados na Mostra Cultural.",
    empresas: [
      { nome: "Panineria Pienza", logo: "/mostra/ecc2/panineria-pienza.jpg", descricao: "Sanduíches italianos artesanais" },
      { nome: "Parfumum Botica", logo: "/mostra/ecc2/parfumum-botica.jpg", descricao: "Perfumes" },
    ],
    galeria: [
      { src: "/mostra/ecc2/panineria-menu.jpg", legenda: "Cardápio da Panineria Pienza" },
      { src: "/mostra/ecc2/panino-palermo.jpg", legenda: "Panino Palermo" },
      { src: "/mostra/ecc2/panino-salento.jpg", legenda: "Panino Salento" },
    ],
  },
  CS1: {
    titulo: "Mini Docs CS 2026",
    texto:
      "Documentários sobre São Paulo produzidos pelos estudantes do 1º ano, apresentados na Mostra Cultural, no dia 17/10.",
    empresas: [{ nome: "Mini Docs CS", logo: "/mostra/cs1/mini-docs-cs.jpg", descricao: "Cinema, Cultura e Sociedade" }],
    galeria: [
      { src: "/mostra/cs1/documentarios-sao-paulo.jpg", legenda: "Documentários sobre São Paulo" },
      { src: "/mostra/cs1/logo-mais.jpg", legenda: "Logo mais: 17/10" },
      { src: "/mostra/cs1/pipoca-pop.jpg", legenda: "Pipoca Pop" },
    ],
  },
  EMA3: {
    titulo: "Entre Estrelas",
    texto: "Projeto Entre Estrelas: Espaço e Meio Ambiente.",
    empresas: [{ nome: "Entre Estrelas", logo: "/mostra/ema3/entre-estrelas.jpg", descricao: "Espaço e Meio Ambiente" }],
    galeria: [
      { src: "/mostra/ema3/ema-capa.jpg", legenda: "EMA: Espaço e Meio Ambiente" },
      { src: "/mostra/ema3/biscoito-amanteigado.jpg", legenda: "Biscoito amanteigado espacial" },
      { src: "/mostra/ema3/rifa.jpg", legenda: "Rifa" },
    ],
  },
};
