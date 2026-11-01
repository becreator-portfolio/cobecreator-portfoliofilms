# co.becreator — portfólio

Landing page de produção audiovisual de co.becreator. Vite + GSAP + Lenis, sem framework.

## Rodar local

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Gera `dist/` (estático). Na Vercel: importar o repositório do GitHub, framework **Vite**, build `npm run build`, output `dist`.

## Conteúdo

- `src/data.js` — títulos, clientes, ordem dos trabalhos, contato.
- `public/media/<id>/` — `poster.webp`, `preview.mp4` (loop mudo de 5 s) e `full.mp4` (versão do player).
- `src/media.json` — largura, altura e duração de cada vídeo. Regenerar com `npm run media` sempre que trocar um vídeo.

### Adicionar um trabalho

1. Gerar os arquivos em `public/media/<novo-id>/` (mesmo padrão: poster.webp, preview.mp4, full.mp4).
2. `npm run media`
3. Adicionar o item em `src/data.js`.

### Codificação usada

- full: H.264, até 1920×1080 (horizontal) / 1080×1920 (vertical), CRF 25, máx. 3,8 Mbps, AAC 128k, faststart.
- preview: 5 s sem áudio, 720 px (horizontal) / 480 px (vertical), CRF 28.

## Tipografia

Duas famílias, uma lógica: **a largura é hierarquia**.

- **Archivo** (variável, peso 100–900, largura 62–125%): 125% para estrutura (títulos, ecoa o "BY" do logo), 62–82% para contraste e listas, 100% para leitura.
- **Martian Mono** (variável, largura 75–112,5%): metadados e timecode — linguagem de claquete; mais encorpada que a Plex em tamanho pequeno sobre vídeo. 87,5% no desktop, 80% no celular.
- O script fica só no logo.

Escala única em `src/style.css` (`--t-xxl` → `--t-xs`); comparativo das monoespaçadas avaliadas em `tools/specimen-tipografia.png`. Arquivos em `public/fonts/` (subconjunto latino, preload, licenças OFL).

## Motion

Cada movimento tem função: títulos expandem de 62% a 125% com o scroll (assinatura do eixo de largura), peças abrem como obturador, o player cresce a partir da miniatura clicada, previews mostram barra de reprodução, o índice mostra uma prévia da seção, o Block Office destaca a peça central e o botão do reel tem leve magnetismo. Tudo desligado com `prefers-reduced-motion`.

## Decisões

- Vídeos só carregam quando necessários: previews no hover (desktop) ou quando o quadro está visível (touch); o player só carrega a versão completa ao abrir.
- `prefers-reduced-motion`: sem smooth scroll, sem parallax, sem flash, sem autoplay.
- `Save-Data`: sem previews automáticos.
- Série (O Peso da História) abre a playlist do YouTube via `youtube-nocookie`, só ao clicar; há também link direto para o YouTube.
- No máximo 4 vídeos de preview tocam ao mesmo tempo.
- Player: ← → navegam entre trabalhos, M silencia, F tela cheia, Esc fecha; a interface some após 2,6 s sem movimento (desktop).
- Áreas de toque ≥ 44 px; foco visível; foco preso no player e no menu.
