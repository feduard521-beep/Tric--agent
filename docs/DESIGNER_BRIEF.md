# Brief para designer — Tricô

Referência visual: portal editorial tipo PTI (grelha limpa, barras de secção, tipografia sans).
Identidade: logo novelo+malha, navy `#002147`, terracotta `#A65E2E`, fundo branco.

## Pedir ao designer

1. **Sistema de grelha editorial** (desktop 12 colunas): hero 6–7 cols + coluna “Últimas” + ads/perfil; secções por sector em 4 cards horizontais.
2. **Barra de secção** navy com corte angular à direita + linha que atravessa a página (já no código; afinar proporções).
3. **Cartão de notícia horizontal**: thumbnail 96×72 ou 120×88 (fotografia real ou ilustração sectorial), título 2–3 linhas bold, meta cinza (“há 2 h · 3 fontes”).
4. **Header**: logo + search + nav uppercase; sem pills redondas, sem sombras suaves, sem watermarks do logo.
5. **Fotografias**: banco editorial Angola/sectores (não stock genérico “AI glow”); proporção consistente.
6. **Tipografia**: uma família sans profissional (ex. Source Sans / IBM Plex / Manrope) — títulos bold, meta regular cinza; evitar serif decorativa em todo o UI.
7. **Mobile**: stack hero → lista; bottom nav; secções com scroll horizontal opcional nos thumbnails.
8. **Estados vazios/loading**: skeleton rectangular, não cards “fofos”.
9. **Admin / Conta**: mesmo sistema visual, não um dashboard roxo.

## Evitar (parece “feito por IA”)

- Gradientes creme/terracotta suaves em todo o fundo
- Cards com sombra grande e cantos muito redondos
- Watermark do logo em opacidade baixa
- Pills flutuantes em excesso, badges glass, glow
- Ilustrações abstractas como único visual das notícias

## Entregáveis

- Figma desktop 1440 + mobile 390 (home, feed, sector, peça, onboarding, perfil)
- Tokens: cores, type scale, espaçamentos 4/8
- Componentes: SectionBar, PieceRow, PieceFeature, Header, Footer
