# Visão geral

Tower defense de grid, inspirado em **Xeno Tactics (2007)**. O jogador constrói torres 2×2 num tabuleiro 15×15 para impedir monstros de atravessarem da esquerda para a direita.

## Loop

1. Escolher mapa desbloqueado e loadout (até 4 torres, até 3 skills).
2. Partida começa pausada: ouro **60**, HP **100**, energia de skill **0**.
3. Posicionar torres sem bloquear todos os caminhos spawn → portal.
4. Enviar ondas; ouro de kills financia compras e upgrades (nível 1–6).
5. Leak: −5 HP. HP chega a 0 → derrota.
6. Última onda limpa e sem monstros vivos → vitória: destrava a próxima torre e o próximo mapa.

Não há fast-forward global nem meta-currency fora da partida.

## Conteúdo atual

| Conteúdo | Quantidade | IDs |
|---|---|---|
| Mapas | 5 | Desert, Cemetery, Garden, Ice, Hell |
| Torres | 6 | `machine-gun`, `missile`, `heavy-gun`, `electric`, `freeze`, `anti-air` |
| Monstros | 11 | `slime`, `goblin`, `wolf`, `bee`, `plant`, `plantZombie`, `plantFire`, `orc`, `orcLord`, `slimeBoned`, `slimeVulcan` |
| Skills | 1 | `blizzard` |

## Números-chave

| Dado | Valor |
|---|---|
| Grid | 15×15 |
| Ouro inicial | 60 |
| HP inicial | 100 |
| Leak | −5 HP |
| Nível máximo de torre | 6 |
| Torres no loadout | 4 |
| Skills habilitadas | 3 |
| Energia | 3 segmentos / 15 s |
| Torre inicial | `machine-gun` |
| Skill inicial | `blizzard` |

## Referências

- Combate: [combat.md](combat.md)
- Torres: [towers.md](towers.md)
- Mapas: [maps-and-waves.md](maps-and-waves.md)
- Progressão: [progression.md](progression.md)
