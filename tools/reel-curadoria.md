# Reel — revisão da edição "fontes limpas"

Base: a edição de 40 s com trilha *Tamo Competindo* (Neumann feat. F.P.B), aprovada pelo autor.
Excluídos a pedido: cenas do cortejo da Estátua da Liberdade e dos bonés vermelhos (brutos do clipe *EUA hate*).

## Quadros repetidos

A edição anterior tinha **235 quadros repetidos em 1.221** (19%). Duas causas:

1. **Pulldown**: vídeos com animação a 24 fps exportados a 30 fps repetem 1 quadro a cada 5 (TZ, Visualizer, BergaOffice, LV, Laerte, Super-Choque, We Did It, Iconoclastia, Block Office #5). A cadência fica "picotada".
2. **Entradas em trechos parados**: alguns cortes começavam em momentos congelados da fonte (fim de animação, quadro final segurado).

Correção:
- montagem refeita em **24 fps** com o pulldown revertido (`decimate=cycle=5`), sem gerar nem descartar quadros únicos;
- todos os pontos de entrada escolhidos em janelas com 0% de repetição (varredura por janela de cada fonte);
- o plano trípitco com o Projeto Lauro (109 de 132 quadros repetidos na fonte) foi substituído pelo Cristo do *Iconoclastia*;
- o plano quase estático do senhor na praia ganhou o mesmo *push* lento dos planos de abertura.

Resultado: **2 em 895** no corte (o clarão branco da transformação e o início de um motion que acelera — ambos do próprio conteúdo).

## Super-Choque

Antes: 5 fragmentos de ~0,5 s espalhados pelo clímax, cortando a transformação no meio.
Agora: **a transformação inteira em um plano de 3,2 s** (carga → raios → clarão → revelação), seguida do golpe no chão, da carga final e da explosão, que corta para o logo.

## Vertical (celular)

608×1080 recortado da imagem nativa, reenquadrado plano a plano. Textos de motion largos demais para 9:16 (Google/Instagram, 185 milhões, "E sua empresa?", logo LV) são **trocados por outro plano** na versão vertical, em vez de aparecerem cortados.

## Entregas (`public/media/reel/`)

| Arquivo | Uso | Formato | Peso |
|---|---|---|---|
| `full.mp4` | "Assistir reel" (com som + cartão) | 1920×1080 · 24 fps · 40,7 s | 38 MB |
| `loop.mp4` | topo, telas > 1280 px | 1920×1080 · 37,3 s | 16 MB |
| `loop-sm.mp4` | topo, telas até 1280 px / celular deitado | 1280×720 | 13 MB |
| `loop-v.mp4` | topo, celular/tablet em pé | 608×1080 | 13 MB |
