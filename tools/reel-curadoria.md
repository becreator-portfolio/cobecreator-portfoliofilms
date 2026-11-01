# Reel — curadoria, montagem e entrega

## Auditoria do acervo (81 arquivos do Drive)

Cada vídeo foi medido (resolução nativa, fps, bitrate por pixel, ruído, listras/scanlines, blocagem e resolução efetiva) e os candidatos foram revisados em 100%.

**Aprovados (base do reel)**
- Brutos do clipe *EUA hate* — pastas "Estátua da Liberdade no Nordeste" e "Boné vermelho": 1920×1080 nativos, 24 fps, 7–15 Mbps, sem filtro, luz e paleta coerentes.
- *Iconoclastia* (Cristo com a bandeira) — 1916×1078, um plano, com correção de cor para casar com a noite âmbar.

**Descartados**
- *Comic Urban Realism* (956×718) e versões ampliadas — sem detalhe nativo.
- *Tamo Competindo* — arquivo 4K com imagem pixelada (ampliado na origem).
- Filmes autorais com textura de CRT/scanlines (*Realismo de flash*, *Gangsters*, *Noir automotivo*) e clipes com grão forte.
- Animações cartoon — linguagem diferente da do reel.
- *TZ da Coronel* — retirado do site a pedido.
- *O Peso da História* — imagens de transmissão do UFC com textos.
- Reels sociais (720p, legendas embutidas) e arquivos abaixo de 1080p.

## Montagem (26,0 s, 18 planos, 24 fps)

Trilha: áudio original do clipe *EUA hate* (107,7 BPM); cortes nos tempos e acentos da trilha.

| # | Tempo | Plano |
|---|---|---|
| | **Ato I — sertão, entardecer** | |
| 1 | 00,00 | Estátua deitada no horizonte (abertura) |
| 2 | 02,65 | Cascos e poeira |
| 3 | 03,72 | Roda de madeira |
| 4 | 04,78 | Vaqueiros |
| 5 | 06,25 | Coroa arrastada |
| 6 | 07,43 | Aéreo do comboio |
| 7 | 09,22 | Menino e a coroa na poeira |
| | **Ato II — cidade, noite** (ponte: poeira → boné caindo; impacto no acento de 11,45) | |
| 8 | 10,89 | Boné na poça |
| 9 | 12,52 | Homem com guarda-chuva sob a chuva de bonés |
| 10 | 14,12 | Mão pega o boné |
| 11 | 15,23 | Gato |
| 12 | 16,30 | Janela |
| 13 | 17,39 | Moto |
| 14 | 18,46 | Para-brisa |
| 15 | 19,53 | Garis |
| 16 | 20,60 | Bueiro |
| | **Coda** | |
| 17 | 21,69 | Cristo com a bandeira em chamas |
| 18 | 23,31 | Aéreo da cidade tomada → volta ao plano 1 (loop: noite → amanhecer) |

Tratamento: contraste/saturação uniformes e leves; só o plano 17 recebe correção de cor. Sem sharpening, sem grão, sem upscale, sem interpolação de quadros.

## Entregas (`public/media/reel/`)

| Arquivo | Uso | Formato | Peso |
|---|---|---|---|
| `full.mp4` | "Assistir reel" (com som + cartão final) | 1920×1080 · 24 fps · 28,3 s | ~28 MB |
| `loop.mp4` | topo, telas > 1280 px | 1920×1080 · mudo · 26 s | ~15 MB |
| `loop-sm.mp4` | topo, telas até 1280 px e celular deitado | 1280×720 · mudo | ~7 MB |
| `loop-v.mp4` | topo, celular/tablet em pé | 608×1080 (recorte nativo, reenquadrado por plano) | ~6 MB |
| `poster.webp` / `poster-v.webp` | pôster = 1º quadro de cada loop | | |

Scripts: `work/reel3/build.py` (cortes e reenquadramento) e `work/reel3/export.sh` (exportações) — fora do repositório.
