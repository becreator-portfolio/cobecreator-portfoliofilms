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

- full: H.264, até 1920×1080 (horizontal) / 1080×1920 (vertical), CRF 25, máx. 3,8 Mbps, AAC 128k, faststart. Nível H.264 até 4.2 (`-level:v 4.x -refs 4`): acima disso alguns Android recusam o arquivo.
- preview: 5 s sem áudio, 720 px (horizontal) / 480 px (vertical), CRF 28.

## Tipografia

Duas famílias, uma lógica: **a largura é hierarquia**.

- **Archivo** (variável, peso 100–900, largura 62–125%): 125% para estrutura (títulos, ecoa o "BY" do logo), 62–82% para contraste e listas, 100% para leitura.
- **Martian Mono** (variável, largura 75–112,5%): metadados e timecode — linguagem de claquete; mais encorpada que a Plex em tamanho pequeno sobre vídeo. 87,5% no desktop, 80% no celular.
- O script fica só no logo.

Escala única em `src/style.css` (`--t-xxl` → `--t-xs`); comparativo das monoespaçadas avaliadas em `tools/specimen-tipografia.png`. Arquivos em `public/fonts/` (subconjunto latino, preload, licenças OFL).

## Motion

Cada movimento tem função: na abertura a assinatura é desenhada, preenche e voa até o logo do topo enquanto o preto se dissolve sobre o reel, que já toca por baixo (um plano só, sem corte seco nem flash; na volta à página, versão curta); títulos expandem de 62% a 125% com o scroll (assinatura do eixo de largura), peças abrem como obturador, o player cresce a partir da miniatura clicada, previews mostram barra de reprodução, o índice mostra uma prévia da seção, o Block Office destaca a peça central e o botão do reel tem leve magnetismo. Tudo desligado com `prefers-reduced-motion`.

## Decisões

- Vídeos só carregam quando necessários: previews no hover (desktop) ou quando o quadro está visível (touch); o player só carrega a versão completa ao abrir.
- `prefers-reduced-motion`: sem smooth scroll, sem parallax, sem flash, sem autoplay.
- `Save-Data`: sem previews automáticos.
- Série (O Peso da História): trilho de 7 episódios; passar o cursor troca o quadro do palco, clicar toca o episódio no próprio palco (API do YouTube, host `youtube-nocookie`; sem a API, cai para iframe da playlist no índice escolhido). Trilho na ordem da série (#1→#7) com as thumbs oficiais; a playlist no YouTube está invertida, então cada episódio guarda sua posição (`idx`) em `src/data.js`. Card do canal com foto e banner oficiais e 245 mil inscritos (conferido na página do canal).
- Reel: "Do conceito ao corte final" — 35,5 s em 24 fps com os planos da pasta *frames para reels LP*, abrindo no olho iluminado pela tela e terminando no personagem que entra na parede de TVs (o preto emenda o loop). Cada quadro é único (pulldown revertido, fontes 30 fps reais tocadas a 24 fps). Três cortes do loop — 1080p, 720p e vertical 608×1080 reenquadrado. Nos loops do topo (mudos) o plano de abertura respira: o olho fica 4,75 s, com aproximação mais lenta (loop de 38 s, `tools/reel-hero.py`); o "Assistir reel" com música mantém o corte original na grade da trilha. Decupagem em `tools/reel-curadoria.md`.
- Ordem das seções pensada para leads: Campanhas (Block Office → Socializei → LV) · Série · Clipes · Social · Filmes.
- Filmes: pôsteres e prévias começam no 1º quadro de cada filme.
- No máximo 4 vídeos de preview tocam ao mesmo tempo (2 no celular). No celular a prévia devolve o decodificador ao sair da tela; se der erro, tenta de novo uma vez e fica no pôster.
- Socializei: case com 2 anúncios (01 · 00:20, 02 · 00:30) — o seletor troca vídeo, frase de fechamento e storyboard; cada quadro do storyboard abre o anúncio naquele ponto. O AD02 veio em 16:9 com barras: recortado o vertical 1215×2160 do centro, 60 fps preservados. No celular, a marca fica acima do vídeo.
- LV Agência: prévias a partir do 1º quadro.
- Player: ← → navegam entre trabalhos, M silencia, F tela cheia, Esc fecha; a interface some após 2,6 s sem movimento (desktop).
- Áreas de toque ≥ 44 px; foco visível; foco preso no player e no menu.
