// Conteúdo do portfólio. Somente informações confirmadas pelo autor / presentes nos arquivos.
// Cada item de mídia aponta para /media/<id>/{poster.webp, preview.mp4, full.mp4}

export const contact = {
  email: 'cobecreator@gmail.com',
  instagram: 'https://www.instagram.com/co.becreator/',
  instagramHandle: '@co.becreator',
};

export const reel = {
  id: 'reel',
  title: 'Comic Urban Realism',
  meta: 'Filme autoral',
};

// fmt: 'h' horizontal | 'v' vertical
// Ordem pensada para o desktop: um filme em destaque e depois pares de mesma proporção.
export const films = [
  { id: 'f-vibe', title: "Don't Kill My Vibe", fmt: 'h', ratio: '4:3' },
  { id: 'f-grandmas', title: 'Grandmas Are the Real Gangstas', fmt: 'h', ratio: '4:3' },
  { id: 'f-escravo', title: 'Escravo Moderno', fmt: 'h', ratio: '4:3' },
  { id: 'f-loydog1', title: 'Loydog — 01', fmt: 'h', ratio: '4:3' },
  { id: 'f-loydog2', title: 'Loydog — 02', fmt: 'h', ratio: '4:3' },
  { id: 'f-drift', title: 'Drift e Tigres', fmt: 'h', ratio: '16:9' },
  { id: 'f-5sntup', title: 'Escravo Moderno part. 2', fmt: 'h', ratio: '16:9' },
];

export const clips = [
  { id: 'c-neu', title: 'Neu, O Construtor', artist: 'Neumann', credit: 'prod. Skyline', client: 'Unânime' },
  { id: 'c-sol', title: 'O Sol Nasce pra Todos', artist: 'Neumann', credit: 'prod. Dree Veneno', client: 'Unânime' },
  { id: 'c-rivais', title: 'Não Somos Rivais', artist: 'Neumann', credit: '', client: 'Unânime' },
  { id: 'c-tamo', title: 'Tamo Competindo, Tamo Competindo', artist: 'Neumann feat. F.P.B', credit: '', client: 'Unânime' },
  { id: 'c-superchoque', title: 'Super-Choque', artist: 'Neumann & Big Rush', credit: 'Quando Eu Parar', client: 'Unânime' },
  { id: 'c-wedidit', title: 'We Did It — 20/20', artist: 'Unânime', credit: 'Animação', client: 'Unânime' },
  { id: 'c-visualizer', title: 'Nós Contra o Mundo', artist: 'Riri & Slime Cunha', credit: 'Visualizer', client: '' },
];

export const campaigns = {
  // case de abertura da seção: anúncio vertical + storyboard (clicar num quadro abre o vídeo naquele ponto)
  socializei: {
    id: 'k-socializei',
    title: 'Socializei',
    kind: 'Anúncio',
    line: ['Encontre as', 'palavras certas.'], // fechamento do próprio anúncio, sempre em 2 linhas
    board: [
      { img: 'still1', t: 2.8 },
      { img: 'still2', t: 6.2 },
      { img: 'still3', t: 9.6 },
      { img: 'still4', t: 13.1 },
      { img: 'still5', t: 16.6 },
      { img: 'still6', t: 19.9 },
    ],
  },
  block: {
    title: 'Block Office',
    kind: 'Campanha · Marca',
    items: [
      { id: 'b-1', title: 'Campanha #1', fmt: 'v' },
      { id: 'b-4', title: 'Campanha #4', fmt: 'v' },
      { id: 'b-2', title: 'Campanha #2', fmt: 'v' },
      { id: 'b-3', title: 'Campanha #3', fmt: 'v' },
      { id: 'b-5', title: 'Campanha #5', fmt: 'v' },
      { id: 'b-6', title: 'Campanha #6', fmt: 'h' },
      { id: 'b-berga', title: 'BergaOffice', fmt: 'h' },
    ],
  },
  lv: {
    title: 'LV Agência',
    kind: 'Comercial · Motion',
    items: [
      { id: 'k-lv', title: 'Comercial 01', fmt: 'h' },
      { id: 'k-lv2', title: 'Comercial 02', fmt: 'h' },
    ],
  },
};

export const series = {
  title: 'O Peso da História',
  channel: 'Laerte Viana na Área',
  subscribers: 245, // mil inscritos no YouTube (informado pelo autor)
  episodes: 7,
  playlist: 'PLPoEmTEsykRsTGYeMMsUao8u0DE1dttgc',
  firstVideo: 'H-G3O5IVWKo',
  stills: ['ep1', 'ep2', 'ep3', 'ep4', 'ep5', 'ep6', 'ep7'],
};

// Ordem pensada para o grid de 6 colunas no desktop: 4+2 / 3+3.
export const social = [
  {
    client: 'Storytrapping',
    note: 'Entrevista · Storytelling',
    items: [
      { id: 's-ryu', title: 'Ryu, the Runner · Entrevista' },
      { id: 's-ryuevt', title: 'Ryu, the Runner · Evento Block Office' },
      { id: 's-xtranho', title: 'Charles Santos · Xtranho' },
      { id: 's-lauro', title: 'Projeto Lauro' },
    ],
  },
  {
    client: 'Eduardo Cidade',
    note: 'Imobiliário',
    items: [
      { id: 's-edu1', title: 'Visita de imóvel' },
      { id: 's-edu2', title: 'Vista panorâmica' },
    ],
  },
  {
    client: 'Nico Tattoo',
    note: 'Tatuagem',
    items: [
      { id: 's-nico-catedral', title: 'Arquitetura na pele' },
      { id: 's-nico-nordica', title: 'Mitologia nórdica' },
      { id: 's-nico-2026', title: 'Isso é Nicotattoo' },
    ],
  },
  {
    client: 'Buffalo Boxing Club',
    note: 'Esporte',
    items: [
      { id: 's-buffalo', title: 'Horários' },
      { id: 's-buffalo-treino', title: 'Treino' },
      { id: 's-buffalo-peterson', title: 'Campeonato Gaúcho 2026' },
    ],
  },
];
