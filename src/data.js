// Conteúdo do portfólio. Somente informações confirmadas pelo autor / presentes nos arquivos.
// Cada item de mídia aponta para /media/<id>/{poster.webp, preview.mp4, full.mp4}

export const contact = {
  email: 'cobecreator@gmail.com',
  instagram: 'https://www.instagram.com/co.becreator/',
  instagramHandle: '@co.becreator',
};

export const reel = {
  id: 'reel',
  title: 'Reel',
  meta: 'Do conceito ao corte final · Trilha: Neumann feat. F.P.B — Tamo Competindo',
};

// fmt: 'h' horizontal | 'v' vertical
// Ordem pensada para o desktop: um filme em destaque e depois pares de mesma proporção.
// Títulos = estilo/conceito de cada filme (nome de trabalho no comentário).
export const films = [
  { id: 'f-vibe', title: 'Realismo de flash', fmt: 'h', ratio: '4:3' }, // Don't Kill My Vibe
  { id: 'f-grandmas', title: 'Gangsters da terceira idade', fmt: 'h', ratio: '4:3' }, // Grandmas Are the Real Gangstas
  { id: 'f-escravo', title: 'Surrealismo político', fmt: 'h', ratio: '4:3' }, // Escravo Moderno
  { id: 'f-iconoclastia', title: 'Iconoclastia', fmt: 'h', ratio: '16:9' },
  { id: 'f-deriva', title: 'Império à deriva', fmt: 'h', ratio: '16:9' },
  { id: 'f-drift', title: 'Noir automotivo', fmt: 'h', ratio: '16:9' }, // Drift e Tigres
  { id: 'f-5sntup', title: 'Sátira urbana', fmt: 'h', ratio: '16:9' }, // Escravo Moderno part. 2
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
      { id: 'b-6', title: 'Campanha #6', fmt: 'h', op: '35%' }, // op: centro do recorte 9:16 no celular
      { id: 'b-berga', title: 'BergaOffice', fmt: 'h', op: '55%' },
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
  subscribers: 245, // mil inscritos no YouTube (conferido na página do canal)
  episodes: 7,
  playlist: 'PLPoEmTEsykRsTGYeMMsUao8u0DE1dttgc',
  firstVideo: 'H-G3O5IVWKo',
  // Ordem da série (#1 → #7). A playlist no YouTube está invertida: idx = posição na playlist.
  // Títulos oficiais dos vídeos; thumbs oficiais em /media/serie/thumbN(.webp | -s.webp).
  list: [
    { n: 1, id: 'E879YXyR9Po', idx: 6, title: 'Como Islam Makhachev deixou Khabib para trás e se tornou o maior russo da história do UFC' },
    { n: 2, id: '0wK6OA1so84', idx: 5, title: 'O Romário do UFC: como Carlos Prates se tornou o preferido dos fãs brasileiros' },
    { n: 3, id: '9VSoEZmZOJU', idx: 4, title: 'Feito histórico: como Poatan quebrou o trash talk e criou uma nova era no UFC' },
    { n: 4, id: 'W7duGjcHA2A', idx: 3, title: 'Brasil x México: como Diego Lopes foi injustiçado pelos fãs brasileiros (UFC 325)' },
    { n: 5, id: 'AwWvhGyqWMA', idx: 2, title: 'Esperavam por essa? Como a Fighting Nerds calou os h4t3rs e deu a volta por cima' },
    { n: 6, id: '20L5h-9aJDM', idx: 1, title: 'Reviravolta: o porquê Charles do Bronxs é o verdadeiro BMF do UFC' },
    { n: 7, id: 'H-G3O5IVWKo', idx: 0, title: 'Nova era: como a Chute Boxe Diego Lima se reinventou e calou os críticos no UFC' },
  ],
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
