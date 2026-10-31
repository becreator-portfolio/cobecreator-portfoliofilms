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

## Decisões

- Vídeos só carregam quando necessários: previews no hover (desktop) ou quando o quadro está visível (touch); o player só carrega a versão completa ao abrir.
- `prefers-reduced-motion`: sem smooth scroll, sem parallax, sem flash, sem autoplay.
- `Save-Data`: sem previews automáticos.
- Série (O Peso da História) abre a playlist do YouTube via `youtube-nocookie`, só ao clicar.
