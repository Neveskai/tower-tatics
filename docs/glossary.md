# Glossário

Termos usados nas regras de jogo. Identificadores de código entre crases.

| Termo | Significado |
|---|---|
| **Horde / wave** | Uma onda de monstros. `currentHorde` começa em 0 (pré-jogo). A wave jogável `n` usa `waves[n-1]`. |
| **Leak** | Monstro que chega ao portal direito ainda vivo. Custa **5** de HP do jogador. |
| **Portal** | Faixa de 6 tiles na borda. Esquerda = spawn; direita = destino. |
| **Footprint 2×2** | Torre ocupa 4 tiles: `(row,col)`, `(row-1,col)`, `(row,col-1)`, `(row-1,col-1)`. |
| **Stealth** | Monstro com `special.stealth`. Começa `revealed=false` e é ignorado por targeting. |
| **Heat** | Calor por tiro. Ao atingir `maxHeat`, a torre entra em overheat e para de atirar até esfriar a 0. |
| **Energy segment** | Unidade de energia de skill. Máximo 3; regen 15 s por segmento. |
| **Catalog** | Dados remotos Firestore: `catalog_towers` (obrigatório) e `catalog_missions` (opcional). |
| **Loadout** | Torres equipadas (máx. 4) e skills habilitadas (máx. 3) escolhidas em `/play`. |
| **Pre-game** | Partida pausada com `currentHorde === 0`. Venda devolve o custo cheio. |
| **AoE** | Raio em tiles em torno do alvo do projétil (ou da torre, no caso Electric). |
| **Range** | Alcance em tiles a partir do centro da torre. |
| **Attack speed** | Tiros por segundo (`1000 / attackSpeed` ms entre tiros). |
| **Slow factor** | Multiplicador de velocidade. Menor = mais lento (0.3 é mais forte que 0.75). |
| **Discovered** | Torre já vista no inventário (UI). Distinto de `unlocked` (pode comprar/equipar). |
| **Tile** | Célula do grid 15×15. Unidade de range, AoE, tamanho visual e velocidade. |
| **Air / terrain** | `air=true` voa (ignora torres no path). Terrain = terrestre. |
| **Element** | Campo do seed Firestore (`neutral`, `fire`, `lightning`, `ice`). Sem efeito de combate hoje. |
